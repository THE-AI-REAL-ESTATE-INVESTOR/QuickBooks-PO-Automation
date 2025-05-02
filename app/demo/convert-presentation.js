const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting presentation conversion to PDF...');

// Define file paths
const rootDir = path.resolve(__dirname, '../..');
const demoDir = path.join(rootDir, 'app/demo');
const sourceFile = path.join(demoDir, 'pdf-export.html');
const pdfFile = path.join(rootDir, 'QuickBooks_PO_Automation_Presentation.pdf');

// Check if source file exists
if (!fs.existsSync(sourceFile)) {
  console.error(`Error: Source HTML file not found at ${sourceFile}`);
  process.exit(1);
}

try {
  console.log('Source HTML file found');
  
  // Check if wkhtmltopdf is installed first
  try {
    execSync('which wkhtmltopdf', { stdio: 'ignore' });
    console.log('wkhtmltopdf found, proceeding with PDF generation');
    
    // Convert HTML to PDF using wkhtmltopdf with optimal settings for Upwork
    execSync(`wkhtmltopdf \
      --enable-local-file-access \
      --enable-javascript \
      --javascript-delay 1000 \
      --no-stop-slow-scripts \
      --page-size Letter \
      --margin-top 15 \
      --margin-right 15 \
      --margin-bottom 15 \
      --margin-left 15 \
      "${sourceFile}" "${pdfFile}"`, { 
      stdio: 'inherit'
    });
    
    console.log(`\n✅ PDF file created successfully: ${pdfFile}`);
    console.log('\nThis PDF should upload reliably to Upwork without any conversion issues.');
    
    // Get file size
    const stats = fs.statSync(pdfFile);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`File size: ${fileSizeMB} MB`);
    
    // Open the PDF file
    const openCommand = process.platform === 'darwin' 
      ? 'open' 
      : process.platform === 'win32' 
        ? 'start' 
        : 'xdg-open';
    
    execSync(`${openCommand} "${pdfFile}"`, { stdio: 'ignore' });
    console.log('PDF opened for viewing');
    
  } catch (err) {
    console.error('\nError: wkhtmltopdf is not installed. Please install it using one of these methods:');
    console.error('- macOS: brew install wkhtmltopdf');
    console.error('- Ubuntu/Debian: sudo apt-get install wkhtmltopdf');
    console.error('- Windows: Download from https://wkhtmltopdf.org/downloads.html\n');
    
    console.log('Would you like me to install wkhtmltopdf for you? (If on Mac)');
    console.log('Run: brew install wkhtmltopdf');
    
    console.log('\nAlternatively, you can use Chrome to save the HTML as PDF:');
    console.log('1. Open the HTML file in Chrome');
    console.log('2. Press Ctrl+P (or Cmd+P on Mac)');
    console.log('3. Change destination to "Save as PDF"');
    console.log('4. Set Paper size to "Letter"');
    console.log('5. Set Margins to "Default"');
    console.log('6. Ensure "Background graphics" option is checked');
    console.log('7. Click "Save"');
    
    // Open the HTML file instead
    const openCommand = process.platform === 'darwin' 
      ? 'open' 
      : process.platform === 'win32' 
        ? 'start' 
        : 'xdg-open';
    
    execSync(`${openCommand} "${sourceFile}"`, { stdio: 'ignore' });
    console.log('\nHTML file opened in browser for manual PDF conversion');
  }
  
} catch (error) {
  console.error('\nError during conversion:', error.message);
  process.exit(1);
} 