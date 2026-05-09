import { Document, Schema, model } from 'mongoose';

export interface IProductKnowledgeBase extends Document {
  product_id: string;
  short_description: string;
  long_description: string;
  rating: number;
  review_count: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type _pkbs = IProductKnowledgeBase;

const ProductKnowledgeBaseSchema = new Schema<_pkbs>(
  {
    product_id: {
      type: String,
      required: true,
      index: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    long_description: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

ProductKnowledgeBaseSchema.index({ product_id: 1, rating: 1, review_count: 1 });

export const KnowledgeBaseModel = model<_pkbs>(
  'Knowledge',
  ProductKnowledgeBaseSchema
);