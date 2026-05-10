import { Document, Schema, model } from 'mongoose';

export interface IVariant extends Document {
  product_id: string;
  variant_name: string;
  variant_value: string;
  createdAt?: Date;
}

const variantSchema = new Schema<IVariant>(
  {
    product_id: {
      type: String,
      required: true,
      index: true,
    },
    variant_name: {
      type: String,
      required: true,
    },
    variant_value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const VariantModel = model<IVariant>('Variant', variantSchema);
