const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const marked = require('marked');

console.log('Starting cover letter conversion to PDF...');

// Define file paths
const rootDir = path.resolve(__dirname, '../..');
const sourceFile = path.join(rootDir, 'cover-letter.md');
const htmlFile = path.join(rootDir, 'cover-letter.html');
const pdfFile = path.join(rootDir, 'cover-letter.pdf');

// Check if source file exists
if (!fs.existsSync(sourceFile)) {
  console.error(`Error: Source file not found at ${sourceFile}`);
  process.exit(1);
}

try {
  // Read the markdown file
  const markdownContent = fs.readFileSync(sourceFile, 'utf8');
  console.log('Markdown file read successfully');

  // Convert markdown to HTML
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mark Carpenter - Cover Letter</title>
  <style>
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #2a5885;
      font-size: 28px;
      margin-bottom: 5px;
    }
    h2 {
      color: #2a5885;
      font-size: 22px;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
      margin-top: 25px;
    }
    h3 {
      color: #2a5885;
      font-size: 18px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    p {
      margin-bottom: 16px;
    }
    a {
      color: #2a5885;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 8px;
    }
    strong {
      color: #2a5885;
    }
  </style>
</head>
<body>
  ${marked.parse(markdownContent)}
</body>
</html>
  `;

  // Write the HTML file
  fs.writeFileSync(htmlFile, htmlContent);
  console.log(`HTML file created: ${htmlFile}`);

  // Check if wkhtmltopdf is installed
  try {
    execSync('which wkhtmltopdf', { stdio: 'ignore' });
    
    // Convert HTML to PDF using wkhtmltopdf
    execSync(`wkhtmltopdf --enable-local-file-access "${htmlFile}" "${pdfFile}"`, { 
      stdio: 'inherit'
    });
    console.log(`PDF file created: ${pdfFile}`);
    
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
    console.error('- Windows: Download from https://wkhtmltopdf.org/downloads.html');
    
    console.log('\nAlternatively, you can use the HTML file directly:');
    console.log(`HTML file is available at: ${htmlFile}`);
    
    // Open the HTML file instead
    const openCommand = process.platform === 'darwin' 
      ? 'open' 
      : process.platform === 'win32' 
        ? 'start' 
        : 'xdg-open';
    
    execSync(`${openCommand} "${htmlFile}"`, { stdio: 'ignore' });
    console.log('HTML file opened for viewing');
  }
  
} catch (error) {
  console.error('Error during conversion:', error);
  process.exit(1);
} 