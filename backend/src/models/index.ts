import mongoose, { Document, Schema } from 'mongoose';
import { product } from '../types';

const productSchema = new Schema<product & Document>({
  product_id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  sub_category: { type: String, required: true },

  brand: { type: String, required: true },
  product_title: { type: String, required: true },
  image_url: { type: [String], default: null },

  short_description: { type: String, required: true },
  long_description: { type: String, required: true },

  price: { type: Number, required: true },
  currency: { type: String, required: true },
  discount_percentage: { type: Number, required: true },
  stock_quantity: { type: Number, required: true },
  rating: { type: Number, required: true },
  review_count: { type: Number, required: true },
  specifications: { type: Map, of: String, required: true },
  tags: { type: [String], required: true },
});

const ProductModel = mongoose.model<product & Document>(
  'Product',
  productSchema
);

interface productReviews {
  product_id: string;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<productReviews & Document>({
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  product_id: { type: String, required: true },
});

const ReviewModel = mongoose.model<productReviews & Document>(
  'Review',
  reviewSchema
);

interface productAIContext {
  product_id: string;
  ai_context_text: string;
}

const aiContextTextSchema = new Schema<productAIContext & Document>({
  product_id: { type: String, required: true },
  ai_context_text: { type: String, required: true },
});

const AIContextTextModel = mongoose.model<productAIContext & Document>(
  'AIContextText',
  aiContextTextSchema
);

interface productVariant {
  product_id: string;
  variant_name: string;
  variant_value: string;
}

const variantSchema = new Schema<productVariant & Document>({
  product_id: { type: String, required: true },
  variant_name: { type: String, required: true },
  variant_value: { type: String, required: true },
});

const VariantModel = mongoose.model<productVariant & Document>(
  'Variant',
  variantSchema
);
export { ProductModel, ReviewModel, AIContextTextModel, VariantModel };
