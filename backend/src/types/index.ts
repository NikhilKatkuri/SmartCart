export interface ProductMetadata {
  category: string;
  sub_category: string;
  brand: string;
  product_title: string;
  Img_URL: string | null;
  tags: string[];
}

export interface ProductInventory {
  product_id: string;
  price: number;
  currency: string;
  discount_percentage: number;
  stock_quantity: number;
  variants?: Record<string, string>[];
}

export interface ProductReview {
  product_id: string;
  rating: number;
  comment: string;
}

export interface ProductSpecifications {
  product_id: string;
  specifications: Record<string, string>;
}

export interface ProductKnowledgeBase {
  product_id: string;
  short_description: string;
  long_description: string;
  rating: number;
  review_count: number;
}

export interface product extends ProductMetadata, ProductInventory, ProductKnowledgeBase {
  product_id: string;
}

export interface ProductData extends product {
  ai_context_text?: string;
  reviews?: ProductReview[];
  variants?: Record<string, string>[];
}

export interface FilterOptions {
  category?: string;
  sub_category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  tags?: string[];
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
