import dotenv from 'dotenv';
import { processSampleData } from '../src/services/sampleDataProcessor.js';
import { extractPOData } from '../src/services/dataExtractor.js';
import { validatePurchaseOrder, enrichPurchaseOrderData } from '../src/services/dataValidator.js';
import { syncWithQuickBooks } from '../src/services/quickbooksIntegration.js';
import { PurchaseOrder } from '../src/types.js';
import { readFileSync, writeFileSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// Initialize environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Open browser with presentation
function openPresentation() {
  const presentationPath = path.join(__dirname, '../../app/demo/presentation.html');
  const absPath = path.resolve(presentationPath);
  const url = `file://${absPath}`;
  
  // Determine platform-specific open command
  let command;
  switch (process.platform) {
    case 'darwin':
      command = `open "${url}"`;
      break;
    case 'win32':
      command = `start "" "${url}"`;
      break;
    default:
      command = `xdg-open "${url}"`;
  }
  
  // Execute the command
  exec(command, (error) => {
    if (error) {
      console.error(`Error opening presentation: ${error}`);
    } else {
      console.log('Presentation opened in your default browser');
    }
  });
}

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Array to store output for presentation
const demoOutput: string[] = [];

/**
 * Prints a styled header to the console and captures for presentation
 */
function printHeader(text: string): void {
  const line = '═'.repeat(text.length + 8);
  const headerOutput = '\n' + line + '\n' + '═══ ' + text + ' ═══\n' + line + '\n';
  
  console.log('\n' + colors.cyan + line + colors.reset);
  console.log(colors.cyan + '═══' + colors.reset + colors.bright + colors.white + ' ' + text + ' ' + colors.reset + colors.cyan + '═══' + colors.reset);
  console.log(colors.cyan + line + colors.reset + '\n');
  
  demoOutput.push(headerOutput);
}

/**
 * Simulates typing effect for demo purposes and captures for presentation
 */
async function typeText(text: string, speed = 10): Promise<void> {
  for (let i = 0; i < text.length; i++) {
    process.stdout.write(text[i]);
    await new Promise(resolve => setTimeout(resolve, speed));
  }
  process.stdout.write('\n');
  
  demoOutput.push(text);
}

/**
 * Updates the presentation with the demo output
 */
async function updatePresentationWithOutput(): Promise<void> {
  const presentationPath = path.join(__dirname, '../../app/demo/presentation.html');
  let presentationHtml = readFileSync(presentationPath, 'utf8');
  
  // Format the demo output for HTML
  const formattedOutput = demoOutput.map(line => {
    // Highlight key phrases
    let htmlLine = line
      .replace(/AI-powered/gi, '<span class="demo-highlight">AI-powered</span>')
      .replace(/OpenRouter/gi, '<span class="demo-highlight">OpenRouter</span>')
      .replace(/QuickBooks/gi, '<span class="demo-highlight">QuickBooks</span>')
      .replace(/extracted/gi, '<span class="demo-output">extracted</span>')
      .replace(/successful/gi, '<span class="demo-success">successful</span>')
      .replace(/synced/gi, '<span class="demo-success">synced</span>')
      .replace(/validated/gi, '<span class="demo-success">validated</span>')
      .replace(/failed/gi, '<span class="demo-error">failed</span>')
      .replace(/error/gi, '<span class="demo-error">error</span>');
    
    // Add success indicators
    if (line.includes('✓')) {
      htmlLine = htmlLine.replace(/✓[^<]*/g, match => `<span class="demo-success">${match}</span>`);
    }
    
    // Format numeric values
    htmlLine = htmlLine.replace(/\d+(\.\d+)?%/g, match => `<span class="demo-output">${match}</span>`);
    htmlLine = htmlLine.replace(/\d+(\.\d+)? seconds/g, match => `<span class="demo-output">${match}</span>`);
    
    return `<div class="demo-line">${htmlLine}</div>`;
  }).join('\n');
  
  // Update the demo-content div in the presentation
  const demoContentPlaceholder = '<div id="demo-content" class="demo-container">';
  const newDemoContent = `<div id="demo-content" class="demo-container">\n${formattedOutput}`;
  
  presentationHtml = presentationHtml.replace(
    /<div id="demo-content" class="demo-container">[\s\S]*?<\/div>/,
    newDemoContent + '</div>'
  );
  
  // Update the demo slide with success message
  if (demoOutput.some(line => line.includes('Demo completed successfully'))) {
    presentationHtml = presentationHtml.replace(
      /<div id="demo-status">[^<]*<\/div>/,
      '<div id="demo-status" class="demo-success">✓ Demo completed successfully!</div>'
    );
  }
  
  // Write the updated presentation
  await fs.writeFile(presentationPath, presentationHtml);
}

/**
 * Creates additional demo purchase order data
 */
async function createDemoData(): Promise<void> {
  const dataDir = path.join(__dirname, '../../data');
  
  // Create data directory if it doesn't exist
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
  }
  
  // Create luxury fashion purchase order
  const luxuryPOPath = path.join(dataDir, 'luxury_fashion_po.txt');
  const luxuryPO = `
PURCHASE ORDER

PO Number: PO-2023-11-01
Date: November 1, 2023

VENDOR:
LuxuryTextiles International
78 Fashion Avenue
Milan, MI 20121
Email: orders@luxurytextiles.com

SHIP TO:
Haute Couture Designs
123 Designer Row
Fashion District, NY 10018

ITEMS:
SKU: LT-SILK-PREMIUM-001
Description: Premium Italian Silk - Scarlet Red
Quantity: 75 yards
Unit Price: $68.50
Amount: $5,137.50

SKU: LT-LACE-FRENCH-002
Description: Handcrafted French Lace - Ivory
Quantity: 40 yards
Unit Price: $95.75
Amount: $3,830.00

SKU: LT-WOOL-CASHMERE-003
Description: Cashmere Wool Blend - Midnight Blue
Quantity: 60 yards
Unit Price: $112.25
Amount: $6,735.00

Subtotal: $15,702.50
Tax (6.5%): $1,020.66
Total: $16,723.16

Payment Terms: Net 45
Notes: Priority shipping required for upcoming winter collection
  `;
  
  await fs.writeFile(luxuryPOPath, luxuryPO);
  
  // Create beauty supplies purchase order
  const beautyPOPath = path.join(dataDir, 'beauty_supplies_po.txt');
  const beautyPO = `
PURCHASE ORDER

PO Number: PO-2023-11-10
Date: November 10, 2023

VENDOR:
Organic Beauty Ingredients Co.
456 Natural Way
Portland, OR 97201
Email: wholesale@organicbeauty.com

SHIP TO:
Radiance Cosmetics Lab
789 Glow Street
Los Angeles, CA 90210

ITEMS:
SKU: OB-ES-LAVENDER-004
Description: Organic Lavender Essential Oil
Quantity: 25 bottles
Unit Price: $42.99
Amount: $1,074.75

SKU: OB-BUTTER-SHEA-005
Description: Raw Unrefined Shea Butter - Organic
Quantity: 50 kg
Unit Price: $28.50
Amount: $1,425.00

SKU: OB-EXTRACT-ROSE-006
Description: Rose Extract - Premium Quality
Quantity: 15 liters
Unit Price: $85.00
Amount: $1,275.00

SKU: OB-PACKAGING-ECO-007
Description: Eco-Friendly Bamboo Containers
Quantity: 1000 pcs
Unit Price: $2.75
Amount: $2,750.00

Subtotal: $6,524.75
Tax (9%): $587.23
Total: $7,111.98

Payment Terms: Net 30
Notes: All ingredients must be certified organic with documentation
  `;
  
  await fs.writeFile(beautyPOPath, beautyPO);
  
  // Generate HTML report template
  const reportTemplatePath = path.join(dataDir, 'report_template.html');
  const reportTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuickBooks PO Automation Report</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #ddd;
      padding-bottom: 10px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2a5885;
    }
    .company {
      font-size: 18px;
      color: #666;
    }
    .po-details {
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .po-details h2 {
      margin-top: 0;
      color: #2a5885;
    }
    .po-field {
      margin-bottom: 10px;
    }
    .po-field strong {
      display: inline-block;
      width: 150px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 12px 15px;
      border: 1px solid #ddd;
    }
    th {
      background-color: #2a5885;
      color: white;
      font-weight: 500;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .totals {
      text-align: right;
      margin-top: 20px;
    }
    .validation {
      margin-top: 30px;
    }
    .validation h2 {
      color: #2a5885;
    }
    .status {
      padding: 5px 10px;
      border-radius: 3px;
      font-weight: 500;
    }
    .success {
      background-color: #d4edda;
      color: #155724;
    }
    .error {
      background-color: #f8d7da;
      color: #721c24;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 14px;
      color: #777;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
    .qb-status {
      margin-top: 30px;
      padding: 15px;
      background-color: #e9f5ff;
      border-left: 5px solid #2a5885;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">QuickBooks PO Automation</div>
    <div class="company">[[COMPANY_NAME]]</div>
    <div>Automated Processing Report</div>
  </div>

  <div class="po-details">
    <h2>Purchase Order Details</h2>
    <div class="po-field"><strong>PO Number:</strong> [[PO_NUMBER]]</div>
    <div class="po-field"><strong>Date:</strong> [[PO_DATE]]</div>
    <div class="po-field"><strong>Vendor:</strong> [[VENDOR_NAME]]</div>
    <div class="po-field"><strong>Vendor Address:</strong> [[VENDOR_ADDRESS]]</div>
    <div class="po-field"><strong>Vendor Email:</strong> [[VENDOR_EMAIL]]</div>
    <div class="po-field"><strong>Payment Terms:</strong> [[PAYMENT_TERMS]]</div>
  </div>

  <h2>Line Items</h2>
  <table>
    <thead>
      <tr>
        <th>SKU</th>
        <th>Description</th>
        <th>Category</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      [[TABLE_ROWS]]
    </tbody>
  </table>

  <div class="totals">
    <div><strong>Subtotal:</strong> $[[SUBTOTAL]]</div>
    <div><strong>Tax:</strong> $[[TAX]]</div>
    <div style="font-size: 18px; font-weight: bold; margin-top: 10px;"><strong>Total:</strong> $[[TOTAL]]</div>
  </div>

  <div class="validation">
    <h2>Validation Results</h2>
    <div><strong>Status:</strong> <span class="status [[VALIDATION_CLASS]]">[[VALIDATION_STATUS]]</span></div>
    [[VALIDATION_DETAILS]]
  </div>

  <div class="qb-status">
    <h2>QuickBooks Integration</h2>
    <div><strong>Status:</strong> [[QB_STATUS]]</div>
    <div><strong>QuickBooks PO ID:</strong> [[QB_PO_ID]]</div>
    <div><strong>Processing Time:</strong> [[PROCESSING_TIME]]</div>
  </div>

  <div class="footer">
    <p>This report was automatically generated by QuickBooks PO Automation</p>
    <p>Processed on [[PROCESSING_DATE]]</p>
  </div>
</body>
</html>`;
  
  await fs.writeFile(reportTemplatePath, reportTemplate);
}

/**
 * Generates an HTML report from a purchase order
 */
function generateReport(po: PurchaseOrder, validationResult: any, qbResult: any, processingTime: number): string {
  const dataDir = path.join(__dirname, '../../data');
  const reportTemplatePath = path.join(dataDir, 'report_template.html');
  const template = readFileSync(reportTemplatePath, 'utf8');
  
  // Format items table rows
  let tableRows = '';
  po.items.forEach(item => {
    tableRows += `
      <tr>
        <td>${item.sku}</td>
        <td>${item.description}</td>
        <td>${item.category || 'General'}</td>
        <td>${item.quantity}</td>
        <td>$${item.unitPrice.toFixed(2)}</td>
        <td>$${item.amount.toFixed(2)}</td>
      </tr>
    `;
  });
  
  // Format validation details
  let validationDetails = '';
  if (!validationResult.isValid) {
    validationDetails = '<ul>';
    validationResult.errors.forEach((error: any) => {
      validationDetails += `<li>${error.field}: ${error.message}</li>`;
    });
    validationDetails += '</ul>';
  } else {
    validationDetails = '<div>All purchase order data is valid.</div>';
  }
  
  // Replace placeholders in template
  let report = template
    .replace('[[COMPANY_NAME]]', 'Haute Couture Designs')
    .replace('[[PO_NUMBER]]', po.poNumber)
    .replace('[[PO_DATE]]', po.date)
    .replace('[[VENDOR_NAME]]', po.vendorName)
    .replace('[[VENDOR_ADDRESS]]', po.vendorAddress)
    .replace('[[VENDOR_EMAIL]]', po.vendorEmail)
    .replace('[[PAYMENT_TERMS]]', po.paymentTerms || 'Not specified')
    .replace('[[TABLE_ROWS]]', tableRows)
    .replace('[[SUBTOTAL]]', po.subtotal.toFixed(2))
    .replace('[[TAX]]', po.tax.toFixed(2))
    .replace('[[TOTAL]]', po.total.toFixed(2))
    .replace('[[VALIDATION_CLASS]]', validationResult.isValid ? 'success' : 'error')
    .replace('[[VALIDATION_STATUS]]', validationResult.isValid ? 'VALID' : 'INVALID')
    .replace('[[VALIDATION_DETAILS]]', validationDetails)
    .replace('[[QB_STATUS]]', 'Successfully synchronized')
    .replace('[[QB_PO_ID]]', qbResult.id)
    .replace('[[PROCESSING_TIME]]', `${processingTime.toFixed(2)} seconds`)
    .replace('[[PROCESSING_DATE]]', new Date().toLocaleString());
  
  return report;
}

/**
 * Demo the QB Automation process
 */
async function runDemo() {
  printHeader('QuickBooks PO Automation Demo');
  
  await typeText('Welcome to the QuickBooks PO Automation demo!', 20);
  await typeText('This demo will show how our AI-powered system extracts data from purchase orders', 20);
  await typeText('and automatically integrates with QuickBooks Desktop Enterprise.', 20);
  console.log();
  demoOutput.push('');
  
  // Create demo data if it doesn't exist
  await createDemoData();
  
  // Step 1: Process sample data
  printHeader('Step 1: Loading Industry-Specific Data');
  await typeText('Loading fashion & beauty industry expense data...', 20);
  const startSampleData = Date.now();
  const sampleData = await processSampleData();
  const endSampleData = Date.now();
  await typeText(`Loaded ${sampleData.length} expense records in ${((endSampleData - startSampleData) / 1000).toFixed(2)} seconds`, 20);
  
  console.log('\nSample expense categories:');
  demoOutput.push('\nSample expense categories:');
  const categories = [...new Set(sampleData.map(item => item.category))];
  categories.forEach(category => {
    const count = sampleData.filter(item => item.category === category).length;
    console.log(`  ${colors.green}✓${colors.reset} ${category}: ${count} items`);
    demoOutput.push(`  ✓ ${category}: ${count} items`);
  });
  
  // Update presentation with progress
  await updatePresentationWithOutput();
  
  // Step 2: Extract data from PO
  printHeader('Step 2: AI-Powered Data Extraction');
  
  await typeText('Loading purchase order document...', 20);
  const poPath = path.join(__dirname, '../../data/luxury_fashion_po.txt');
  const poText = readFileSync(poPath, 'utf8');
  
  console.log('\nPurchase Order Text Preview:');
  demoOutput.push('\nPurchase Order Text Preview:');
  const previewLines = poText.split('\n').slice(1, 10);
  previewLines.forEach(line => {
    console.log(`  ${line}`);
    demoOutput.push(`  ${line}`);
  });
  console.log('  ...');
  demoOutput.push('  ...');
  
  await typeText('\nStarting AI-powered data extraction...', 20);
  const startExtraction = Date.now();
  const extractedData = await extractPOData(poText);
  const endExtraction = Date.now();
  
  await typeText(`Data extracted in ${((endExtraction - startExtraction) / 1000).toFixed(2)} seconds with ${(extractedData.confidence * 100).toFixed(0)}% confidence`, 20);
  
  console.log('\nExtracted Data:');
  demoOutput.push('\nExtracted Data:');
  console.log(`  ${colors.green}✓${colors.reset} PO Number: ${extractedData.processedData.poNumber}`);
  demoOutput.push(`  ✓ PO Number: ${extractedData.processedData.poNumber}`);
  console.log(`  ${colors.green}✓${colors.reset} Date: ${extractedData.processedData.date}`);
  demoOutput.push(`  ✓ Date: ${extractedData.processedData.date}`);
  console.log(`  ${colors.green}✓${colors.reset} Vendor: ${extractedData.processedData.vendorName}`);
  demoOutput.push(`  ✓ Vendor: ${extractedData.processedData.vendorName}`);
  console.log(`  ${colors.green}✓${colors.reset} Items: ${extractedData.processedData.items?.length || 0} line items extracted`);
  demoOutput.push(`  ✓ Items: ${extractedData.processedData.items?.length || 0} line items extracted`);
  console.log(`  ${colors.green}✓${colors.reset} Total: $${extractedData.processedData.total?.toFixed(2)}`);
  demoOutput.push(`  ✓ Total: $${extractedData.processedData.total?.toFixed(2)}`);
  
  // Update presentation with progress
  await updatePresentationWithOutput();
  
  // Step 3: Validate extracted data
  printHeader('Step 3: Data Validation & Enrichment');
  
  await typeText('Validating extracted purchase order data...', 20);
  const startValidation = Date.now();
  const validationResult = validatePurchaseOrder(extractedData.processedData as PurchaseOrder);
  
  if (validationResult.isValid) {
    await typeText(`${colors.green}Validation successful!${colors.reset} All data meets business requirements.`, 20);
    demoOutput[demoOutput.length - 1] = 'Validation successful! All data meets business requirements.';
  } else {
    await typeText(`${colors.red}Validation failed.${colors.reset} Found ${validationResult.errors.length} issues:`, 20);
    demoOutput[demoOutput.length - 1] = `Validation failed. Found ${validationResult.errors.length} issues:`;
    validationResult.errors.forEach((error: any) => {
      console.log(`  ${colors.red}✗${colors.reset} ${error.field}: ${error.message}`);
      demoOutput.push(`  ✗ ${error.field}: ${error.message}`);
    });
  }
  
  await typeText('\nEnriching data with business context...', 20);
  const enrichedPO = enrichPurchaseOrderData(extractedData.processedData as PurchaseOrder);
  const endValidation = Date.now();
  
  console.log('\nEnriched Categories:');
  demoOutput.push('\nEnriched Categories:');
  enrichedPO.items.forEach(item => {
    console.log(`  ${colors.green}✓${colors.reset} ${item.description}: ${colors.cyan}${item.category}${colors.reset}`);
    demoOutput.push(`  ✓ ${item.description}: ${item.category}`);
  });
  
  // Update presentation with progress
  await updatePresentationWithOutput();
  
  // Step 4: QuickBooks Integration
  printHeader('Step 4: QuickBooks Integration');
  
  await typeText('Initiating QuickBooks Desktop Enterprise integration...', 20);
  const startQBSync = Date.now();
  const qbResult = await syncWithQuickBooks(enrichedPO);
  const endQBSync = Date.now();
  
  await typeText(`${colors.green}Purchase order successfully synced with QuickBooks!${colors.reset}`, 20);
  demoOutput[demoOutput.length - 1] = 'Purchase order successfully synced with QuickBooks!';
  await typeText(`Created PO #${enrichedPO.poNumber} in QuickBooks (ID: ${qbResult})`, 20);
  
  // Generate and save report
  printHeader('Generating Report');
  
  await typeText('Generating detailed processing report...', 20);
  const totalTime = (endQBSync - startExtraction) / 1000;
  const reportHtml = generateReport(
    enrichedPO, 
    validationResult, 
    { id: qbResult },
    totalTime
  );
  
  const reportPath = path.join(__dirname, '../../data/po_processing_report.html');
  writeFileSync(reportPath, reportHtml);
  
  await typeText(`${colors.green}Report generated successfully!${colors.reset}`, 20);
  demoOutput[demoOutput.length - 1] = 'Report generated successfully!';
  await typeText(`Saved to: ${reportPath}`, 20);
  
  // Summary
  printHeader('Process Summary');
  
  console.log(`${colors.bright}${colors.white}Purchase Order:${colors.reset} ${enrichedPO.poNumber}`);
  demoOutput.push(`Purchase Order: ${enrichedPO.poNumber}`);
  console.log(`${colors.bright}${colors.white}Vendor:${colors.reset} ${enrichedPO.vendorName}`);
  demoOutput.push(`Vendor: ${enrichedPO.vendorName}`);
  console.log(`${colors.bright}${colors.white}Total Items:${colors.reset} ${enrichedPO.items.length}`);
  demoOutput.push(`Total Items: ${enrichedPO.items.length}`);
  console.log(`${colors.bright}${colors.white}Total Amount:${colors.reset} $${enrichedPO.total.toFixed(2)}`);
  demoOutput.push(`Total Amount: $${enrichedPO.total.toFixed(2)}`);
  console.log(`${colors.bright}${colors.white}Extraction Confidence:${colors.reset} ${(extractedData.confidence * 100).toFixed(0)}%`);
  demoOutput.push(`Extraction Confidence: ${(extractedData.confidence * 100).toFixed(0)}%`);
  console.log(`${colors.bright}${colors.white}Processing Time:${colors.reset} ${totalTime.toFixed(2)} seconds`);
  demoOutput.push(`Processing Time: ${totalTime.toFixed(2)} seconds`);
  console.log(`${colors.bright}${colors.white}QuickBooks Status:${colors.reset} ${colors.green}Synced Successfully${colors.reset}`);
  demoOutput.push(`QuickBooks Status: Synced Successfully`);
  
  console.log('\n' + colors.green + colors.bright + 'Demo completed successfully!' + colors.reset);
  demoOutput.push('\nDemo completed successfully!');
  
  // Final update to presentation with all output
  await updatePresentationWithOutput();
  
  // Open the report
  const reportAbsPath = path.resolve(reportPath);
  const reportUrl = `file://${reportAbsPath}`;
  
  let command;
  switch (process.platform) {
    case 'darwin':
      command = `open "${reportUrl}"`;
      break;
    case 'win32':
      command = `start "" "${reportUrl}"`;
      break;
    default:
      command = `xdg-open "${reportUrl}"`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error(`Error opening report: ${error}`);
    } else {
      console.log('Report opened in your default browser');
    }
  });
}

// Open presentation then run the demo
openPresentation();
runDemo().catch(console.error); 