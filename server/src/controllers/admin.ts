import { Request, Response } from 'express';
import { ProductModel, ReviewModel, SpecificationsModel, KnowledgeBaseModel, VariantModel, InventoryModel, CategoryModel } from '@/models';
import { product, ProductData } from '@/types/index';

/**
 * Admin: Create a new product
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: 'Request body is required. Please ensure Content-Type is set to application/json',
      });
    }

    const { data } = req.body as { data: product };

    if (!data || !data.product_id) {
      return res.status(400).json({ message: 'Product data with product_id is required' });
    }

    // Check if product already exists
    const existingProduct = await ProductModel.findOne({ product_id: data.product_id });
    if (existingProduct) {
      return res.status(409).json({ message: 'Product with this ID already exists' });
    }

    const product_obj = await ProductModel.create(data);
    const id = product_obj._id.toString();

    return res.status(201).json({
      message: 'Product created successfully',
      id,
      product: product_obj,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      message: 'Error creating product',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Admin: Update a product
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { data } = req.body as { data: Partial<product> };

    if (!data) {
      return res.status(400).json({ message: 'Product data is required' });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      data,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      message: 'Error updating product',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Admin: Delete a product
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Find product first to get product_id
    const product = await ProductModel.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Clean up related data
    const product_id = product.product_id;
    await Promise.all([
      ReviewModel.deleteMany({ product_id }),
      SpecificationsModel.deleteMany({ product_id }),
      KnowledgeBaseModel.deleteMany({ product_id }),
      VariantModel.deleteMany({ product_id }),
      InventoryModel.deleteMany({ product_id }),
    ]);

    return res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      message: 'Error deleting product',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Admin: Bulk create products with all related data
 */
export const createBulkProducts = async (req: Request, res: Response) => {
  try {
    const { data } = req.body as { data: ProductData[] };

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
      specificationsCreated: 0,
      knowledgeBaseCreated: 0,
      errors: [] as string[],
    };

    // Process each product and its related data
    for (const productData of data) {
      try {
        const { ai_context_text, reviews, variants, ...productInfo } = productData;
        const specifications = (productData as any).specifications;

        // 1. Create the product
        await ProductModel.create(productInfo);
        results.productsCreated++;

        const product_id = productInfo.product_id;

        // 2. Create knowledge base
        if (productInfo.short_description && productInfo.long_description) {
          try {
            await KnowledgeBaseModel.create({
              product_id,
              short_description: productInfo.short_description,
              long_description: productInfo.long_description,
              rating: productInfo.rating || 0,
              review_count: productInfo.review_count || 0,
            });
            results.knowledgeBaseCreated++;
          } catch (kbError) {
            results.errors.push(`Failed to create knowledge base for product ${product_id}: ${kbError}`);
          }
        }

        // 3. Create reviews if they exist
        if (reviews && Array.isArray(reviews) && reviews.length > 0) {
          for (const review of reviews) {
            try {
              await ReviewModel.create({
                ...review,
                product_id,
              });
              results.reviewsCreated++;
            } catch (reviewError) {
              results.errors.push(`Failed to create review for product ${product_id}: ${reviewError}`);
            }
          }
        }

        // 4. Create specifications if they exist
        if (specifications) {
          try {
            await SpecificationsModel.create({
              product_id,
              specifications,
            });
            results.specificationsCreated++;
          } catch (specError) {
            results.errors.push(`Failed to create specifications for product ${product_id}: ${specError}`);
          }
        }

        // 5. Create variants if they exist
        if (variants && Array.isArray(variants) && variants.length > 0) {
          for (const variant of variants) {
            try {
              for (const [variantName, variantValue] of Object.entries(variant)) {
                await VariantModel.create({
                  product_id,
                  variant_name: variantName,
                  variant_value: String(variantValue),
                });
                results.variantsCreated++;
              }
            } catch (variantError) {
              results.errors.push(`Failed to create variant for product ${product_id}: ${variantError}`);
            }
          }
        }
      } catch (error) {
        results.errors.push(`Failed to create product: ${error}`);
      }
    }

    return res.status(201).json({
      message: 'Bulk products created',
      results,
    });
  } catch (error) {
    console.error('Error in bulk product creation:', error);
    return res.status(500).json({
      message: 'Error creating bulk products',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Admin: Create a category
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, sub_categories } = req.body as { name?: string; sub_categories?: string[] };

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existing = await CategoryModel.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const category = await CategoryModel.create({
      name,
      sub_categories: sub_categories || [],
    });

    return res.status(201).json({
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({
      message: 'Error creating category',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Admin: Bulk create categories
 */
export const createBulkCategories = async (req: Request, res: Response) => {
  try {
    const { data } = req.body as { data?: Array<{ name: string; sub_categories?: string[] }> };

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: 'Category data array is required' });
    }

    const results = {
      created: 0,
      skipped: 0,
    };

    for (const category of data) {
      if (!category.name) {
        results.skipped++;
        continue;
      }
      const exists = await CategoryModel.findOne({ name: category.name });
      if (exists) {
        results.skipped++;
        continue;
      }
      await CategoryModel.create({
        name: category.name,
        sub_categories: category.sub_categories || [],
      });
      results.created++;
    }

    return res.status(201).json({
      message: 'Bulk categories created',
      results,
    });
  } catch (error) {
    console.error('Error creating bulk categories:', error);
    return res.status(500).json({
      message: 'Error creating bulk categories',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Admin: Update category and sub-categories (replace)
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.params as { name: string };
    const { new_name, sub_categories } = req.body as {
      new_name?: string;
      sub_categories?: string[];
    };

    const update: { name?: string; sub_categories?: string[] } = {};
    if (new_name) update.name = new_name;
    if (Array.isArray(sub_categories)) update.sub_categories = sub_categories;

    const category = await CategoryModel.findOneAndUpdate(
      { name },
      update,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json({
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({
      message: 'Error updating category',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Admin: Add sub-categories (merge)
 */
export const addSubCategories = async (req: Request, res: Response) => {
  try {
    const { name } = req.params as { name: string };
    const { sub_categories } = req.body as { sub_categories?: string[] };

    if (!Array.isArray(sub_categories) || sub_categories.length === 0) {
      return res.status(400).json({ message: 'sub_categories array is required' });
    }

    const category = await CategoryModel.findOneAndUpdate(
      { name },
      { $addToSet: { sub_categories: { $each: sub_categories } } },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json({
      message: 'Sub-categories added successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error adding sub-categories:', error);
    return res.status(500).json({
      message: 'Error adding sub-categories',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
