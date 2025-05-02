import { PurchaseOrder, ValidationResult, ValidationError } from '../types.js';

/**
 * Validates purchase order data for completeness and correctness
 * @param purchaseOrder Purchase order data to validate
 * @returns ValidationResult Result of validation with any errors
 */
export function validatePurchaseOrder(purchaseOrder: PurchaseOrder): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Required field validation
  if (!purchaseOrder.poNumber) {
    errors.push({ field: 'poNumber', message: 'PO number is required' });
  }
  
  if (!purchaseOrder.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  } else {
    // Date format validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(purchaseOrder.date)) {
      errors.push({ field: 'date', message: 'Date must be in YYYY-MM-DD format' });
    }
  }
  
  if (!purchaseOrder.vendorName) {
    errors.push({ field: 'vendorName', message: 'Vendor name is required' });
  }
  
  // Validate items array
  if (!purchaseOrder.items || purchaseOrder.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required' });
  } else {
    // Validate each item
    purchaseOrder.items.forEach((item, index) => {
      if (!item.description) {
        errors.push({ field: `items[${index}].description`, message: 'Item description is required' });
      }
      
      if (item.quantity <= 0) {
        errors.push({ field: `items[${index}].quantity`, message: 'Item quantity must be greater than 0' });
      }
      
      if (item.unitPrice < 0) {
        errors.push({ field: `items[${index}].unitPrice`, message: 'Item unit price cannot be negative' });
      }
    });
  }
  
  // Validate totals
  if (purchaseOrder.subtotal < 0) {
    errors.push({ field: 'subtotal', message: 'Subtotal cannot be negative' });
  }
  
  if (purchaseOrder.tax < 0) {
    errors.push({ field: 'tax', message: 'Tax cannot be negative' });
  }
  
  if (purchaseOrder.total <= 0) {
    errors.push({ field: 'total', message: 'Total must be greater than 0' });
  }
  
  // Check if calculated total matches total field (allowing for rounding differences)
  const calculatedTotal = purchaseOrder.subtotal + purchaseOrder.tax;
  const totalDifference = Math.abs(calculatedTotal - purchaseOrder.total);
  
  if (totalDifference > 0.1) {
    errors.push({ 
      field: 'total', 
      message: `Total (${purchaseOrder.total}) doesn't match calculated total (${calculatedTotal})` 
    });
  }
  
  // Check if items total matches subtotal (allowing for rounding differences)
  const itemsTotal = purchaseOrder.items.reduce((sum, item) => sum + item.amount, 0);
  const subtotalDifference = Math.abs(itemsTotal - purchaseOrder.subtotal);
  
  if (subtotalDifference > 0.1) {
    errors.push({ 
      field: 'subtotal', 
      message: `Subtotal (${purchaseOrder.subtotal}) doesn't match sum of item amounts (${itemsTotal})` 
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Enriches purchase order data with additional information
 * In a real implementation, this could include:
 * - Categorizing items based on product database
 * - Adding vendor information from a vendor database
 * - Validating prices against expected price lists
 * @param purchaseOrder Purchase order to enrich
 * @returns PurchaseOrder Enriched purchase order
 */
export function enrichPurchaseOrderData(purchaseOrder: PurchaseOrder): PurchaseOrder {
  // For the MVP, we'll do some simple enrichment
  // Copy the purchase order to avoid modifying the original
  const enriched = { ...purchaseOrder };
  
  // Enrich items with mock category data
  enriched.items = purchaseOrder.items.map(item => {
    const enrichedItem = { ...item };
    
    // Simple category assignment based on item description or SKU
    // In a real implementation, this would use a product database
    if (!item.category) {
      const itemText = (item.description + ' ' + item.sku).toLowerCase();
      
      if (itemText.includes('fabric') || itemText.includes('textile')) {
        enrichedItem.category = 'Fabrics';
      } else if (itemText.includes('button') || itemText.includes('zipper') || itemText.includes('thread')) {
        enrichedItem.category = 'Notions';
      } else if (itemText.includes('makeup') || itemText.includes('cosmetic')) {
        enrichedItem.category = 'Cosmetics';
      } else if (itemText.includes('package') || itemText.includes('box') || itemText.includes('container')) {
        enrichedItem.category = 'Packaging';
      } else {
        enrichedItem.category = 'Other';
      }
    }
    
    return enrichedItem;
  });
  
  return enriched;
} 