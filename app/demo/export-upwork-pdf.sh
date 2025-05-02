#!/bin/bash

# Set script to exit on error
set -e

echo "===== QuickBooks PO Automation: Upwork-Ready PDF Exporter ====="
echo ""

# Go to the directory where this script is located
cd "$(dirname "$0")"

# Check if wkhtmltopdf is installed
if ! command -v wkhtmltopdf &> /dev/null; then
  echo "wkhtmltopdf is not installed but required for PDF generation."
  echo ""
  
  # Check if running on macOS and if brew is installed
  if [[ "$OSTYPE" == "darwin"* ]] && command -v brew &> /dev/null; then
    echo "Would you like to install wkhtmltopdf now? (y/n)"
    read -r answer
    if [[ "$answer" =~ ^[Yy]$ ]]; then
      echo "Installing wkhtmltopdf..."
      brew install wkhtmltopdf
      echo "wkhtmltopdf installed successfully."
    else
      echo "Continuing without installing wkhtmltopdf."
    fi
  else
    echo "Please install wkhtmltopdf manually:"
    echo "- macOS: brew install wkhtmltopdf"
    echo "- Ubuntu/Debian: sudo apt-get install wkhtmltopdf"
    echo "- Windows: Download from https://wkhtmltopdf.org/downloads.html"
  fi
fi

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
  "name": "qb-automation-pdf-exporter",
  "version": "1.0.0",
  "description": "Exports QuickBooks PO Automation presentation to PDF",
  "main": "convert-presentation.js",
  "dependencies": {}
}' > ./package.json
fi

# Run the conversion script
echo "Starting PDF conversion..."
node convert-presentation.js

echo ""
echo "Export process completed." 