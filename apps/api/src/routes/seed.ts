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
    
    // Debug: Check first document structure
    if (documents.length > 0) {
      const firstDoc = documents[0];
      console.log('Sample document structure:', {
        hasExtractedData: !!firstDoc.extractedData,
        hasLlmData: !!firstDoc.extractedData?.llmData,
        llmDataKeys: firstDoc.extractedData?.llmData ? Object.keys(firstDoc.extractedData.llmData) : [],
        hasInvoice: !!firstDoc.extractedData?.llmData?.invoice,
        hasVendor: !!firstDoc.extractedData?.llmData?.vendor,
        invoiceStructure: firstDoc.extractedData?.llmData?.invoice ? {
          hasValue: !!firstDoc.extractedData.llmData.invoice.value,
          keys: Object.keys(firstDoc.extractedData.llmData.invoice)
        } : null,
        vendorStructure: firstDoc.extractedData?.llmData?.vendor ? {
          hasValue: !!firstDoc.extractedData.llmData.vendor.value,
          keys: Object.keys(firstDoc.extractedData.llmData.vendor)
        } : null
      });
    }

    // Create vendors and customers map to avoid duplicates
    const vendorMap = new Map<string, string>();
    const customerMap = new Map<string, string>();
    let processedCount = 0;
    let skippedCount = 0;

    for (const doc of documents) {
      let invoiceData: any = null;
      let invoiceNumber: string = 'unknown';
      
      try {
        const llmData = doc.extractedData?.llmData;
        if (!llmData) {
          skippedCount++;
          continue;
        }

        invoiceData = llmData.invoice?.value;
        const vendorData = llmData.vendor?.value;
        const customerData = llmData.customer?.value;
        const paymentData = llmData.payment?.value;
        const summaryData = llmData.summary?.value;
        const lineItemsData = llmData.lineItems?.value;

        // More lenient check - only require invoice and vendor
        if (!invoiceData || !vendorData) {
          if (processedCount === 0 && skippedCount < 3) {
            console.log(`Skipping doc ${doc._id}: missing invoiceData or vendorData`, {
              hasInvoice: !!invoiceData,
              hasVendor: !!vendorData,
              hasLlmData: !!llmData
            });
          }
          skippedCount++;
          continue;
        }

        // Check if vendor has a name
        const vendorName = vendorData.vendorName?.value;
        if (!vendorName) {
          if (processedCount === 0 && skippedCount < 3) {
            console.log(`Skipping doc ${doc._id}: missing vendorName`, {
              vendorDataKeys: Object.keys(vendorData || {})
            });
          }
          skippedCount++;
          continue;
        }

        // Get or create vendor
        const vendorNameKey = vendorName || 'Unknown';
        let vendorId: string | undefined = vendorMap.get(vendorNameKey);
        if (!vendorId) {
          const vendor = await prisma.vendor.upsert({
            where: { name: vendorNameKey },
            update: {},
            create: {
              name: vendorNameKey,
              email: vendorData.vendorEmail?.value || null,
              phone: vendorData.vendorPhone?.value || null,
              address: vendorData.vendorAddress?.value || null,
              taxId: vendorData.vendorTaxId?.value || null,
            },
          });
          vendorId = vendor.id;
          if (vendorId) {
            vendorMap.set(vendorNameKey, vendorId);
          }
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
            if (customerId) {
              customerMap.set(customerData.customerName.value, customerId);
            }
          }
        }

        // Parse dates
        const invoiceDate = invoiceData.invoiceDate?.value
          ? new Date(invoiceData.invoiceDate.value)
          : new Date();
        const dueDate = paymentData?.dueDate?.value
          ? new Date(paymentData.dueDate.value)
          : null;

        // Ensure vendorId is set (should always be set at this point)
        if (!vendorId) {
          console.error('Vendor ID is missing, skipping invoice');
          skippedCount++;
          continue;
        }

        // Determine status
        let status = 'pending';
        if (dueDate && dueDate < new Date()) {
          status = 'overdue';
        }

        // Generate unique invoice number if missing
        invoiceNumber = invoiceData.invoiceId?.value || `INV-${Date.now()}-${processedCount}`;
        
        // Ensure invoice number is unique by checking if it exists and appending suffix if needed
        let baseInvoiceNumber = invoiceNumber;
        let suffix = 1;
        while (true) {
          const existing = await prisma.invoice.findUnique({
            where: { invoiceNumber: invoiceNumber }
          });
          if (!existing) {
            break; // Invoice number is unique, we can use it
          }
          // Invoice number exists, append suffix
          invoiceNumber = `${baseInvoiceNumber}-${suffix}`;
          suffix++;
          if (suffix > 1000) {
            // Safety check to avoid infinite loop
            invoiceNumber = `${baseInvoiceNumber}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            break;
          }
        }
        
        // Create invoice
        const invoice = await prisma.invoice.create({
          data: {
            invoiceNumber: invoiceNumber,
            vendorId, // Now TypeScript knows vendorId is string (not undefined)
            customerId,
            issueDate: invoiceDate,
            dueDate,
            status,
            subtotal: summaryData?.subTotal?.value || 0,
            tax: summaryData?.totalTax?.value || 0,
            total: summaryData?.invoiceTotal?.value || 0,
            currency: summaryData?.currencySymbol?.value || 'USD',
            lineItems: {
              create: (() => {
                // Handle different lineItems structures
                let items: any[] = [];
                if (lineItemsData) {
                  if (Array.isArray((lineItemsData as any).items)) {
                    items = (lineItemsData as any).items;
                  } else if (Array.isArray((lineItemsData as any).value?.items)) {
                    items = (lineItemsData as any).value.items;
                  } else if (Array.isArray((lineItemsData as any).value)) {
                    items = (lineItemsData as any).value;
                  } else if (Array.isArray(lineItemsData)) {
                    items = lineItemsData;
                  }
                }
                return items.map((item: any) => {
                // Handle both nested .value structure and direct values
                const description = item.description?.value ?? item.description ?? 'Item';
                const category = item.Sachkonto?.value ?? item.Sachkonto ?? null;
                const quantity = item.quantity?.value ?? item.quantity ?? 1;
                const unitPrice = item.unitPrice?.value ?? item.unitPrice ?? 0;
                const amount = item.totalPrice?.value ?? item.totalPrice ?? item.amount ?? 0;
                
                return {
                  description: typeof description === 'string' ? description : 'Item',
                  category: typeof category === 'string' ? category : null,
                  quantity: typeof quantity === 'number' ? quantity : 1,
                  unitPrice: typeof unitPrice === 'number' ? unitPrice : 0,
                  amount: typeof amount === 'number' ? amount : 0,
                };
              });
              })(),
            },
          },
        });

        processedCount++;
        if (processedCount % 10 === 0) {
          console.log(`✅ Processed ${processedCount} invoices...`);
        }
      } catch (error: any) {
        const errorMessage = error?.message || String(error);
        const errorCode = error?.code || 'UNKNOWN';
        
        // Handle duplicate invoice number error
        if (errorCode === 'P2002' || errorMessage.includes('Unique constraint')) {
          console.warn(`⚠️  Skipping document ${doc._id}: Duplicate invoice number`);
        } else {
          console.error(`❌ Error processing document ${doc._id}:`, {
            code: errorCode,
            message: errorMessage,
            invoiceNumber: invoiceData?.invoiceId?.value || 'unknown'
          });
        }
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

