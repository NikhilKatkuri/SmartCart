import { Document, Schema, model } from 'mongoose';

export interface IProductReview extends Document {
  product_id: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

type _prs = IProductReview;

const ProductReviewSchema = new Schema<_prs>(
  {
    product_id: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      index: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ProductReviewSchema.index({ product_id: 1, rating: 1 });

export const ReviewModel = model<_prs>('Review', ProductReviewSchema);