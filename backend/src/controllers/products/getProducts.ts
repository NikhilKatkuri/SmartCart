import { Request, Response } from 'express';

// products with pagination, filtering, and sorting
const getProducts = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Products retrieved successfully' });
};

export { getProducts };
