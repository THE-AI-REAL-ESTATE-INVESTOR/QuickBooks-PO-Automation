# QuickBooks Automation Demo

This directory contains the demonstration materials for the QuickBooks PO Automation solution.

## Running the Demo

To run the full demo, execute the following command from the project root:

```bash
npm run demo
```

This will:
1. Create sample purchase order data
2. Process the data using AI (OpenRouter/Claude)
3. Validate and enrich the data
4. Simulate QuickBooks integration
5. Generate a detailed HTML report

## Presentation Materials

The following files are available for presentations:

- `demo.ts` - The main demo script that runs the automation workflow
- `presentation.html` - A slide-based presentation for pitching the solution
- `render-diagrams.html` - Visual diagrams of the workflow and architecture
- `workflow-diagram.md` - Simple Mermaid diagram of the workflow
- `detailed-diagram.md` - Detailed Mermaid diagram of the technical architecture
- `roi-diagram.md` - Business value and ROI Mermaid diagram

## Demo Workflow

1. **Open `presentation.html`** in a browser to start your pitch presentation
2. When you reach the "Live Demonstration" slide, switch to your terminal
3. Run `npm run demo` to show the automation in action
4. After the demo completes, open the generated report from `data/po_processing_report.html`
5. Continue with the remaining slides in the presentation

## Getting Screenshots for the Presentation

To include diagram images in your presentation:

1. Open `render-diagrams.html` in a web browser
2. The Mermaid diagrams will render automatically
3. Take screenshots of each diagram
4. Save them as:
   - `workflow_diagram.png`
   - `detailed_diagram.png`
   - `roi_diagram.png`
5. Place these files in the same directory as `presentation.html`

## Customizing the Demo

You can modify the following to customize the demo:

- Sample purchase order data in `demo.ts`
- Report template styles and layout
- Presentation slides and content
- Mermaid diagrams to match your specific workflow

## Requirements

- Node.js 16+
- npm
- Modern web browser (Chrome, Firefox, Edge)
- OpenRouter API key (if using the real AI extraction)

## Creating Upwork-Ready PDFs

To create Upwork-friendly PDFs for proposal submissions, you have three options:

### Option 1: Chrome-based PDF Export (Recommended)
```bash
./app/demo/create-upwork-pdf.sh
```
This creates a high-quality PDF using Chrome's rendering engine via Puppeteer. The output file `QuickBooks_PO_Automation_Chrome.pdf` will be saved in the project root directory. This method produces the best results for Upwork uploads.

### Option 2: wkhtmltopdf Export
```bash
./app/demo/export-upwork-pdf.sh
```
This method uses wkhtmltopdf to generate a PDF. If wkhtmltopdf is not installed, the script will guide you through installation.

### Option 3: Manual Export
1. Open `app/demo/pdf-export.html` in Chrome
2. Press Cmd+P (or Ctrl+P on Windows)
3. Change destination to "Save as PDF"
4. Set Paper size to "Letter"
5. Ensure "Background graphics" is checked
6. Click "Save"

The PDF file can then be uploaded directly to Upwork as part of your proposal. 