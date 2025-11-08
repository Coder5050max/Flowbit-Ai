import { Router } from 'express';
import { execSync } from 'child_process';
import * as path from 'path';

export const seedRouter = Router();

// One-time seed endpoint (remove after seeding for security)
seedRouter.post('/', async (req, res) => {
  try {
    console.log('🌱 Starting database seed via API...');
    
    // Import and run the seed function directly
    // This avoids needing to run tsx in production
    const { PrismaClient } = require('@prisma/client');
    const fs = require('fs');
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

    // Read the JSON file
    // Try multiple paths since build structure may vary
    const rootDataPath = path.join(process.cwd(), '../../data/Analytics_Test_Data.json');
    const altDataPath = path.join(__dirname, '../../../data/Analytics_Test_Data.json');
    const cwdDataPath = path.join(process.cwd(), 'data/Analytics_Test_Data.json');
    
    let filePath: string | null = null;
    if (fs.existsSync(rootDataPath)) {
      filePath = rootDataPath;
    } else if (fs.existsSync(altDataPath)) {
      filePath = altDataPath;
    } else if (fs.existsSync(cwdDataPath)) {
      filePath = cwdDataPath;
    }
    
    if (!filePath) {
      return res.status(404).json({
        error: 'Analytics_Test_Data.json not found',
        details: `Tried paths: ${rootDataPath}, ${altDataPath}, ${cwdDataPath}`,
        message: 'Make sure the data file is included in your deployment at data/Analytics_Test_Data.json',
        cwd: process.cwd(),
        __dirname: __dirname
      });
    }

    console.log(`📂 Reading data from: ${filePath}`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const documents: DocumentData[] = JSON.parse(rawData);

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
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
        const paymentData = llmData.payment?.value;
        const summaryData = llmData.summary?.value;
        const lineItemsData = llmData.lineItems?.value;

        if (!invoiceData || !vendorData || !summaryData) {
          skippedCount++;
          continue;
        }

        // Get or create vendor
        let vendorId = vendorMap.get(vendorData.vendorName?.value || '');
        if (!vendorId) {
          const vendor = await prisma.vendor.upsert({
            where: { name: vendorData.vendorName?.value || 'Unknown' },
            update: {},
            create: {
              name: vendorData.vendorName?.value || 'Unknown',
              email: vendorData.vendorEmail?.value || null,
              phone: vendorData.vendorPhone?.value || null,
              address: vendorData.vendorAddress?.value || null,
              taxId: vendorData.vendorTaxId?.value || null,
            },
          });
          vendorId = vendor.id;
          vendorMap.set(vendorData.vendorName?.value || '', vendorId);
        }

        // Get or create customer
        let customerId: string | null = null;
        if (customerData?.customerName?.value) {
          customerId = customerMap.get(customerData.customerName.value) || null;
          if (!customerId) {
            const customer = await prisma.customer.upsert({
              where: { name: customerData.customerName.value },
              update: {},
              create: {
                name: customerData.customerName.value,
                address: customerData.customerAddress?.value || null,
              },
            });
            customerId = customer.id;
            customerMap.set(customerData.customerName.value, customerId);
          }
        }

        // Parse dates
        const invoiceDate = invoiceData.invoiceDate?.value
          ? new Date(invoiceData.invoiceDate.value)
          : new Date();
        const dueDate = paymentData?.dueDate?.value
          ? new Date(paymentData.dueDate.value)
          : null;

        // Determine status
        let status = 'pending';
        if (dueDate && dueDate < new Date()) {
          status = 'overdue';
        }

        // Create invoice
        const invoice = await prisma.invoice.create({
          data: {
            invoiceNumber: invoiceData.invoiceId?.value || `INV-${Date.now()}-${processedCount}`,
            vendorId,
            customerId,
            issueDate: invoiceDate,
            dueDate,
            status,
            subtotal: summaryData.subTotal?.value || 0,
            tax: summaryData.totalTax?.value || 0,
            total: summaryData.invoiceTotal?.value || 0,
            currency: summaryData.currencySymbol?.value || 'USD',
            lineItems: {
              create: (lineItemsData?.items || []).map((item: any) => ({
                description: item.description?.value || 'Item',
                category: item.Sachkonto?.value || null,
                quantity: item.quantity?.value || 1,
                unitPrice: item.unitPrice?.value || 0,
                amount: item.totalPrice?.value || 0,
              })),
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

    await prisma.$disconnect();

    console.log(`🎉 Seeded ${processedCount} invoices successfully!`);
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} documents (missing data)`);
    }

    res.json({
      success: true,
      message: 'Database seeded successfully',
      processed: processedCount,
      skipped: skippedCount,
    });
  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

