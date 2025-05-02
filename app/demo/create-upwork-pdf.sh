#!/bin/bash

# Set script to exit on error
set -e

echo "===== QuickBooks PO Automation: Upwork-Ready PDF Creator ====="
echo ""

# Go to the directory where this script is located
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed. Please install Node.js first."
  echo "Visit https://nodejs.org/ to download and install."
  exit 1
fi

# Check if puppeteer is installed
if ! npm list puppeteer > /dev/null 2>&1; then
  echo "Puppeteer is not installed. Installing now..."
  PUPPETEER_SKIP_DOWNLOAD=true npm install puppeteer@21.9.0 --save
  echo "Puppeteer installed successfully."
fi

# Run the conversion script
echo "Starting Chrome PDF generation..."
node chrome-pdf.js

echo ""
echo "PDF creation process completed."
echo "The PDF is suitable for uploading to Upwork and retains all formatting and diagram elements." 