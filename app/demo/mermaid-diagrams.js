/**
 * Mermaid diagrams for QuickBooks PO Automation
 */

// Basic workflow diagram
const workflowDiagram = `
graph TD
    A[Purchase Order Document] -->|Upload| B[AI Document Processing]
    B -->|Extract Data| C[Data Validation]
    C -->|Enrich & Format| D[QuickBooks Integration]
    D -->|Create/Update| E[QB Purchase Order]
    C -.->|If Issues Detected| F[Human Review]
    F -->|Corrections| C
    
    style A fill:#f9f9f9,stroke:#666,stroke-width:2px
    style B fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px
    style C fill:#e8f5e9,stroke:#4caf50,stroke-width:2px
    style D fill:#ede7f6,stroke:#673ab7,stroke-width:2px
    style E fill:#e8eaf6,stroke:#3f51b5,stroke-width:2px
    style F fill:#ffebee,stroke:#f44336,stroke-width:2px
`;

// Detailed technical architecture 
const detailedArchitecture = `
graph TB
    subgraph Input ["Input Sources"]
        A1[PDF Documents]
        A2[Email Attachments]
        A3[Scanned Images]
        A4[Text Files]
    end

    subgraph Processing ["AI Processing Engine"]
        B1[OCR Engine]
        B2[OpenRouter AI]
        B3[Data Extraction]
        B4[Validation Engine]
    end

    subgraph Enrichment ["Data Enrichment"]
        C1[Category Assignment]
        C2[Vendor Matching]
        C3[Item Recognition]
        C4[Price Validation]
    end

    subgraph Integration ["QuickBooks Integration"]
        D1[REST API Client]
        D2[Data Mapping]
        D3[Error Handling]
        D4[Sync Status Tracking]
    end

    subgraph Output ["QuickBooks Desktop Enterprise"]
        E1[Vendors Database]
        E2[Items/Products]
        E3[Purchase Orders]
        E4[Accounting System]
    end
    
    A1 & A2 & A3 & A4 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> C1 & C2 & C3 & C4
    C1 & C2 & C3 & C4 --> D1
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> E1 & E2 & E3 & E4
    
    style A1 fill:#f5f5f5,stroke:#607d8b,stroke-width:1px
    style A2 fill:#f5f5f5,stroke:#607d8b,stroke-width:1px
    style A3 fill:#f5f5f5,stroke:#607d8b,stroke-width:1px
    style A4 fill:#f5f5f5,stroke:#607d8b,stroke-width:1px
    
    style B1 fill:#e1f5fe,stroke:#03a9f4,stroke-width:1px
    style B2 fill:#e1f5fe,stroke:#03a9f4,stroke-width:1px
    style B3 fill:#e1f5fe,stroke:#03a9f4,stroke-width:1px
    style B4 fill:#e1f5fe,stroke:#03a9f4,stroke-width:1px
    
    style C1 fill:#e8f5e9,stroke:#4caf50,stroke-width:1px
    style C2 fill:#e8f5e9,stroke:#4caf50,stroke-width:1px
    style C3 fill:#e8f5e9,stroke:#4caf50,stroke-width:1px
    style C4 fill:#e8f5e9,stroke:#4caf50,stroke-width:1px
    
    style D1 fill:#ede7f6,stroke:#673ab7,stroke-width:1px
    style D2 fill:#ede7f6,stroke:#673ab7,stroke-width:1px
    style D3 fill:#ede7f6,stroke:#673ab7,stroke-width:1px
    style D4 fill:#ede7f6,stroke:#673ab7,stroke-width:1px
    
    style E1 fill:#e8eaf6,stroke:#3f51b5,stroke-width:1px
    style E2 fill:#e8eaf6,stroke:#3f51b5,stroke-width:1px
    style E3 fill:#e8eaf6,stroke:#3f51b5,stroke-width:1px
    style E4 fill:#e8eaf6,stroke:#3f51b5,stroke-width:1px
    
    style Input fill:#f9f9f9,stroke:#ccc,stroke-width:1px
    style Processing fill:#f3f9fe,stroke:#ccc,stroke-width:1px
    style Enrichment fill:#f3fef5,stroke:#ccc,stroke-width:1px
    style Integration fill:#f9f3fe,stroke:#ccc,stroke-width:1px
    style Output fill:#f3f4fe,stroke:#ccc,stroke-width:1px
`;

// ROI and implementation timeline diagram
const roiDiagram = `
graph TD
    subgraph "Business Value"
        BV1[80% Time Savings]
        BV2[95% Accuracy]
        BV3[50% Cost Reduction]
        BV4[5x Scalability]
        BV5[90% Error Reduction]
    end
    
    subgraph "Implementation Timeline"
        IT1[Setup: 2 Weeks]
        IT2[Customization: 2 Weeks]
        IT3[Testing: 1 Week]
        IT4[Deployment: 1 Week]
    end
    
    IT1 --> IT2 --> IT3 --> IT4
    
    style BV1 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style BV2 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style BV3 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style BV4 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style BV5 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    
    style IT1 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style IT2 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style IT3 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style IT4 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
`;

// Sample PO data for the demo
const samplePO = `
PURCHASE ORDER

PO Number: PO-2023-11-01
Date: November 1, 2023

VENDOR:
LuxuryTextiles International
78 Fashion Avenue
Milan, MI 20121
Email: orders@luxurytextiles.com

SHIP TO:
Haute Couture Designs
123 Designer Row
Fashion District, NY 10018

ITEMS:
SKU: LT-SILK-PREMIUM-001
Description: Premium Italian Silk - Scarlet Red
Quantity: 75 yards
Unit Price: $68.50
Amount: $5,137.50

SKU: LT-LACE-FRENCH-002
Description: Handcrafted French Lace - Ivory
Quantity: 40 yards
Unit Price: $95.75
Amount: $3,830.00

SKU: LT-WOOL-CASHMERE-003
Description: Cashmere Wool Blend - Midnight Blue
Quantity: 60 yards
Unit Price: $112.25
Amount: $6,735.00

Subtotal: $15,702.50
Tax (6.5%): $1,020.66
Total: $16,723.16

Payment Terms: Net 45
Notes: Priority shipping required for upcoming winter collection
`;

// Sample beauty supplies PO
const beautysamplePO = `
PURCHASE ORDER

PO Number: PO-2023-12-05
Date: December 5, 2023

VENDOR:
Lumina Beauty Supplies
456 Cosmetic Avenue
Beauty District, CA 90210
Email: orders@luminabeauty.com

SHIP TO:
Glamour Beauty Salon
789 Fashion Boulevard
Style Center, NY 10001

ITEMS:
SKU: LB-SERUM-PREMIUM-001
Description: Premium Hyaluronic Acid Serum
Quantity: 48 bottles
Unit Price: $24.99
Amount: $1,199.52

SKU: LB-MASK-CLAY-002
Description: Organic Clay Face Mask
Quantity: 60 jars
Unit Price: $18.50
Amount: $1,110.00

SKU: LB-CREAM-NIGHT-003
Description: Rejuvenating Night Cream
Quantity: 36 jars
Unit Price: $32.75
Amount: $1,179.00

SKU: LB-OIL-ARGAN-004
Description: Pure Argan Oil Treatment
Quantity: 24 bottles
Unit Price: $29.95
Amount: $718.80

Subtotal: $4,207.32
Tax (8.25%): $347.10
Total: $4,554.42

Payment Terms: Net 30
Notes: Expedited shipping required for holiday season inventory
`; 