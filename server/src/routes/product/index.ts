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

const baseName = '/products';
const appendBaseName = (path: string) => `${baseName}${path}`;
const productRouter: express.Router = express.Router({ mergeParams: true });

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
 * @route GET /products/by-id/:product_id
 * @desc Get product by product_id with all related data
 * @access Public
 */
productRouter.get(
      appendBaseName('/by-id/:product_id'),
      errorHandler(getProductByProductId)
);

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

export default productRouter;