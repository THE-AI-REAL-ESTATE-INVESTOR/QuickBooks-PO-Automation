#!/bin/bash

# Go to the directory where this script is located
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    echo "Visit https://nodejs.org/ to download and install."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

# Create a temporary package.json if it doesn't exist
if [ ! -f "./package.json" ]; then
    echo "Creating temporary package.json file..."
    echo '{
  "name": "pdf-maker",
  "version": "1.0.0",
  "description": "PDF maker for QuickBooks PO Automation",
  "main": "pdf-maker.js",
  "scripts": {
    "generate": "node pdf-maker.js"
  },
  "dependencies": {
    "puppeteer": "^21.5.2"
  }
}' > ./package.json
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run the PDF generator
echo "Generating PDF..."
node pdf-maker.js

# Check if the PDF was created
if [ -f "../../QuickBooks_PO_Automation.pdf" ]; then
    echo "✅ PDF generation completed successfully!"
    echo "PDF saved to: $(cd ../.. && pwd)/QuickBooks_PO_Automation.pdf"
    
    # Try to open the PDF on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Opening PDF..."
        open "../../QuickBooks_PO_Automation.pdf"
    # Try to open on Windows
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        echo "Opening PDF..."
        start "../../QuickBooks_PO_Automation.pdf"
    # Try to open on Linux
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Opening PDF..."
        xdg-open "../../QuickBooks_PO_Automation.pdf" || echo "PDF created but couldn't open automatically. Find it at $(cd ../.. && pwd)/QuickBooks_PO_Automation.pdf"
    else
        echo "PDF created successfully. Find it at $(cd ../.. && pwd)/QuickBooks_PO_Automation.pdf"
    fi
else
    echo "❌ PDF generation failed. Check the logs above for errors."
fi 