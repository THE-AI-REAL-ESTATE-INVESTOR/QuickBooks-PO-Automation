const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

// Define file paths
const rootDir = path.resolve(__dirname, '../..');
const demoDir = path.join(rootDir, 'app/demo');
const sourceFile = path.join(demoDir, 'pdf-export.html');
const mermaidFile = path.join(demoDir, 'mermaid-diagrams.js');
const pdfFile = path.join(rootDir, 'QuickBooks_PO_Automation_Chrome.pdf');

async function generatePDF() {
  console.log('Starting Chrome PDF generation...');
  
  if (!fs.existsSync(sourceFile)) {
    console.error(`Error: Source HTML file not found at ${sourceFile}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(mermaidFile)) {
    console.error(`Error: Mermaid diagrams file not found at ${mermaidFile}`);
    process.exit(1);
  }
  
  // Check if puppeteer is installed
  try {
    require.resolve('puppeteer');
  } catch (e) {
    console.error('Error: puppeteer is not installed. Please run:');
    console.error('npm install puppeteer --save');
    process.exit(1);
  }
  
  try {
    // Find Chrome executable path
    let executablePath = '';
    try {
      // Try to find Chrome path using puppeteer's revisions
      const { executablePath: chromePath } = require('puppeteer').executablePath();
      executablePath = chromePath;
    } catch (e) {
      // Fall back to system Chrome or Chrome for Testing
      try {
        // On macOS, try to find Chrome
        if (process.platform === 'darwin') {
          // Check if Chrome for Testing is installed
          const homeDir = require('os').homedir();
          const chromeTestingPath = path.join(
            homeDir, 
            '.cache/puppeteer/chrome/mac-121.0.6167.85/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
          );
          
          if (fs.existsSync(chromeTestingPath)) {
            executablePath = chromeTestingPath;
            console.log('Using Chrome for Testing installation');
          } else {
            // Try to use regular Chrome
            executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
            console.log('Using system Chrome installation');
          }
        } else if (process.platform === 'win32') {
          executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        } else {
          // Linux
          executablePath = '/usr/bin/google-chrome';
        }
      } catch (e) {
        console.error('Could not find Chrome executable path');
      }
    }
    
    console.log(`Using Chrome executable at: ${executablePath}`);
    
    // Read the source file and mermaid diagrams
    const htmlContent = fs.readFileSync(sourceFile, 'utf8');
    const mermaidContent = fs.readFileSync(mermaidFile, 'utf8');
    
    // Create a modified HTML that has all resources embedded
    const modifiedHtml = htmlContent.replace('</head>', `
      <script>
        // Inline the mermaid diagrams directly
        ${mermaidContent}
      </script>
      <script>
        // Initialize mermaid with specific settings for better rendering
        document.addEventListener('DOMContentLoaded', function() {
          window.mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
            securityLevel: 'loose',
            fontFamily: 'Arial, sans-serif'
          });
          
          // Force render all diagrams
          setTimeout(function() {
            if (window.mermaid) {
              try {
                window.mermaid.init(undefined, document.querySelectorAll('.mermaid'));
                console.log('Mermaid diagrams initialized');
              } catch (e) {
                console.error('Error initializing mermaid:', e);
              }
            }
          }, 1000);
        });
      </script>
    </head>`);
    
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: 'new',  // Use new headless mode
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--allow-file-access-from-files'
      ],
      executablePath: executablePath || undefined
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Set up console logging for debugging
    page.on('console', message => console.log(`Browser console: ${message.text()}`));
    
    // Set content and wait until all resources and scripts are loaded
    await page.setContent(modifiedHtml, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Set the page size
    await page.setViewport({ width: 1200, height: 800 });
    
    // Inject script to handle Mermaid rendering
    await page.evaluate(() => {
      return new Promise((resolve) => {
        // Check if mermaid is loaded
        if (typeof window.mermaid !== 'undefined') {
          // Force re-render the diagrams
          try {
            window.mermaid.init(undefined, document.querySelectorAll('.mermaid'));
            console.log('Mermaid diagrams initialized via injection');
          } catch (e) {
            console.error('Error initializing mermaid via injection:', e);
          }
        }
        
        // Wait to ensure rendering completes
        setTimeout(resolve, 2000);
      });
    });
    
    // Wait longer to ensure all diagrams are fully rendered
    console.log('Waiting for diagrams to render...');
    await page.waitForTimeout(5000);
    
    // Generate PDF
    console.log('Generating PDF...');
    await page.pdf({
      path: pdfFile,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      displayHeaderFooter: false,
    });
    
    // Close the browser
    await browser.close();
    
    // Get file size
    const stats = fs.statSync(pdfFile);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`\n✅ Chrome PDF generated successfully: ${pdfFile}`);
    console.log(`File size: ${fileSizeMB} MB`);
    console.log('\nThis PDF should upload reliably to Upwork without any conversion issues.');
    
    // Open the PDF
    const platform = process.platform;
    if (platform === 'darwin') {
      require('child_process').exec(`open "${pdfFile}"`);
    } else if (platform === 'win32') {
      require('child_process').exec(`start "" "${pdfFile}"`);
    } else if (platform === 'linux') {
      require('child_process').exec(`xdg-open "${pdfFile}"`);
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    process.exit(1);
  }
}

// Run the function
generatePDF(); 