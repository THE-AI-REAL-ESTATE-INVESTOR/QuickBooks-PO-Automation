const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// File paths
const htmlPath = path.join(__dirname, 'pdf-export.html');
const outputPath = path.join(__dirname, '..', '..', 'QuickBooks_PO_Automation.pdf');

async function generatePDF() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    console.log('Opening new page...');
    const page = await browser.newPage();
    
    // Set viewport for a good PDF size
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 1,
    });

    console.log('Loading HTML file...');
    // Load the HTML file
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Make sure all mermaid diagrams are rendered
    console.log('Rendering mermaid diagrams...');
    await page.waitForFunction(
      () => {
        const diagrams = document.querySelectorAll('.mermaid');
        for (const diagram of diagrams) {
          if (!diagram.querySelector('svg')) {
            return false;
          }
        }
        return true;
      },
      { timeout: 10000 }
    );

    // Give a bit more time for diagrams to render properly
    await page.waitForTimeout(2000);

    console.log('Generating PDF...');
    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      displayHeaderFooter: false
    });

    console.log(`PDF successfully generated at: ${outputPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    await browser.close();
  }
}

generatePDF(); 