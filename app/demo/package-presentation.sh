#!/bin/bash

# Go to the directory where this script is located
cd "$(dirname "$0")"

# Create a temporary directory
TEMP_DIR="QuickBooks_PO_Presentation"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Copy the required files
cp pdf-export.html $TEMP_DIR/index.html
cp mermaid-diagrams.js $TEMP_DIR/

# Create a simple README
echo "# QuickBooks PO Automation Presentation

## How to View
1. Extract all files from this zip
2. Double-click on 'index.html' to open in your browser
3. All diagrams and content will load automatically

## Note
For the best experience, use Chrome, Firefox, or Edge browser.
" > $TEMP_DIR/README.md

# Create a zip file
cd ..
zip -r QuickBooks_PO_Presentation.zip demo/$TEMP_DIR

# Check if the zip was created successfully
if [ -f "QuickBooks_PO_Presentation.zip" ]; then
    echo "✅ Presentation package created successfully!"
    echo "Zip file saved to: $(pwd)/QuickBooks_PO_Presentation.zip"
    
    # Clean up
    rm -rf demo/$TEMP_DIR
else
    echo "❌ Failed to create presentation package."
fi 