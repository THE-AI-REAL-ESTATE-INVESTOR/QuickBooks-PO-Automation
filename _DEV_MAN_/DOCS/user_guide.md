# QuickBooks PO Automation User Guide

## System Overview

The QuickBooks PO Automation system allows you to automatically extract data from purchase orders and populate your QuickBooks Desktop Enterprise with the extracted information. This guide explains how to use the system.

## Getting Started

### System Requirements

- Windows 10 or 11 (for QuickBooks Desktop Enterprise integration)
- QuickBooks Desktop Enterprise (installed and configured)
- Modern web browser (Chrome, Firefox, Edge)
- Internet connection

### Initial Setup

1. **Install the Application**: Follow the installation guide provided by your system administrator
2. **Configure QuickBooks Connection**: Use the setup wizard to connect to your QuickBooks instance
3. **Set Default Settings**: Configure default settings for vendor creation, item categories, and validation rules

## Using the System

### Processing a Purchase Order

#### Step 1: Upload or Import a Purchase Order

1. From the dashboard, click "Process New Document"
2. Select one of the following options:
   - **Upload File**: Select a PDF or image file from your computer
   - **Email Import**: Process a PO from your email account
   - **Scan Document**: Scan a physical document using a connected scanner
3. Click "Upload" to begin processing

#### Step 2: AI Processing

1. The system will automatically:
   - Extract text from the document
   - Identify key information (vendor, items, pricing, etc.)
   - Structure the data according to QuickBooks requirements
2. You'll see a progress indicator during processing
3. When complete, you'll be directed to the verification screen

#### Step 3: Verify Extracted Data

1. Review the extracted information:
   - Vendor information
   - Line items
   - Quantities and prices
   - Tax amounts
   - Totals
2. Fields with low confidence will be highlighted in yellow
3. Make any necessary corrections directly in the interface
4. Click "Validate" to run data validation checks

#### Step 4: Process in QuickBooks

1. Select the appropriate QuickBooks company file (if multiple)
2. Click "Process in QuickBooks" to create or update:
   - Vendor (if new)
   - Items (if new)
   - Purchase Order
3. The system will show a confirmation when complete
4. A link to the QuickBooks purchase order will be provided

### Managing Processed Documents

#### Viewing Processing History

1. From the dashboard, click "Processing History"
2. Browse or search for previous documents
3. Filter by:
   - Date range
   - Vendor
   - Status (Processed, Error, Pending)
4. Click on any document to view details

#### Handling Errors

If a document fails to process correctly:

1. Click on the document in Processing History
2. Review the error messages
3. Make necessary corrections
4. Click "Reprocess" to try again

## Advanced Features

### Custom Validation Rules

1. Go to "Settings" > "Validation Rules"
2. Create new rules or modify existing ones
3. Rules can be based on:
   - Field requirements
   - Value ranges
   - Mathematical relationships
   - Business-specific logic

### Vendor Management

1. Go to "Settings" > "Vendor Management"
2. Configure how vendors are matched or created
3. Set up vendor-specific rules for PO processing
4. Map vendor fields to QuickBooks

### Item Categorization

1. Go to "Settings" > "Item Categories"
2. Create or modify category rules
3. Set up automatic GL account mapping
4. Configure tax codes by category

## Troubleshooting

### Common Issues

#### Document Not Recognized

- Ensure the document is clear and legible
- Try rescanning at a higher resolution
- Manually crop the image to remove irrelevant content

#### Incorrect Data Extraction

- Verify the document is properly aligned
- Check for unusual formatting or fonts
- Manually correct the data and submit for processing

#### QuickBooks Connection Issues

- Verify QuickBooks is running and company file is open
- Check connection settings
- Ensure proper permissions are configured

### Getting Help

- **In-app Help**: Click the "?" icon in any screen
- **Support Email**: support@qbautomation.com
- **Phone Support**: (555) 123-4567, Monday-Friday, 8am-5pm ET

## Best Practices

1. **Document Quality**: Ensure clear, high-quality documents for best extraction
2. **Verification**: Always verify extracted data before processing
3. **Consistent Formatting**: Encourage vendors to use consistent PO formats
4. **Regular Updates**: Keep the system updated with the latest version
5. **Training**: Ensure all users are properly trained on the system 