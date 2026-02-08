import { Request, Response } from 'express';

// products with search query
const searchProducts = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Products searched successfully' });
};

export { searchProducts };
