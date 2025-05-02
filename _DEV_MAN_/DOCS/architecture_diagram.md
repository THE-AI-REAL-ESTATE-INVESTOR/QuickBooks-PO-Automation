# Architecture Diagram (ASCII)

```
+--------------------------------------------------+
|                                                  |
|           Purchase Order Documents               |
|    (PDF, Scanned Images, Emails, Text Files)     |
|                                                  |
+------------------------+-------------------------+
                         |
                         v
+------------------------+-------------------------+
|                                                  |
|           Document Processing Layer              |
|   +------------------+  +-----------------+     |
|   |  OCR Processing  |  |  Text Extraction |     |
|   +------------------+  +-----------------+     |
|                                                  |
+------------------------+-------------------------+
                         |
                         v
+------------------------+-------------------------+
|                                                  |
|            AI Extraction Layer                   |
|   +------------------+  +-----------------+     |
|   |  OpenAI Models   |  | Entity Recognition|    |
|   +------------------+  +-----------------+     |
|                                                  |
+------------------------+-------------------------+
                         |
                         v
+------------------------+-------------------------+
|                                                  |
|             Data Validation Layer                |
|   +------------------+  +-----------------+     |
|   | Field Validation |  | Value Calculation|     |
|   +------------------+  +-----------------+     |
|   | Business Rules   |  | Confidence Check|     |
|   +------------------+  +-----------------+     |
|                                                  |
+------------------------+-------------------------+
                         |
                         v
+------------------------+-------------------------+
|                                                  |
|             Data Enrichment Layer                |
|   +------------------+  +-----------------+     |
|   | Vendor Matching  |  | Categorization  |     |
|   +------------------+  +-----------------+     |
|   | GL Code Mapping  |  | Data Formatting |     |
|   +------------------+  +-----------------+     |
|                                                  |
+------------------------+-------------------------+
                         |
                         v
+------------------------+-------------------------+
|                                                  |
|           QuickBooks Integration Layer           |
|   +------------------+  +-----------------+     |
|   | SDK Interface    |  | Entity Creation |     |
|   +------------------+  +-----------------+     |
|   | Data Mapping     |  | Error Handling  |     |
|   +------------------+  +-----------------+     |
|                                                  |
+------------------------+-------------------------+
                         |
                         v
+--------------------------------------------------+
|                                                  |
|              QuickBooks Desktop                  |
|                 Enterprise                       |
|                                                  |
+--------------------------------------------------+
```

The above architecture shows the complete flow from document intake to QuickBooks integration:

1. **Document Processing Layer**: Handles different document formats and extracts text using OCR or text extraction methods

2. **AI Extraction Layer**: Uses advanced AI models (OpenAI) to understand document structure and extract relevant data fields

3. **Data Validation Layer**: Ensures that the extracted data is complete, accurate, and consistent with business rules

4. **Data Enrichment Layer**: Enhances the extracted data with contextual information like vendor matching, categorization, and GL code mapping

5. **QuickBooks Integration Layer**: Interfaces with QuickBooks Desktop Enterprise to create or update entities and transactions

This modular architecture allows for:
- Independent scaling of each layer
- Specialized processing at each stage
- Easy troubleshooting and error handling
- Ability to add new document types or formats
- Extension with additional validation rules or enrichment processes 