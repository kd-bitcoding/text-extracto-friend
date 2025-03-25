
// Mock text extraction service

// Sample responses for different image types
const SAMPLE_TEXTS = {
  receipt: `CAFE MOCHA
123 Main Street, Cityville
Tel: (555) 123-4567

Receipt #: 5789
Date: 08/12/2023
Time: 14:23

Item            Qty  Price   Total
Cappuccino      1    $4.50   $4.50
Chocolate Cake  1    $5.75   $5.75
Sandwich        1    $8.25   $8.25

Subtotal:                    $18.50
Tax (8.25%):                 $1.53
TOTAL:                       $20.03

Payment Method: Credit Card
Card: VISA **** 1234
Transaction ID: TXN7890123

Thank you for your visit!
`,
  businessCard: `JOHN SMITH
SOFTWARE ENGINEER

Email: john.smith@example.com
Phone: (555) 987-6543
Website: www.johnsmith.dev

ACME TECH SOLUTIONS
123 Innovation Drive
San Francisco, CA 94105
`,
  invoice: `INVOICE

Invoice #: INV-20230578
Date: September 15, 2023
Due Date: October 15, 2023

BILLED TO:
Acme Corporation
123 Business Lane
Enterprise City, EC 54321

ITEM                     QTY   RATE    AMOUNT
Website Development      1     $2,500  $2,500
Custom Plugin            2     $450    $900
Hosting (Annual)         1     $120    $120

Subtotal:                             $3,520
Tax (7%):                             $246.40
TOTAL DUE:                            $3,766.40

Payment Terms: Net 30
Please make checks payable to: Professional Web Services
`,
  letter: `Dear Ms. Johnson,

Thank you for your recent application to the Marketing Manager position at Global Brands Inc. We appreciate your interest in joining our team and the time you've taken to apply.

We would like to invite you for an interview at our office on Tuesday, October 10, 2023, at 2:00 PM. The interview will last approximately one hour and will be conducted by our HR Director, Mr. Robert Thompson, and the Marketing Director, Ms. Sarah Williams.

Please bring a copy of your resume and portfolio samples to the interview. If the suggested time doesn't work for you, please contact us to reschedule.

We look forward to meeting you.

Best regards,
Emma Davis
HR Assistant
Global Brands Inc.
(555) 234-5678
e.davis@globalbrands.com
`,
  menu: `SUNRISE CAFE
BREAKFAST MENU

CLASSICS
Eggs Benedict..............$12.95
Two poached eggs on English muffin with hollandaise sauce
Full Breakfast.............$15.95
Eggs, bacon, sausage, hash browns, toast
Avocado Toast..............$10.95
Sourdough bread, avocado, poached egg

OMELETS
Served with hash browns and toast
Cheese Omelet..............$9.95
Western Omelet.............$12.95
Ham, bell peppers, onions, cheese
Veggie Omelet..............$11.95
Spinach, mushroom, tomato, feta

BEVERAGES
Coffee.....................$3.50
Tea........................$3.00
Fresh Orange Juice.........$4.50
Smoothie...................$5.95
`,
  generic: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
};

interface ExtractionResult {
  text: string;
  detectedType?: string;
  confidence: number;
}

class ExtractionService {
  // Extract text from image
  async extractText(imageUrl: string): Promise<ExtractionResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, we would send the image to an OCR service
    // Here we're returning mock data based on random selection
    
    const types = ['receipt', 'businessCard', 'invoice', 'letter', 'menu'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomConfidence = 0.7 + Math.random() * 0.25; // Between 0.7 and 0.95
    
    return {
      text: SAMPLE_TEXTS[randomType as keyof typeof SAMPLE_TEXTS] || SAMPLE_TEXTS.generic,
      detectedType: randomType,
      confidence: parseFloat(randomConfidence.toFixed(2))
    };
  }

  // Get a suggested title based on extracted text
  suggestTitle(text: string): string {
    if (!text) return "New Document";
    
    // Simple heuristics for title suggestion
    if (text.includes('INVOICE') || text.includes('Invoice #')) {
      return "Invoice Document";
    } else if (text.includes('Receipt #') || text.includes('RECEIPT')) {
      return "Receipt";
    } else if (text.includes('MENU') || text.includes('CAFE') || text.includes('RESTAURANT')) {
      return "Menu";
    } else if (text.includes('Dear') && text.includes('Sincerely') || text.includes('Regards')) {
      return "Letter";
    } else if (text.length < 200 && (text.includes('@') || text.includes('Tel:') || text.includes('Phone:'))) {
      return "Business Card";
    }
    
    // Default title from first few words
    const firstWords = text.split(/\s+/).slice(0, 3).join(' ');
    return firstWords.length > 5 ? firstWords + '...' : "New Document";
  }
}

export const extractionService = new ExtractionService();
