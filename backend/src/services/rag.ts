/**
 * RAG (Retrieval-Augmented Generation) Service
 * Handles retrieval of product data and augmentation of prompts
 */

import {
  ProductModel,
  ReviewModel,
  SpecificationsModel,
  KnowledgeBaseModel,
} from '@/models';

export interface RetrievedProductData {
  product: any;
  specifications?: any;
  reviews?: any[];
  knowledgeBase?: any;
}

/**
 * Retrieve product data for RAG augmentation
 */
export const retrieveProductData = async (
  product_id: string
): Promise<RetrievedProductData | null> => {
  try {
    // Fetch product and related data in parallel
    const [product, specifications, reviews, knowledgeBase] = await Promise.all([
      ProductModel.findOne({ product_id }),
      SpecificationsModel.findOne({ product_id }),
      ReviewModel.find({ product_id }).limit(5), // Get top 5 reviews
      KnowledgeBaseModel.findOne({ product_id }),
    ]);

    if (!product) {
      return null;
    }

    return {
      product: product.toObject(),
      specifications: specifications?.specifications || {},
      reviews: reviews.map((r) => r.toObject()),
      knowledgeBase: knowledgeBase?.toObject(),
    };
  } catch (error) {
    console.error('Error retrieving product data:', error);
    throw error;
  }
};

/**
 * Build augmented prompt for LLM with product context
 */
export const buildAugmentedPrompt = (
  userQuery: string,
  productData: RetrievedProductData | null,
  includeReviews: boolean = true,
  includeSpecs: boolean = true
): string => {
  const systemPrompt = `You are the SmartCart Product Assistant. You are provided with specific JSON fragments regarding product specs and reviews. 
RULE 1: Use ONLY the provided context to answer. 
RULE 2: If the answer is not in the context, state 'I do not have enough information to answer that.'
RULE 3: Do not mention that you are an AI or that you were given a dataset.
RULE 4: Be concise and helpful in your responses.

`;

  if (!productData) {
    return `${systemPrompt}USER QUERY: ${userQuery}`;
  }

  let context = `PRODUCT CONTEXT:\n`;
  context += `Product: ${productData.product.product_title}\n`;
  context += `Brand: ${productData.product.brand}\n`;
  context += `Category: ${productData.product.category}\n`;
  context += `Price: ${productData.product.price} ${productData.product.currency}\n`;
  context += `Rating: ${productData.product.rating}/5 (${productData.product.review_count} reviews)\n`;
  context += `Description: ${productData.product.short_description}\n`;
  context += `Details: ${productData.product.long_description}\n`;

  if (includeSpecs && Object.keys(productData.specifications).length > 0) {
    context += `\nSPECIFICATIONS:\n`;
    for (const [key, value] of Object.entries(productData.specifications)) {
      context += `- ${key}: ${value}\n`;
    }
  }

  if (includeReviews && productData.reviews && productData.reviews.length > 0) {
    context += `\nREVIEWS:\n`;
    for (const review of productData.reviews) {
      context += `- Rating: ${review.rating}/5 - "${review.comment}"\n`;
    }
  }

  return `${systemPrompt}CONTEXT:\n${context}\n\nUSER QUERY: ${userQuery}`;
};

/**
 * Retrieve and compare multiple products
 */
export const retrieveMultipleProducts = async (
  product_ids: string[]
): Promise<RetrievedProductData[]> => {
  try {
    const retrievedProducts = await Promise.all(
      product_ids.map((id) => retrieveProductData(id))
    );

    return retrievedProducts.filter(
      (product) => product !== null
    ) as RetrievedProductData[];
  } catch (error) {
    console.error('Error retrieving multiple products:', error);
    throw error;
  }
};

/**
 * Build comparison prompt for two products
 */
export const buildComparisonPrompt = (
  product1Data: RetrievedProductData,
  product2Data: RetrievedProductData,
  comparisonAspect?: string
): string => {
  const systemPrompt = `You are the SmartCart Product Comparison Assistant. Compare the two products provided based on the given aspect or overall value.
RULE 1: Use ONLY the provided context to compare.
RULE 2: Provide a structured comparison with pros and cons for each product.
RULE 3: If specific information is missing, note it in your response.
RULE 4: Be objective and factual in your comparison.

`;

  let context = `PRODUCT 1: ${product1Data.product.product_title}\n`;
  context += `Price: ${product1Data.product.price} ${product1Data.product.currency}\n`;
  context += `Rating: ${product1Data.product.rating}/5\n`;
  context += `Specifications: ${JSON.stringify(product1Data.specifications)}\n\n`;

  context += `PRODUCT 2: ${product2Data.product.product_title}\n`;
  context += `Price: ${product2Data.product.price} ${product2Data.product.currency}\n`;
  context += `Rating: ${product2Data.product.rating}/5\n`;
  context += `Specifications: ${JSON.stringify(product2Data.specifications)}\n\n`;

  const aspect = comparisonAspect ? `Compare focusing on: ${comparisonAspect}` : 'Provide an overall comparison';

  return `${systemPrompt}PRODUCTS:\n${context}\n\nCOMPARISON REQUEST: ${aspect}`;
};
