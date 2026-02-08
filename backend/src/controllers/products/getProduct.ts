import { Request, Response } from 'express';

// product data retrieval logic would go here
const getProduct = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Product retrieved successfully' });
};

export { getProduct };
