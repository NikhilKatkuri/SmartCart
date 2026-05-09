import { errorHandler } from '@/handlers/errorHandler';
import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductByProductId,
  searchProducts,
} from '@/controllers/user';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createBulkProducts,
} from '@/controllers/admin';
import {
  analyzeProduct,
  compareProducts,
  chatbotAnalysis,
  featureComparison,
  checkHealth,
} from '@/controllers/llm';

const baseName = '/products';
const appendBaseName = (path: string) => `${baseName}${path}`;
const productRouter: express.Router = express.Router({ mergeParams: true });

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
productRouter.get('/health', errorHandler(checkHealth));

/**
 * =========================
 * USER ROUTES (Read-only)
 * =========================
 */

/**
 * @route GET /products
 * @desc Get all products with pagination and filters
 * @query page, limit, category, sub_category, brand, minPrice, maxPrice, minRating, tags, search
 * @access Public
 */
productRouter.get(appendBaseName('/'), errorHandler(getAllProducts));

/**
 * @route GET /products/search
 * @desc Search products by query
 * @query q, page, limit
 * @access Public
 */
productRouter.get(appendBaseName('/search'), errorHandler(searchProducts));

/**
 * @route GET /products/:productId
 * @desc Get product by MongoDB ID with all related data
 * @access Public
 */
productRouter.get(
  appendBaseName('/:productId'),
  errorHandler(getProductById)
);

/**
 * @route GET /products/by-id/:product_id
 * @desc Get product by product_id with all related data
 * @access Public
 */
productRouter.get(
  appendBaseName('/by-id/:product_id'),
  errorHandler(getProductByProductId)
);

/**
 * =========================
 * ADMIN ROUTES (Write)
 * =========================
 */

/**
 * @route POST /products
 * @desc Create a new product (Admin only)
 * @body { data: product }
 * @access Admin
 */
productRouter.post(appendBaseName('/'), errorHandler(createProduct));

/**
 * @route POST /products/bulk
 * @desc Create multiple products with all related data (Admin only)
 * @body { data: ProductData[] }
 * @access Admin
 */
productRouter.post(
  appendBaseName('/bulk'),
  errorHandler(createBulkProducts)
);

/**
 * @route PUT /products/:productId
 * @desc Update a product by ID (Admin only)
 * @body { data: Partial<product> }
 * @access Admin
 */
productRouter.put(
  appendBaseName('/:productId'),
  errorHandler(updateProduct)
);

/**
 * @route DELETE /products/:productId
 * @desc Delete a product by ID and all related data (Admin only)
 * @access Admin
 */
productRouter.delete(
  appendBaseName('/:productId'),
  errorHandler(deleteProduct)
);

/**
 * =========================
 * LLM ROUTES (AI Features)
 * =========================
 */

/**
 * @route GET /products/llm/analyze/:product_id
 * @desc Analyze a single product with AI
 * @query query (optional user query for analysis)
 * @access Public
 */
productRouter.get(
  appendBaseName('/llm/analyze/:product_id'),
  errorHandler(analyzeProduct)
);

/**
 * @route POST /products/llm/compare
 * @desc Compare two products
 * @body { product_id_1: string, product_id_2: string, aspect?: string }
 * @access Public
 */
productRouter.post(
  appendBaseName('/llm/compare'),
  errorHandler(compareProducts)
);

/**
 * @route POST /products/llm/chat
 * @desc Chatbot API for detailed product analysis
 * @body { product_id: string, message: string }
 * @access Public
 */
productRouter.post(
  appendBaseName('/llm/chat'),
  errorHandler(chatbotAnalysis)
);

/**
 * @route POST /products/llm/feature-compare
 * @desc Compare features across multiple products
 * @body { product_ids: string[], feature?: string }
 * @access Public
 */
productRouter.post(
  appendBaseName('/llm/feature-compare'),
  errorHandler(featureComparison)
);

export default productRouter;
