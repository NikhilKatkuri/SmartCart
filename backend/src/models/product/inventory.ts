import { Document, Schema, model } from 'mongoose';

export interface IProductInventory extends Document {
  product_id: string;
  price: number;
  discount_percentage: number;
  stock_quantity: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type _pis = IProductInventory;

const productInventorySchema = new Schema<_pis>(
  {
    product_id: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
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
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
  },
  {
    timestamps: true,
  }
);

productInventorySchema.index({ product_id: 1 });
productInventorySchema.index({ product_id: 1, stock_quantity: 1 });

export const InventoryModel = model<_pis>(
  'Inventory',
  productInventorySchema
);