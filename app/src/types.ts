// Types for Purchase Order data
export interface PurchaseOrder {
  poNumber: string;
  date: string;
  vendorName: string;
  vendorAddress: string;
  vendorEmail: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
}

export interface PurchaseOrderItem {
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category?: string;
}

// Types for QuickBooks Integration
export interface QuickBooksVendor {
  id?: string;
  name: string;
  email?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

export interface QuickBooksItem {
  id?: string;
  name: string;
  description?: string;
  unitPrice: number;
  type: 'Inventory' | 'Service' | 'NonInventory';
  category?: string;
}

export interface QuickBooksPurchaseOrder {
  id?: string;
  poNumber: string;
  vendorId: string;
  date: string;
  items: QuickBooksPurchaseOrderItem[];
  memo?: string;
  paymentTerms?: string;
}

export interface QuickBooksPurchaseOrderItem {
  itemId: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

// Types for OCR and NLP Processing
export interface ExtractedData {
  rawText: string;
  confidence: number;
  processedData: Partial<PurchaseOrder>;
}

// Types for Validation
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Configuration types
export interface AppConfig {
  quickbooks: {
    realmId: string;
    consumerKey: string;
    consumerSecret: string;
    oauthToken: string;
    oauthTokenSecret: string;
    useSandbox: boolean;
  };
  openai: {
    apiKey: string;
    model: string;
  };
}

// Types for CSV sample data
export interface SampleExpense {
  date: string;
  vendorName: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
} 