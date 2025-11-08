import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface DocumentData {
  _id: string;
  name: string;
  status: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  extractedData?: {
    llmData?: {
      invoice?: {
        value?: {
          invoiceId?: { value: string };
          invoiceDate?: { value: string };
          deliveryDate?: { value: string };
        };
      };
      vendor?: {
        value?: {
          vendorName?: { value: string };
          vendorAddress?: { value: string };
          vendorTaxId?: { value: string };
          vendorEmail?: { value: string };
          vendorPhone?: { value: string };
        };
      };
      customer?: {
        value?: {
          customerName?: { value: string };
          customerAddress?: { value: string };
        };
      };
      payment?: {
        value?: {
          dueDate?: { value: string };
          paymentTerms?: { value: string };
        };
      };
      summary?: {
        value?: {
          subTotal?: { value: number };
          totalTax?: { value: number };
          invoiceTotal?: { value: number };
          currencySymbol?: { value: string };
        };
      };
      lineItems?: {
        value?: {
          items?: Array<{
            description?: { value: string };
            quantity?: { value: number };
            unitPrice?: { value: number };
            totalPrice?: { value: number };
            Sachkonto?: { value: string };
          }>;
        };
      };
    };
  };
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Read the JSON file
  const dataPath = path.join(__dirname, '../../../data/Analytics_Test_Data.json');
  
  if (!fs.existsSync(dataPath)) {
    console.log('⚠️  Analytics_Test_Data.json not found. Creating sample data...');
    await createSampleData();
    return;
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const documents: DocumentData[] = JSON.parse(rawData);

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.vendor.deleteMany();

  console.log(`📦 Processing ${documents.length} documents...`);

  // Create vendors and customers map to avoid duplicates
  const vendorMap = new Map<string, string>();
  const customerMap = new Map<string, string>();
  let processedCount = 0;
  let skippedCount = 0;

  for (const doc of documents) {
    try {
      const llmData = doc.extractedData?.llmData;
      if (!llmData) {
        skippedCount++;
        continue;
      }

      const invoiceData = llmData.invoice?.value;
      const vendorData = llmData.vendor?.value;
      const customerData = llmData.customer?.value;
      const summaryData = llmData.summary?.value;
      const paymentData = llmData.payment?.value;
      const lineItemsData = llmData.lineItems?.value?.items?.value || llmData.lineItems?.value?.items || [];

      // Skip if essential data is missing
      if (!invoiceData?.invoiceId?.value || !vendorData?.vendorName?.value || !summaryData) {
        skippedCount++;
        continue;
      }

      // Handle vendor
      const vendorName = vendorData.vendorName.value;
      let vendorId = vendorMap.get(vendorName);
      if (!vendorId) {
        const vendor = await prisma.vendor.upsert({
          where: { name: vendorName },
          update: {},
          create: {
            name: vendorName,
            email: vendorData.vendorEmail?.value,
            phone: vendorData.vendorPhone?.value,
            address: vendorData.vendorAddress?.value,
            taxId: vendorData.vendorTaxId?.value,
          },
        });
        vendorId = vendor.id;
        vendorMap.set(vendorName, vendorId);
      }

      // Handle customer
      let customerId: string | null = null;
      if (customerData?.customerName?.value) {
        const customerName = customerData.customerName.value;
        customerId = customerMap.get(customerName) || null;
        if (!customerId) {
          const customer = await prisma.customer.upsert({
            where: { name: customerName },
            update: {},
            create: {
              name: customerName,
              address: customerData.customerAddress?.value,
            },
          });
          customerId = customer.id;
          customerMap.set(customerName, customerId);
        }
      }

      // Parse dates
      const invoiceDate = invoiceData.invoiceDate?.value 
        ? new Date(invoiceData.invoiceDate.value)
        : new Date(doc.createdAt.$date);
      
      const dueDate = paymentData?.dueDate?.value 
        ? new Date(paymentData.dueDate.value)
        : null;

      // Determine status based on document status and dates
      let status = 'pending';
      if (doc.status === 'processed' || doc.status === 'validated') {
        status = 'paid';
      } else if (dueDate && dueDate < new Date()) {
        status = 'overdue';
      }

      // Get amounts (handle negative values for credit notes)
      const subtotal = Math.abs(summaryData.subTotal?.value || 0);
      const tax = Math.abs(summaryData.totalTax?.value || 0);
      const total = Math.abs(summaryData.invoiceTotal?.value || subtotal + tax);
      const currency = summaryData.currencySymbol?.value || 'EUR';

      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: invoiceData.invoiceId.value || `INV-${doc._id.substring(0, 8)}`,
          vendorId,
          customerId,
          issueDate: invoiceDate,
          dueDate: dueDate,
          status: status,
          subtotal: subtotal,
          tax: tax,
          total: total,
          currency: currency,
          notes: doc.name,
          lineItems: {
            create: (Array.isArray(lineItemsData) ? lineItemsData : [])
              .filter((item: any) => {
                // Filter out invalid items
                const qty = item.quantity?.value ?? item.quantity;
                const price = item.unitPrice?.value ?? item.unitPrice;
                const total = item.totalPrice?.value ?? item.totalPrice;
                return !isNaN(qty) && !isNaN(price) && !isNaN(total);
              })
              .map((item: any) => {
                const categoryValue = item.Sachkonto?.value;
                const category = typeof categoryValue === 'string' ? categoryValue : 
                               (categoryValue === null || categoryValue === undefined) ? null : 
                               String(categoryValue);
                
                const qty = item.quantity?.value ?? item.quantity ?? 1;
                const price = item.unitPrice?.value ?? item.unitPrice ?? 0;
                const total = item.totalPrice?.value ?? item.totalPrice ?? 0;
                
                return {
                  description: item.description?.value || item.description || 'N/A',
                  category: category,
                  quantity: Math.abs(isNaN(qty) ? 1 : qty),
                  unitPrice: Math.abs(isNaN(price) ? 0 : price),
                  amount: Math.abs(isNaN(total) ? 0 : total),
                };
              }),
          },
        },
      });

      processedCount++;
      if (processedCount % 100 === 0) {
        console.log(`✅ Processed ${processedCount} invoices...`);
      }
    } catch (error) {
      console.error(`❌ Error processing document ${doc._id}:`, error);
      skippedCount++;
    }
  }

  console.log(`🎉 Seeded ${processedCount} invoices successfully!`);
  if (skippedCount > 0) {
    console.log(`⚠️  Skipped ${skippedCount} documents (missing data)`);
  }
}

