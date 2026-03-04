type Attributes = Record<string, string>;

export interface ProductVariant {
  product_id: string;
  attributes: Attributes;
}

export interface productReviews {
  product_id: string;
  reviews: {
    rating: number;
    comment: string;
  };
}

export interface productAiContext {
  product_id: string;
  ai_context_text: string;
}

export interface product {
  product_id: string;
  category: string;
  sub_category: string;

  brand: string;
  product_title: string;
  image_url: string[] | null;

  short_description: string;
  long_description: string;

  price: number;
  currency: 'INR' | string;
  discount_percentage: number;
  stock_quantity: number;
  rating: number;
  review_count: number;
  specifications: Attributes;
  tags: string[];
}

// Product Data Type with reviews, AI context and variants
export type ProductData = {
  product_id: string;
  category: string;
  sub_category: string;
  brand: string;
  product_title: string;
  Img_URL: null;
  short_description: string;
  long_description: string;
  price: number;
  currency: string;
  discount_percentage: number;
  stock_quantity: number;
  rating: number;
  review_count: number;
  ai_context_text: string;
  specifications: Attributes;
  tags: string[];
  reviews: {
    rating: number;
    comment: string;
  }[];
  variants: Attributes[];
};
