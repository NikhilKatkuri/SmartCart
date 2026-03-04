import {
  AIContextTextModel,
  ProductModel,
  ReviewModel,
  VariantModel,
} from '@/models';

import { product, ProductData } from '@/types/index';
import { Request, Response } from 'express';

const getAllProducts = async (_req: Request, res: Response) => {
  const products = await ProductModel.find();
  return res.status(200).json({ products });
};

const postProduct = async (req: Request, res: Response) => {
  // Check if body exists
  if (!req.body) {
    return res.status(400).json({
      message:
        'Request body is required. Please ensure Content-Type is set to application/json',
    });
  }

  const { data } = req.body as {
    data: product;
  };

  if (!data) {
    return res.status(400).json({ message: 'Product data is required' });
  }

  const product = await ProductModel.create(data);
  const id = product._id.toString();

  return res.status(201).json({ message: 'Product created successfully', id });
};

const postProductReview = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { review } = req.body as {
    review: {
      rating: number;
      comment: string;
      product_id: string;
    };
  };
  const _data = JSON.parse(JSON.stringify(review));

  const _review = await ReviewModel.create(_data);
  const _id = _review._id.toString();

  res.status(200).json({
    message: `Post a review for product with ID: ${productId}`,
    review: _review,
    id: _id,
  });
};

const postProductAiContext = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { context } = req.body as {
    context: {
      product_id: string;
      ai_context_text: string;
    };
  };
  const _data = JSON.parse(JSON.stringify(context));

  const _aiContextText = await AIContextTextModel.create(_data);
  const _id = _aiContextText._id.toString();

  res.status(200).json({
    message: `Post AI context for product with ID: ${productId}`,
    aiContextText: _aiContextText,
    id: _id,
  });
};

const postProductVariant = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { context } = req.body as {
    context: {
      product_id: string;
      variant_name: string;
      variant_value: string;
    };
  };
  const _data = JSON.parse(JSON.stringify(context));

  const _variant = await VariantModel.create(_data);
  const _id = _variant._id.toString();

  res.status(200).json({
    message: `Post variant for product with ID: ${productId}`,
    variant: _variant,
    id: _id,
  });
};

const getProductById = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const product = await ProductModel.findById(productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  return res.status(200).json({ product });
};

const searchProducts = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Search products' });
};

const askProductQuestion = async (req: Request, res: Response) => {
  const { productId } = req.params;
  res
    .status(200)
    .json({ message: `Ask a question about product with ID: ${productId}` });
};

/**
 * Bulk load entire product database with all related data
 * Creates products, reviews, AI context, and variants in one operation
 *
 */

const postBulkProducts = async (req: Request, res: Response) => {
  try {
    const { data } = req.body as {
      data: ProductData[];
    };

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        message: 'Product data array is required and must not be empty',
      });
    }

    const results = {
      productsCreated: 0,
      reviewsCreated: 0,
      aiContextCreated: 0,
      variantsCreated: 0,
      errors: [] as string[],
    };

    // Process each product and its related data
    for (const productData of data) {
      try {
        // Destructure product data from related data
        const { ai_context_text, reviews, variants, ...productInfo } =
          productData;

        // 1. Create the product
        await ProductModel.create(productInfo);
        results.productsCreated++;

        // 2. Create reviews if they exist
        if (reviews && Array.isArray(reviews) && reviews.length > 0) {
          for (const review of reviews) {
            try {
              await ReviewModel.create({
                ...review,
                product_id: productInfo.product_id,
              });
              results.reviewsCreated++;
            } catch (reviewError) {
              results.errors.push(
                `Failed to create review for product ${productInfo.product_id}: ${reviewError}`
              );
            }
          }
        }

        // 3. Create AI context if it exists
        if (ai_context_text) {
          try {
            await AIContextTextModel.create({
              product_id: productInfo.product_id,
              ai_context_text,
            });
            results.aiContextCreated++;
          } catch (aiError) {
            results.errors.push(
              `Failed to create AI context for product ${productInfo.product_id}: ${aiError}`
            );
          }
        }

        // 4. Create variants if they exist
        if (variants && Array.isArray(variants) && variants.length > 0) {
          for (const variant of variants) {
            try {
              // Each attribute in variant becomes a separate variant entry
              for (const [variantName, variantValue] of Object.entries(
                variant
              )) {
                await VariantModel.create({
                  product_id: productInfo.product_id,
                  variant_name: variantName,
                  variant_value: variantValue,
                });
                results.variantsCreated++;
              }
            } catch (variantError) {
              results.errors.push(
                `Failed to create variant for product ${productInfo.product_id}: ${variantError}`
              );
            }
          }
        }
      } catch (productError) {
        results.errors.push(
          `Failed to create product ${productData.product_id}: ${productError}`
        );
      }
    }

    return res.status(201).json({
      message: 'Bulk product data upload completed',
      results,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during bulk product upload',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export {
  getAllProducts,
  getProductById,
  searchProducts,
  askProductQuestion,
  postProduct,
  postProductReview,
  postProductAiContext,
  postProductVariant,
  postBulkProducts,
};
