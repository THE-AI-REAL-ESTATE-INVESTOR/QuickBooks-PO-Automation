import dotenv from 'dotenv';
import { processSampleData } from './services/sampleDataProcessor.js';
import { extractPOData } from './services/dataExtractor.js';
import { validatePurchaseOrder } from './services/dataValidator.js';
import { syncWithQuickBooks } from './services/quickbooksIntegration.js';
import { PurchaseOrder } from './types.js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Starting QB Automation MVP...');
  
  try {
    // Process sample data
    console.log('Processing sample expense data...');
    const sampleData = await processSampleData();
    console.log(`Processed ${sampleData.length} sample records`);
    
    // For demo purposes, let's use a sample PO file
    console.log('Extracting data from sample PO...');
    const samplePOPath = path.join(__dirname, '../../data/sample_po.txt');
    const samplePOText = readFileSync(samplePOPath, 'utf8');
    
    // Extract PO data using OCR and NLP
    const extractedData = await extractPOData(samplePOText);
    console.log('Extracted PO data:', JSON.stringify(extractedData.processedData, null, 2));
    
    // Validate the extracted PO data
    const validationResult = validatePurchaseOrder(extractedData.processedData as PurchaseOrder);
    
    if (!validationResult.isValid) {
      console.error('Validation errors:', validationResult.errors);
      return;
    }
    
    console.log('PO data validated successfully');
    
    // Sync with QuickBooks
    console.log('Syncing with QuickBooks...');
    await syncWithQuickBooks(extractedData.processedData as PurchaseOrder);
    
    console.log('Process completed successfully');
  } catch (error) {
    console.error('An error occurred during processing:', error);
  }
}

main().catch(console.error); 