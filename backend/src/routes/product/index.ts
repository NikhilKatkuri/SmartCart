import { errorHandler } from '@/handlers/errorHandler';
import {
  askProductQuestion,
  getAllProducts,
  getProductById,
  postProduct,
  postProductAiContext,
  postProductReview,
  postProductVariant,
  postBulkProducts,
  searchProducts,
} from '@/controllers/products';
import express from 'express';

const baseName = '/products';
const appendBaseName = (path: string) => `${baseName}${path}`;
const productRouter: express.Router = express.Router({ mergeParams: true });

const notImplementedHandler = (
  _req: express.Request,
  res: express.Response
) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * @route GET /products
 * @desc Get all products
 * @access Public
 */

productRouter.get(appendBaseName('/'), errorHandler(getAllProducts));

/**
 * @route POST /products
 * @desc Create a new product
 * @access Public
 */
productRouter.post(appendBaseName('/'), errorHandler(postProduct));

/**
 * @route POST /products/bulk
 * @desc Create multiple products with reviews, AI context, and variants in bulk
 * @access Public
 */
productRouter.post(appendBaseName('/bulk'), errorHandler(postBulkProducts));

/**
 * @route GET /products/:productId
 * @desc Get product by ID
 * @access Public
 */
productRouter.get(appendBaseName('/:productId'), errorHandler(getProductById));

/**
 * @route GET /products/search
 * @desc Search products by query parameters
 * @access Public
 */
productRouter.get(appendBaseName('/search'), errorHandler(searchProducts));

/***
 * @route GET /products/compare
 * @desc Compare products based on query parameters
 * @access Public
 */
productRouter.get(
  appendBaseName('/compare'),
  errorHandler(notImplementedHandler)
);

/**
 * @route GET /products/:productId/reviews
 * @desc Get reviews for a product
 * @access Public
 */
productRouter.get(
  appendBaseName('/:productId/reviews'),
  errorHandler(notImplementedHandler)
);

/**
 * @route POST /products/:productId/reviews/summarize
 * @desc Summarize reviews for a product using AI
 * @access Public
 */
productRouter.post(
  appendBaseName('/:productId/reviews/summarize'),
  errorHandler(notImplementedHandler)
);

/**
 * @route POST /products/:productId/ask
 * @desc Ask a question about a product and get an AI-generated answer
 * @access Public
 */
productRouter.post(
  appendBaseName('/:productId/ask'),
  errorHandler(askProductQuestion)
);

/**
 * @route POST /products
 * @desc Create a new product (not implemented)
 * @access Public
 */
productRouter.post(appendBaseName('/'), errorHandler(notImplementedHandler));

/**
 * @route PUT /products/:productId
 * @desc Update a product by ID (not implemented)
 * @access Public
 */
productRouter.put(
  appendBaseName('/:productId'),
  errorHandler(notImplementedHandler)
);

/**
 * @route DELETE /products/:productId
 * @desc Delete a product by ID (not implemented)
 * @access Public
 */
productRouter.delete(
  appendBaseName('/:productId'),
  errorHandler(notImplementedHandler)
);

/**
 * @route POST /products/:productId/ai_context
 * @desc Update a product by ID (not implemented)
 * @access Public
 */
productRouter.post(
  appendBaseName('/:productId/ai_context_text'),
  errorHandler(postProductAiContext)
);

/**
 * @route POST /products/:productId/ai_context
 * @desc Update a product by ID (not implemented)
 * @access Public
 */
productRouter.post(
  appendBaseName('/:productId/review'),
  errorHandler(postProductReview)
);

/**
 * @route POST /products/:productId/ai_context
 * @desc Update a product by ID (not implemented)
 * @access Public
 */
productRouter.post(
  appendBaseName('/:productId/variants'),
  errorHandler(postProductVariant)
);

export default productRouter;
