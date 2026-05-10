import { Request, Response } from 'express';
import { ProductModel, ReviewModel, SpecificationsModel, KnowledgeBaseModel, VariantModel, CategoryModel } from '@/models';

/**
 * User: Get all products with pagination and filters
 */
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Pagination
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const category = req.query['category'] as string | undefined;
    const sub_category = req.query['sub_category'] as string | undefined;
    const brand = req.query['brand'] as string | undefined;
    const minPrice = req.query['minPrice'] ? parseInt(req.query['minPrice'] as string) : undefined;
    const maxPrice = req.query['maxPrice'] ? parseInt(req.query['maxPrice'] as string) : undefined;
    const minRating = req.query['minRating'] ? parseFloat(req.query['minRating'] as string) : undefined;
    const tags = req.query['tags'] ? (req.query['tags'] as string).split(',') : undefined;
    const search = req.query['search'] as string | undefined;

    // Build filter query
    const filter: any = {};

    if (category) filter.category = category;
    if (sub_category) filter.sub_category = sub_category;
    if (brand) filter.brand = brand;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }
    if (minRating !== undefined) {
      filter.rating = { $gte: minRating };
    }
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }
    if (search) {
      filter.$or = [
        { product_title: { $regex: search, $options: 'i' } },
        { short_description: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Get paginated products
    const products = await ProductModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Products fetched successfully',
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      message: 'Error fetching products',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * User: Get product by ID with all related data
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch related data in parallel
    const product_id = product.product_id;
    const [reviews, specifications, knowledgeBase, variants] = await Promise.all([
      ReviewModel.find({ product_id: product_id as any }),
      SpecificationsModel.findOne({ product_id: product_id as any }),
      KnowledgeBaseModel.findOne({ product_id: product_id as any }),
      VariantModel.find({ product_id: product_id as any }),
    ]);

    return res.status(200).json({
      message: 'Product fetched successfully',
      product: {
        ...product.toObject(),
        reviews,
        specifications: specifications?.specifications || {},
        knowledgeBase,
        variants: variants,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      message: 'Error fetching product',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * User: Get product by product_id
 */
export const getProductByProductId = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;

    const product = await ProductModel.findOne({ product_id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch related data in parallel
    const [reviews, specifications, knowledgeBase, variants] = await Promise.all([
      ReviewModel.find({ product_id: product_id as any }),
      SpecificationsModel.findOne({ product_id: product_id as any }),
      KnowledgeBaseModel.findOne({ product_id: product_id as any }),
      VariantModel.find({ product_id: product_id as any }),
    ]);

    return res.status(200).json({
      message: 'Product fetched successfully',
      product: {
        ...product.toObject(),
        reviews,
        specifications: specifications?.specifications || {},
        knowledgeBase,
        variants: variants.map((v) => Object.entries(v).map(([k, v]) => `${k}: ${v}`).join(', ')),
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      message: 'Error fetching product',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * User: Search products
 */
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const query = req.query['q'] as string | undefined;
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 10;
    const skip = (page - 1) * limit;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchFilter = {
      $or: [
        { product_title: { $regex: query, $options: 'i' } },
        { short_description: { $regex: query, $options: 'i' } },
        { long_description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    };

    const total = await ProductModel.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    const products = await ProductModel.find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1, review_count: -1 });

    return res.status(200).json({
      message: 'Products found',
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return res.status(500).json({
      message: 'Error searching products',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * User: Get all categories
 */
export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find({}).sort({ name: 1 }).lean();

    return res.status(200).json({
      message: 'Categories fetched successfully',
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      message: 'Error fetching categories',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
