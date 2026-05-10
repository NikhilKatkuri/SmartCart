import { Document, Schema, model } from 'mongoose';

export interface IProductSpecifications extends Document {
  product_id: string;
  specifications: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

type _pss = IProductSpecifications;

const ProductSpecificationsSchema = new Schema<_pss>(
  {
    product_id: {
      type: String,
      required: true,
      index: true,
    },
    specifications: {
      type: Map,
      of: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SpecificationsModel = model<_pss>(
  'Specifications',
  ProductSpecificationsSchema
);