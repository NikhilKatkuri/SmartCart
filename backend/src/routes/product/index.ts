import { getProducts } from '@/controllers/index';
import { getProduct } from '@/controllers/products/getProduct';
import { searchProducts } from '@/controllers/products/searchProducts';
import { errorHandler } from '@/handlers/errorHandler';
import express from 'express';

const ProductRouter: express.Router = express.Router();

ProductRouter.get('/products', errorHandler(getProducts));
ProductRouter.get('/products/data', errorHandler(getProduct));
ProductRouter.post('/products/search', errorHandler(searchProducts));

export default ProductRouter;
