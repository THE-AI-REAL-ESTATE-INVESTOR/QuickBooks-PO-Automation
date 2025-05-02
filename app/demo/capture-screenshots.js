const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Define file paths
const rootDir = path.resolve(__dirname, '../..');
const demoDir = path.join(rootDir, 'app/demo');
const diagramsFile = path.join(demoDir, 'render-diagrams.html');
const outputDir = path.join(rootDir, 'screenshots');

// Define the diagram names in order
const diagramNames = ['workflow-diagram', 'architecture-diagram', 'roi-diagram'];

async function captureScreenshots() {
  console.log('Starting diagram screenshot capture...');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  if (!fs.existsSync(diagramsFile)) {
    console.error(`Error: Diagrams HTML file not found at ${diagramsFile}`);
    process.exit(1);
  }
  
  try {
    // Find Chrome executable path
    let executablePath = '';
    try {
      if (process.platform === 'darwin') {
        executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        console.log('Using system Chrome installation');
      } else if (process.platform === 'win32') {
        executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
      } else {
        executablePath = '/usr/bin/google-chrome';
      }
    } catch (e) {
      console.error('Could not find Chrome executable path');
    }
    
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: executablePath || undefined
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Add console logging to help with debugging
    page.on('console', msg => console.log('Browser console:', msg.text()));
    
    // First, modify the HTML to add IDs to diagram containers if they don't exist
    console.log('Preparing to modify diagram container IDs...');
    
    // Navigate to the diagrams page
    console.log(`Opening diagrams page: ${diagramsFile}`);
    await page.goto(`file://${diagramsFile}`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Set the page size
    await page.setViewport({ width: 1200, height: 800 });
    
    // Add IDs to diagram containers if they don't have them
    await page.evaluate((diagramNames) => {
      const containers = document.querySelectorAll('.diagram-container');
      containers.forEach((container, index) => {
        if (!container.id && index < diagramNames.length) {
          container.id = diagramNames[index];
          console.log(`Added ID "${diagramNames[index]}" to diagram container ${index+1}`);
        }
      });
    }, diagramNames);
    
    // Wait for diagrams to render
    console.log('Waiting for diagrams to render...');
    await page.waitForTimeout(5000);
    
    // Get all diagram containers
    const diagramContainers = await page.$$('.diagram-container');
    console.log(`Found ${diagramContainers.length} diagram containers`);
    
    // Capture screenshots of each diagram
    for (let i = 0; i < diagramContainers.length && i < diagramNames.length; i++) {
      const container = diagramContainers[i];
      const diagramName = diagramNames[i];
      
      console.log(`Capturing screenshot for diagram: ${diagramName}`);
      
      // Take screenshot of just this diagram
      const screenshotPath = path.join(outputDir, `${diagramName}.png`);
      await container.screenshot({
        path: screenshotPath,
        omitBackground: false
      });
      
      console.log(`Screenshot saved to: ${screenshotPath}`);
    }
    
    // Take a screenshot of the entire page as well
    await page.screenshot({
      path: path.join(outputDir, 'full-diagrams.png'),
      fullPage: true
    });
    
    // Close the browser
    await browser.close();
    
    console.log('\n✅ All diagram screenshots captured successfully!');
    console.log(`Screenshot directory: ${outputDir}`);
    
    // Now create a new PDF export file with the screenshots embedded
    await createPdfWithScreenshots();
    
  } catch (error) {
    console.error('Error capturing screenshots:', error.message);
    process.exit(1);
  }
}

async function createPdfWithScreenshots() {
  try {
    const pdfExportFile = path.join(demoDir, 'pdf-export.html');
    const modifiedPdfFile = path.join(rootDir, 'QuickBooks_PO_Automation_Upwork.pdf');
    
    if (!fs.existsSync(pdfExportFile)) {
      console.error(`Error: PDF export HTML file not found at ${pdfExportFile}`);
      return;
    }
    
    // Read the PDF export HTML
    let htmlContent = fs.readFileSync(pdfExportFile, 'utf8');
    
    // Replace the mermaid diagrams with the screenshot images
    htmlContent = htmlContent.replace(
      '<div class="mermaid" id="workflow-diagram"></div>',
      `<img src="screenshots/workflow-diagram.png" alt="Workflow Diagram" style="width:100%;">`
    );
    
    htmlContent = htmlContent.replace(
      '<div class="mermaid" id="architecture-diagram"></div>',
      `<img src="screenshots/architecture-diagram.png" alt="Architecture Diagram" style="width:100%;">`
    );
    
    htmlContent = htmlContent.replace(
      '<div class="mermaid" id="roi-diagram"></div>',
      `<img src="screenshots/roi-diagram.png" alt="ROI Diagram" style="width:100%;">`
    );
    
    // Fix the video container - replace with a static image and link
    htmlContent = htmlContent.replace(
      /<div class="video-container".*?<\/iframe>\s*<\/div>/s,
      `<div style="text-align: center; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
        <div style="background-color: #2a5885; color: white; padding: 15px; border-radius: 8px; width: 60%; margin: 0 auto; text-align: center;">
          <p style="font-size: 18px; margin: 0;"><strong>Watch Demo Video</strong></p>
          <p style="margin: 10px 0 0 0;">www.loom.com/share/0cf17967404c4a1faa3b74ed34e43e62</p>
        </div>
        <p style="margin-top: 20px; font-style: italic;">Click the link above to view the complete demonstration video</p>
      </div>`
    );
    
    // Fix the CTA button styling
    htmlContent = htmlContent.replace(
      /<a href=".*?" class="cta-button">\s*<i class="fas fa-paper-plane"><\/i> Get Started Today\s*<\/a>/g,
      `<div style="display: inline-block; background-color: #2a5885; color: white; padding: 12px 25px; border-radius: 5px; font-weight: bold; text-align: center;">
        <i class="fas fa-paper-plane" style="margin-right: 8px;"></i> Get Started Today
      </div>`
    );
    
    // Fix the Upwork profile link button
    htmlContent = htmlContent.replace(
      /<a href=".*?Upwork Profile.*?<\/a>/g,
      `<div style="display: inline-block; background-color: #2a5885; color: white; padding: 12px 25px; border-radius: 5px; font-weight: bold; margin-right: 15px; text-align: center;">
        <i class="fas fa-user-tie" style="margin-right: 8px;"></i> Hire on Upwork
      </div>`
    );
    
    // Fix the website link button
    htmlContent = htmlContent.replace(
      /<a href=".*?Visit Website.*?<\/a>/g,
      `<div style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 25px; border-radius: 5px; font-weight: bold; text-align: center;">
        <i class="fas fa-globe" style="margin-right: 8px;"></i> Visit Website
      </div>`
    );
    
    // Write modified HTML to a temporary file
    const tempHtmlFile = path.join(rootDir, 'temp-pdf-with-screenshots.html');
    fs.writeFileSync(tempHtmlFile, htmlContent);
    
    // Find Chrome executable path
    let executablePath = '';
    if (process.platform === 'darwin') {
      executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    } else if (process.platform === 'win32') {
      executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    } else {
      executablePath = '/usr/bin/google-chrome';
    }
    
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: executablePath || undefined
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Add local file access for the screenshots
    await page.setRequestInterception(true);
    page.on('request', request => {
      const url = request.url();
      if (url.startsWith('file://') && url.includes('screenshots/')) {
        const imagePath = url.replace('file://', '');
        try {
          const imageBuffer = fs.readFileSync(imagePath);
          request.respond({
            status: 200,
            contentType: 'image/png',
            body: imageBuffer
          });
        } catch (error) {
          request.continue();
        }
      } else {
        request.continue();
      }
    });
    
    // Navigate to the modified HTML file
    await page.goto(`file://${tempHtmlFile}`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Generate PDF
    console.log('Generating PDF with embedded screenshots...');
    await page.pdf({
      path: modifiedPdfFile,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      displayHeaderFooter: false,
    });
    
    // Close the browser
    await browser.close();
    
    // Clean up temporary file
    fs.unlinkSync(tempHtmlFile);
    
    // Get file size
    const stats = fs.statSync(modifiedPdfFile);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`\n✅ PDF with screenshots generated successfully: ${modifiedPdfFile}`);
    console.log(`File size: ${fileSizeMB} MB`);
    console.log(`\nThe PDF has proper formatting for buttons and video placeholders.`);
    
    // Open the PDF
    const platform = process.platform;
    if (platform === 'darwin') {
      require('child_process').exec(`open "${modifiedPdfFile}"`);
    } else if (platform === 'win32') {
      require('child_process').exec(`start "" "${modifiedPdfFile}"`);
    } else if (platform === 'linux') {
      require('child_process').exec(`xdg-open "${modifiedPdfFile}"`);
    }
    
  } catch (error) {
    console.error('Error creating PDF with screenshots:', error.message);
  }
}

// Run the function
captureScreenshots(); 