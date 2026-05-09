import { Document, Schema, model } from 'mongoose';

export interface IProduct extends Document {
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
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    sub_category: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      index: true,
    },
    product_title: {
      type: String,
      required: true,
      index: true,
    },
    Img_URL: {
      type: String,
      default: null,
    },
    short_description: {
      type: String,
      required: true,
    },
    long_description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
    discount_percentage: {
      type: Number,
      required: true,
      default: 0,
    },
    stock_quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      index: true,
    },
    review_count: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1, rating: 1 });
productSchema.index({ product_id: 1, stock_quantity: 1 });

export const ProductModel = model<IProduct>('Product', productSchema);
