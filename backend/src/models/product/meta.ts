import { Document, Schema, model } from 'mongoose';

export interface IProductMetadata extends Document {
  category: string;
  sub_category: string;
  brand: string;
  product_title: string;
  Img_URL: string | null;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

type _pmds = IProductMetadata;

const productMetadataSchema = new Schema<_pmds>(
  {
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
    },
    Img_URL: {
      type: String,
      default: null,
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

export const MetadataModel = model<_pmds>('Metadata', productMetadataSchema);