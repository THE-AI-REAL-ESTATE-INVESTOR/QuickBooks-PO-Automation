import { ExtractedData, PurchaseOrder, PurchaseOrderItem } from '../types.js';
import OpenAI from 'openai';

// Initialize OpenAI client with OpenRouter integration
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || 'dummy-key-for-demo',
  defaultHeaders: {
    "HTTP-Referer": "https://qb-automation-demo.com", // Optional
    "X-Title": "QB Automation Demo"                   // Optional
  },
});

/**
 * Extract purchase order data from text using NLP/AI
 * @param rawText Raw text from OCR or document parsing
 * @returns Promise<ExtractedData> Extracted and processed data
 */
export async function extractPOData(rawText: string): Promise<ExtractedData> {
  console.log('Extracting data using AI processing...');
  
  // For the MVP, we'll simulate the AI processing and parse text directly
  // In a real implementation, we'd use OpenRouter or another AI service
  
  try {
    // Simulation of AI-based data extraction
    if (process.env.OPENROUTER_API_KEY) {
      return await extractWithOpenRouter(rawText);
    } else {
      return simulateExtraction(rawText);
    }
  } catch (error) {
    console.error('Error extracting data:', error);
    throw new Error('Failed to extract purchase order data');
  }
}

/**
 * Extract purchase order data using OpenRouter
 * @param rawText Raw text from OCR or document parsing
 * @returns Promise<ExtractedData> Extracted and processed data
 */
async function extractWithOpenRouter(rawText: string): Promise<ExtractedData> {
  const prompt = `
  Extract the following information from this purchase order text. Format your response as a valid JSON object with the following structure:
  {
    "poNumber": "PO number",
    "date": "Date in YYYY-MM-DD format",
    "vendorName": "Vendor name",
    "vendorAddress": "Full vendor address as a single string",
    "vendorEmail": "Vendor email if available",
    "items": [
      {
        "sku": "Item SKU",
        "description": "Item description",
        "quantity": number,
        "unitPrice": number,
        "amount": number
      }
    ],
    "subtotal": number,
    "tax": number,
    "total": number,
    "notes": "Any notes in the PO",
    "paymentTerms": "Payment terms if available"
  }
  
  Here's the purchase order text:
  ${rawText}
  `;

  const response = await openai.chat.completions.create({
    model: "anthropic/claude-3-opus-20240229", // Using Claude via OpenRouter
    messages: [
      { role: 'system', content: 'You are a data extraction assistant that extracts structured information from purchase orders.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('Failed to extract data with OpenRouter');
  }

  try {
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in OpenRouter response');
    }

    const extractedJson = JSON.parse(jsonMatch[0]);
    
    return {
      rawText,
      confidence: 0.95, // Confidence score from AI
      processedData: extractedJson
    };
  } catch (error) {
    console.error('Error parsing OpenRouter response:', error);
    throw new Error('Failed to parse OpenRouter response');
  }
}

/**
 * Simulate extraction for demo purposes
 * @param rawText Raw text from document
 * @returns ExtractedData Structured data extracted from text
 */
function simulateExtraction(rawText: string): ExtractedData {
  console.log('Using simulated extraction since OpenRouter API key not provided');
  
  // Extract PO Number
  const poNumberMatch = rawText.match(/PO Number:\s*([^\n]+)/);
  const poNumber = poNumberMatch ? poNumberMatch[1].trim() : '';
  
  // Extract Date
  const dateMatch = rawText.match(/Date:\s*([^\n]+)/);
  const dateRaw = dateMatch ? dateMatch[1].trim() : '';
  
  // Convert date to YYYY-MM-DD format if found
  let date = '';
  if (dateRaw) {
    try {
      const parsedDate = new Date(dateRaw);
      date = parsedDate.toISOString().split('T')[0];
    } catch (e) {
      date = dateRaw; // Keep as is if parsing fails
    }
  }
  
  // Extract Vendor information
  const vendorSection = rawText.match(/VENDOR:[^\n]*\n([\s\S]*?)(?=\n\s*\n|\nSHIP TO:)/i);
  const vendorLines = vendorSection ? vendorSection[1].trim().split('\n') : [];
  
  const vendorName = vendorLines.length > 0 ? vendorLines[0].trim() : '';
  const vendorAddress = vendorLines.length > 1 ? vendorLines.slice(1, -1).join(', ').trim() : '';
  
  // Extract Vendor Email
  const emailMatch = rawText.match(/Email:\s*([^\n]+)/i);
  const vendorEmail = emailMatch ? emailMatch[1].trim() : '';
  
  // Extract Items
  const itemsSection = rawText.match(/ITEMS:[^\n]*\n([\s\S]*?)(?=\n\s*\n|\nSubtotal:)/i);
  const itemsText = itemsSection ? itemsSection[1].trim() : '';
  
  // Pattern to match item blocks (assumption: items are separated by blank lines)
  const itemBlocks = itemsText.split(/\n\s*\n/);
  
  const items: PurchaseOrderItem[] = [];
  
  for (const block of itemBlocks) {
    if (!block.trim()) continue;
    
    const lines = block.trim().split('\n');
    
    const skuMatch = block.match(/SKU:\s*([^\n]+)/i);
    const descMatch = block.match(/Description:\s*([^\n]+)/i);
    const qtyMatch = block.match(/Quantity:\s*(\d+(?:\.\d+)?)\s*(?:yards|pcs|each)?/i);
    const priceMatch = block.match(/Unit Price:\s*\$?(\d+(?:\.\d+)?)/i);
    const amountMatch = block.match(/Amount:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i);
    
    const sku = skuMatch ? skuMatch[1].trim() : '';
    const description = descMatch ? descMatch[1].trim() : '';
    const quantity = qtyMatch ? parseFloat(qtyMatch[1]) : 0;
    const unitPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : 0;
    
    if (sku || description) {
      items.push({
        sku,
        description,
        quantity,
        unitPrice,
        amount,
        category: ''
      });
    }
  }
  
  // Extract Totals
  const subtotalMatch = rawText.match(/Subtotal:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i);
  const taxMatch = rawText.match(/Tax[^:]*:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i);
  const totalMatch = rawText.match(/Total:\s*\$?(\d+(?:,\d+)?(?:\.\d+)?)/i);
  
  const subtotal = subtotalMatch ? parseFloat(subtotalMatch[1].replace(',', '')) : 0;
  const tax = taxMatch ? parseFloat(taxMatch[1].replace(',', '')) : 0;
  const total = totalMatch ? parseFloat(totalMatch[1].replace(',', '')) : 0;
  
  // Extract Payment Terms and Notes
  const termsMatch = rawText.match(/Payment Terms:\s*([^\n]+)/i);
  const notesMatch = rawText.match(/Notes:\s*([^\n]+)/i);
  
  const paymentTerms = termsMatch ? termsMatch[1].trim() : '';
  const notes = notesMatch ? notesMatch[1].trim() : '';
  
  const processedData: PurchaseOrder = {
    poNumber,
    date,
    vendorName,
    vendorAddress,
    vendorEmail,
    items,
    subtotal,
    tax,
    total,
    paymentTerms,
    notes
  };
  
  return {
    rawText,
    confidence: 0.85, // Simulated confidence score
    processedData
  };
} 