async function createSampleData() {
  // Create sample vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1-555-0101',
      address: '123 Business St, City, State 12345',
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      name: 'Tech Solutions Inc',
      email: 'info@techsolutions.com',
      phone: '+1-555-0202',
    },
  });

  // Create sample customer
  const customer = await prisma.customer.create({
    data: {
      name: 'Global Enterprises',
      email: 'billing@global.com',
    },
  });

  // Create sample invoices
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-001',
      vendorId: vendor1.id,
      customerId: customer.id,
      issueDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      status: 'paid',
      subtotal: 10000,
      tax: 800,
      total: 10800,
      currency: 'USD',
      lineItems: {
        create: [
          {
            description: 'Software License',
            category: 'Software',
            quantity: 1,
            unitPrice: 10000,
            amount: 10000,
          },
        ],
      },
      payments: {
        create: [
          {
            amount: 10800,
            paymentDate: new Date('2024-02-10'),
            paymentMethod: 'bank_transfer',
            referenceNumber: 'PAY-001',
          },
        ],
      },
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-002',
      vendorId: vendor2.id,
      customerId: customer.id,
      issueDate: new Date('2024-02-01'),
      dueDate: new Date('2024-03-01'),
      status: 'pending',
      subtotal: 5000,
      tax: 400,
      total: 5400,
      currency: 'USD',
      lineItems: {
        create: [
          {
            description: 'Consulting Services',
            category: 'Services',
            quantity: 40,
            unitPrice: 125,
            amount: 5000,
          },
        ],
      },
    },
  });

  console.log('✅ Created sample data with 2 invoices');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
