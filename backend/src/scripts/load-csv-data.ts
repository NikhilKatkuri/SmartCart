#!/usr/bin/env node

/**
 * SmartCart CSV Data Loader
 * Loads product data from CSV and pushes to database via admin bulk create endpoint
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ProductDataRow {
  product_id: string;
  category: string;
  sub_category: string;
  brand: string;
  product_title: string;
  Img_URL: string | null;
  short_description: string;
  long_description: string;
  price: number;
  currency: string;
  discount_percentage: number;
  stock_quantity: number;
  rating: number;
  review_count: number;
  variants: string;
  specifications: string;
  tags: string;
  reviews: string;
}

interface ProcessedProduct {
  product_id: string;
  category: string;
  sub_category: string;
  brand: string;
  product_title: string;
  Img_URL: string | null;
  short_description: string;
  long_description: string;
  price: number;
  currency: string;
  discount_percentage: number;
  stock_quantity: number;
  rating: number;
  review_count: number;
  variants?: Record<string, string>[];
  specifications?: Record<string, string>;
  tags: string[];
  reviews?: Array<{ rating: number; comment: string }>;
  ai_context_text?: string;
}

/**
 * Parse CSV line by line
 */
function parseCSV(csvContent: string): ProductDataRow[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  const products: ProductDataRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parser that handles quoted fields
    const row = parseCSVLine(line);
    if (row.length === headers.length) {
      const product: any = {};
      headers.forEach((header, index) => {
        product[header.trim()] = row[index];
      });
      products.push(product);
    }
  }

  return products;
}

/**
 * Parse individual CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Process raw product data into structured format
 */
function processProduct(rawProduct: ProductDataRow): ProcessedProduct {
  // Parse JSON fields
  let variants: Record<string, string>[] = [];
  let specifications: Record<string, string> = {};
  let tags: string[] = [];
  let reviews: Array<{ rating: number; comment: string }> = [];

  try {
    // Parse variants (array of objects)
    if (rawProduct.variants && rawProduct.variants !== 'null') {
      const cleaned = rawProduct.variants.replace(/""/g, '"');
      variants = JSON.parse(cleaned);
    }
  } catch (e) {
    console.warn(`Failed to parse variants for ${rawProduct.product_id}`);
  }

  try {
    // Parse specifications (object)
    if (rawProduct.specifications && rawProduct.specifications !== 'null') {
      const cleaned = rawProduct.specifications.replace(/""/g, '"');
      specifications = JSON.parse(cleaned);
    }
  } catch (e) {
    console.warn(`Failed to parse specifications for ${rawProduct.product_id}`);
  }

  try {
    // Parse tags (array of strings)
    if (rawProduct.tags && rawProduct.tags !== 'null') {
      const cleaned = rawProduct.tags.replace(/""/g, '"');
      tags = JSON.parse(cleaned);
    }
  } catch (e) {
    console.warn(`Failed to parse tags for ${rawProduct.product_id}`);
  }

  try {
    // Parse reviews (array of objects)
    if (rawProduct.reviews && rawProduct.reviews !== 'null') {
      const cleaned = rawProduct.reviews.replace(/""/g, '"');
      reviews = JSON.parse(cleaned);
    }
  } catch (e) {
    console.warn(`Failed to parse reviews for ${rawProduct.product_id}`);
  }

  return {
    product_id: rawProduct.product_id,
    category: rawProduct.category,
    sub_category: rawProduct.sub_category,
    brand: rawProduct.brand,
    product_title: rawProduct.product_title,
    Img_URL: rawProduct.Img_URL === 'null' ? null : rawProduct.Img_URL,
    short_description: rawProduct.short_description,
    long_description: rawProduct.long_description,
    price: parseFloat(rawProduct.price as any),
    currency: rawProduct.currency,
    discount_percentage: parseFloat(rawProduct.discount_percentage as any),
    stock_quantity: parseInt(rawProduct.stock_quantity as any),
    rating: parseFloat(rawProduct.rating as any),
    review_count: parseInt(rawProduct.review_count as any),
    variants: variants.length > 0 ? variants : undefined,
    specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
    tags,
    reviews: reviews.length > 0 ? reviews : undefined,
    ai_context_text: `${rawProduct.product_title} - ${rawProduct.long_description}`,
  };
}

/**
 * Push product data to database via admin API
 */
async function pushProductsToDB(
  products: ProcessedProduct[],
  apiUrl: string = 'http://localhost:5000/api/v1'
): Promise<void> {
  console.log(`\n📦 Pushing ${products.length} products to database...\n`);

  const batchSize = 50; // Process in batches

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    try {
      console.log(`⏳ Processing batch ${batchNumber} (${batch.length} products)...`);

      const response = await fetch(`${apiUrl}/products/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: batch }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log(`✅ Batch ${batchNumber} completed:`);
      console.log(`   - Products: ${result.results.productsCreated}`);
      console.log(`   - Reviews: ${result.results.reviewsCreated}`);
      console.log(`   - Specifications: ${result.results.specificationsCreated}`);
      console.log(`   - Variants: ${result.results.variantsCreated}`);
      console.log(`   - AI Context: ${result.results.aiContextCreated}`);

      if (result.results.errors.length > 0) {
        console.warn(`   ⚠️ Errors in batch:`);
        result.results.errors.forEach((error: string) => console.warn(`      - ${error}`));
      }

      console.log('');
    } catch (error) {
      console.error(`❌ Error processing batch ${batchNumber}:`, error);
      throw error;
    }
  }

  console.log('✨ Data loading completed!');
}

/**
 * Main function
 */
async function main() {
  const csvPath = path.join(__dirname, 'SMART_CART_DATA.csv');
  const apiUrl = process.env.API_URL || 'http://localhost:5000/api/v1';

  console.log('🚀 SmartCart CSV Data Loader');
  console.log('==============================\n');

  // Check if file exists
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at: ${csvPath}`);
    console.error(`\nPlease ensure SMART_CART_DATA.csv exists in the backend folder.`);
    process.exit(1);
  }

  try {
    // Read CSV
    console.log(`📄 Reading CSV from: ${csvPath}`);
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Parse CSV
    console.log('🔍 Parsing CSV data...');
    const rawProducts = parseCSV(csvContent);
    console.log(`✅ Parsed ${rawProducts.length} products\n`);

    // Process products
    console.log('⚙️ Processing product data...');
    const processedProducts = rawProducts.map(processProduct);
    console.log(`✅ Processed ${processedProducts.length} products\n`);

    // Check API availability
    console.log(`🔌 Checking API connection at: ${apiUrl}`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const healthResponse = await fetch(`${apiUrl}/products/health`, {
          signal: controller.signal,
          method: 'GET',
        });
        clearTimeout(timeoutId);
        
        if (!healthResponse.ok) {
          throw new Error(`Health check failed: ${healthResponse.statusText}`);
        }
        console.log('✅ API is online\n');
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      console.error(`❌ API is not reachable at ${apiUrl}`);
      console.error('Please ensure the backend is running: pnpm dev\n');
      console.error(`Error details: ${error instanceof Error ? error.message : String(error)}\n`);
      // Try to continue anyway - the API might be starting up
      console.log('⚠️  Continuing with data push anyway...\n');
    }

    // Push to database
    await pushProductsToDB(processedProducts, apiUrl);

    console.log('\n🎉 All data successfully loaded to database!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('Stack:', error.stack);
    }
    // Give a small delay before exiting to let pending operations finish
    setTimeout(() => {
      process.exit(1);
    }, 100);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  setTimeout(() => {
    process.exit(1);
  }, 100);
});

// Run main function
main();
