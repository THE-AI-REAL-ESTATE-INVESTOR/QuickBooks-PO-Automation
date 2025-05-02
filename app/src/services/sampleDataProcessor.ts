import { SampleExpense } from '../types.js';
import fs from 'fs/promises';
import csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Processes sample data from CSV file
 * @returns Promise<SampleExpense[]> Array of sample expenses
 */
export async function processSampleData(): Promise<SampleExpense[]> {
  const dataPath = path.join(__dirname, '../../../data/sample_expenses.csv');
  
  // Check if the file exists, if not create it
  try {
    await fs.access(dataPath);
  } catch (error) {
    // File doesn't exist, create sample data
    await createSampleData();
  }
  
  // Read and parse the CSV file
  return new Promise((resolve, reject) => {
    const results: SampleExpense[] = [];
    
    createReadStream(dataPath)
      .pipe(csvParser())
      .on('data', (data: SampleExpense) => {
        results.push({
          date: data.date,
          vendorName: data.vendorName,
          category: data.category,
          description: data.description,
          amount: parseFloat(data.amount.toString()),
          paymentMethod: data.paymentMethod,
          reference: data.reference
        });
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Creates sample expense data CSV file
 */
async function createSampleData(): Promise<void> {
  const dataDir = path.join(__dirname, '../../../data');
  const dataPath = path.join(dataDir, 'sample_expenses.csv');
  
  // Create data directory if it doesn't exist
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
  }
  
  // Fashion & Beauty industry common expenses
  const sampleData = [
    'date,vendorName,category,description,amount,paymentMethod,reference\n',
    '2023-10-01,FashionFabrics Inc,Inventory,Premium Cotton Fabric,2500.00,ACH,INV-001234\n',
    '2023-10-03,BeautySupplies Co,Inventory,Makeup Kits - Fall Collection,4750.50,Credit Card,PO-567\n',
    '2023-10-05,StyleBox Packaging,Supplies,Custom Branded Boxes,1200.75,Check,CHK-987\n',
    '2023-10-08,Fashion Week LLC,Marketing,Runway Show Participation,8500.00,Wire Transfer,FW-2023-45\n',
    '2023-10-10,Studio Lights,Equipment,Photography Lighting Setup,3200.00,Credit Card,SL-10982\n',
    '2023-10-12,Cosmetic Chemicals,Raw Materials,Essential Oils Batch,1845.25,ACH,CC-7856\n',
    '2023-10-15,Model Agency Inc,Services,Product Photography Session,2750.00,Check,MA-45678\n',
    '2023-10-18,Shipping Express,Logistics,International Shipping,1675.50,Credit Card,SE-34267\n',
    '2023-10-20,Thread & Needle,Inventory,Sewing Supplies Bulk Order,925.75,ACH,TN-87651\n',
    '2023-10-22,Beauty Expo,Marketing,Exhibition Booth Rental,5500.00,Wire Transfer,BE-2023-11\n',
    '2023-10-25,Textile Importers,Inventory,Silk Fabric - Premium,6200.25,Check,TI-77823\n',
    '2023-10-28,Creative Designs,Services,Product Packaging Design,3750.00,Credit Card,CD-12345\n',
    '2023-10-30,Cosmetic Containers,Supplies,Lotion Bottles - 8oz,1870.50,ACH,CC-98712\n'
  ];
  
  // Write sample data to file
  await fs.writeFile(dataPath, sampleData.join(''));
  
  // Create sample PO text file for OCR simulation
  const samplePOPath = path.join(dataDir, 'sample_po.txt');
  const samplePO = `
PURCHASE ORDER

PO Number: PO-2023-10-15
Date: October 15, 2023

VENDOR:
FashionFabrics Inc
123 Textile Ave
Fabric City, FC 12345
Email: orders@fashionfabrics.com

SHIP TO:
Beauty & Fashion Co
456 Style Blvd
Fashion Town, FT 67890

ITEMS:
SKU: FF-COTTON-100
Description: Premium Cotton Fabric - White
Quantity: 100 yards
Unit Price: $12.50
Amount: $1,250.00

SKU: FF-SILK-50
Description: Luxury Silk Fabric - Black
Quantity: 50 yards
Unit Price: $25.00
Amount: $1,250.00

SKU: FF-BUTTONS-1000
Description: Metal Buttons - Gold
Quantity: 1000 pcs
Unit Price: $0.45
Amount: $450.00

Subtotal: $2,950.00
Tax (8%): $236.00
Total: $3,186.00

Payment Terms: Net 30
Notes: Please deliver by October 30, 2023
  `;
  
  await fs.writeFile(samplePOPath, samplePO);
} 