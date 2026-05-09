import { Document, Schema, model } from 'mongoose';

export interface IAIContextText extends Document {
  product_id: string;
  ai_context_text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const aiContextTextSchema = new Schema<IAIContextText>(
  {
    product_id: {
      type: String,
      required: true,
      index: true,
    },
    ai_context_text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

aiContextTextSchema.index({ product_id: 1 });

export const AIContextTextModel = model<IAIContextText>(
  'AIContextText',
  aiContextTextSchema
);
