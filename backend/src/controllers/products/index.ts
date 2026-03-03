import { Request, Response } from 'express';

const getAllProducts = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Get all products' });
};

const getProductById = async (req: Request, res: Response) => {
  const { productId } = req.params;
  res.status(200).json({ message: `Get product with ID: ${productId}` });
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

export { getAllProducts, getProductById, searchProducts, askProductQuestion };
