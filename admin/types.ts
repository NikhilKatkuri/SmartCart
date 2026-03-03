export interface Product {
  product_id: string;
  category: string;
  sub_category: string;
  brand: string;
  product_title: string;
  // Img_URL is None in your sample, which translates to null in JS/TS
  Img_URL: string | null;
  short_description: string;
  long_description: string;
  price: number;
  currency: "INR" | string;
  discount_percentage: number;
  stock_quantity: number;
  rating: number;
  review_count: number;

  /** * Note: If these arrive as strings from your DB,
   * use the "Raw" types defined below first!
   */
  variants: Variant[];
  specifications: Specifications;
  tags: string[];
  reviews: Review[];

  ai_context_text: string;
}

// Nested Type Definitions
interface Variant {
  color: string;
  ram: string;
}

interface Specifications {
  processor: string;
  ram: string;
  storage: string;
  gpu: string;
  display: string;
  battery: string;
}

interface Review {
  rating: number;
  comment: string;
}
