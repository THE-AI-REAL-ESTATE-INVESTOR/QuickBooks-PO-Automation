#!/bin/bash

# Go to the directory where this script is located
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    echo "Visit https://nodejs.org/ to download and install."
    exit 1
fi

# Create a temporary package.json if it doesn't exist
if [ ! -f "./package.json" ]; then
    echo "Creating temporary package.json file..."
    echo '{
  "name": "standalone-creator",
  "version": "1.0.0",
  "description": "Standalone HTML creator for QuickBooks PO Automation",
  "main": "create-standalone.js",
  "dependencies": {
    "cheerio": "^1.0.0-rc.12"
  }
}' > ./package.json
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create the Node.js script to generate standalone HTML
echo "Creating standalone script..."
cat > create-standalone.js << 'EOF'
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Read the HTML file
const htmlPath = path.join(__dirname, 'pdf-export.html');
const outputPath = path.join(__dirname, '..', '..', 'QuickBooks_PO_Automation_Standalone.html');

// Read mermaid scripts
const mermaidScriptPath = path.join(__dirname, 'mermaid-diagrams.js');
let mermaidDiagrams = '';
try {
  mermaidDiagrams = fs.readFileSync(mermaidScriptPath, 'utf8');
} catch (e) {
  console.error('Error reading mermaid diagrams:', e);
}

// Read the HTML content
const html = fs.readFileSync(htmlPath, 'utf8');

// Load the HTML into cheerio
const $ = cheerio.load(html);

// Inline the mermaid diagrams script
$('head').append(`<script id="inline-mermaid-diagrams">${mermaidDiagrams}</script>`);

// Inline Font Awesome styles (we'll use a CDN version for simplicity)
// We keep the CDN for Font Awesome as it's a large library

// Add navigation instructions to the top of the page
$('body').prepend(`
<div style="background-color: #f0f7ff; padding: 10px; margin: 10px 0; border-radius: 5px; border: 1px solid #cce5ff; text-align: center;">
  <p style="margin: 0;"><strong>Navigation:</strong> Use Page Down/Up keys or scroll to navigate. All content is on a single page.</p>
</div>
`);

// Remove any script sources that might rely on local files
$('script').each((i, el) => {
  const src = $(el).attr('src');
  if (src && !src.startsWith('http') && !src.startsWith('//')) {
    // If it's the mermaid script, we want to keep it as a CDN
    if (src.includes('mermaid')) {
      $(el).attr('src', 'https://cdn.jsdelivr.net/npm/mermaid@10.6.0/dist/mermaid.min.js');
    } else {
      // For other local scripts, we'd need to handle them case by case
      // For now, we'll keep the CDN for mermaid and inline our own script
    }
  }
});

// Write the standalone HTML file
fs.writeFileSync(outputPath, $.html());
console.log(`Standalone HTML file created at: ${outputPath}`);
EOF

# Run the Node.js script
echo "Generating standalone HTML file..."
node create-standalone.js

# Check if the standalone HTML was created
if [ -f "../../QuickBooks_PO_Automation_Standalone.html" ]; then
    echo "✅ Standalone HTML file created successfully!"
    echo "File saved to: $(cd ../.. && pwd)/QuickBooks_PO_Automation_Standalone.html"
    
    # Try to open the file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Opening HTML file..."
        open "../../QuickBooks_PO_Automation_Standalone.html"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        echo "Opening HTML file..."
        start "../../QuickBooks_PO_Automation_Standalone.html"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Opening HTML file..."
        xdg-open "../../QuickBooks_PO_Automation_Standalone.html" || echo "HTML file created but couldn't open automatically."
    else
        echo "HTML file created successfully."
    fi
else
    echo "❌ Failed to create standalone HTML file."
fi 