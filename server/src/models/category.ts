import { Document, Schema, model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  sub_categories: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    sub_categories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ name: 1 });

export const CategoryModel = model<ICategory>('Category', categorySchema);
