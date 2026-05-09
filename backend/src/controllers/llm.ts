/**
 * LLM Controller
 * Handles product analysis, comparisons, and chatbot interactions
 */

import { Request, Response } from 'express';
import { getLocalResponse, checkOllamaHealth } from '@/services/ollama';
import {
  retrieveProductData,
  buildAugmentedPrompt,
  retrieveMultipleProducts,
  buildComparisonPrompt,
} from '@/services/rag';
import {
  validateResponse,
  formatResponse,
  sanitizeResponse,
} from '@/services/response-handler';
import { ProductModel } from '@/models';

/**
 * Check Ollama health status
 */
export const checkHealth = async (req: Request, res: Response) => {
  try {
    const isHealthy = await checkOllamaHealth();
    return res.status(200).json({
      message: 'Health check result',
      ollama: {
        healthy: isHealthy,
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Health check failed',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Analyze a single product with AI
 * GET /llm/analyze/:product_id
 */
export const analyzeProduct = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;
    const { query } = req.query as { query?: string };

    // Default query if not provided
    const userQuery =
      query || 'Provide a detailed analysis of this product including its key features and best use cases.';

    // Retrieve product data
    const productData = await retrieveProductData(product_id);

    if (!productData) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    // Build augmented prompt
    const augmentedPrompt = buildAugmentedPrompt(userQuery, productData);

    // Get response from Ollama
    let response: string;
    try {
      response = await getLocalResponse(augmentedPrompt);
    } catch (error) {
      console.error('Ollama error, attempting fallback response');
      response = `Based on the product data: ${productData.product.product_title} is a ${productData.product.category} with a rating of ${productData.product.rating}/5. ${productData.product.long_description}`;
    }

    // Validate and sanitize response
    response = sanitizeResponse(response);
    const validation = validateResponse(response);

    return res.status(200).json({
      message: 'Product analysis completed',
      product_id,
      analysis: response,
      metadata: {
        isValid: validation.isValid,
        warnings: validation.warnings,
        requiresFallback: validation.requiresFallback,
      },
    });
  } catch (error) {
    console.error('Error analyzing product:', error);
    return res.status(500).json({
      message: 'Error analyzing product',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Compare two products
 * POST /llm/compare
 * Body: { product_id_1: string, product_id_2: string, aspect?: string }
 */
export const compareProducts = async (req: Request, res: Response) => {
  try {
    const { product_id_1, product_id_2, aspect } = req.body as {
      product_id_1: string;
      product_id_2: string;
      aspect?: string;
    };

    if (!product_id_1 || !product_id_2) {
      return res.status(400).json({
        message: 'Both product_id_1 and product_id_2 are required',
      });
    }

    if (product_id_1 === product_id_2) {
      return res.status(400).json({
        message: 'Cannot compare a product with itself',
      });
    }

    // Retrieve both products
    const [product1Data, product2Data] = await Promise.all([
      retrieveProductData(product_id_1),
      retrieveProductData(product_id_2),
    ]);

    if (!product1Data || !product2Data) {
      return res.status(404).json({
        message: 'One or both products not found',
      });
    }

    // Build comparison prompt
    const comparisonPrompt = buildComparisonPrompt(
      product1Data,
      product2Data,
      aspect
    );

    // Get response from Ollama
    let response: string;
    try {
      response = await getLocalResponse(comparisonPrompt);
    } catch (error) {
      console.error('Ollama error, attempting fallback comparison');
      response = `${product1Data.product.product_title} (Rating: ${product1Data.product.rating}/5, Price: ${product1Data.product.price}) vs ${product2Data.product.product_title} (Rating: ${product2Data.product.rating}/5, Price: ${product2Data.product.price}). Based on specifications and reviews, both products serve different needs.`;
    }

    // Validate and sanitize response
    response = sanitizeResponse(response);
    const validation = validateResponse(response);

    return res.status(200).json({
      message: 'Product comparison completed',
      comparison: {
        product_1: {
          id: product_id_1,
          title: product1Data.product.product_title,
          price: product1Data.product.price,
          rating: product1Data.product.rating,
        },
        product_2: {
          id: product_id_2,
          title: product2Data.product.product_title,
          price: product2Data.product.price,
          rating: product2Data.product.rating,
        },
      },
      analysis: response,
      aspect: aspect || 'Overall',
      metadata: {
        isValid: validation.isValid,
        warnings: validation.warnings,
      },
    });
  } catch (error) {
    console.error('Error comparing products:', error);
    return res.status(500).json({
      message: 'Error comparing products',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Chatbot API for detailed product analysis
 * POST /llm/chat
 * Body: { product_id: string, message: string }
 */
export const chatbotAnalysis = async (req: Request, res: Response) => {
  try {
    const { product_id, message } = req.body as {
      product_id: string;
      message: string;
    };

    if (!product_id || !message) {
      return res.status(400).json({
        message: 'product_id and message are required',
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        message: 'Message cannot be empty',
      });
    }

    // Retrieve product data
    const productData = await retrieveProductData(product_id);

    if (!productData) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    // Build augmented prompt with user message
    const augmentedPrompt = buildAugmentedPrompt(
      message,
      productData,
      true,
      true
    );

    // Get response from Ollama
    let response: string;
    try {
      response = await getLocalResponse(augmentedPrompt, {
        temperature: 0.3, // Slightly higher for conversational tone
      });
    } catch (error) {
      console.error('Ollama error, attempting fallback response');
      response = `I can provide information about ${productData.product.product_title}. ${productData.product.long_description} Please try asking a more specific question about the product.`;
    }

    // Validate and sanitize response
    response = sanitizeResponse(response);
    const validation = validateResponse(response);

    return res.status(200).json({
      message: 'Chatbot response generated',
      product_id,
      product_title: productData.product.product_title,
      user_message: message,
      assistant_response: response,
      metadata: {
        isValid: validation.isValid,
        warnings: validation.warnings,
        requiresFallback: validation.requiresFallback,
      },
    });
  } catch (error) {
    console.error('Error in chatbot analysis:', error);
    return res.status(500).json({
      message: 'Error processing chatbot request',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Get feature comparison between multiple products
 * POST /llm/feature-compare
 * Body: { product_ids: string[], feature: string }
 */
export const featureComparison = async (req: Request, res: Response) => {
  try {
    const { product_ids, feature } = req.body as {
      product_ids: string[];
      feature?: string;
    };

    if (
      !product_ids ||
      !Array.isArray(product_ids) ||
      product_ids.length < 2
    ) {
      return res.status(400).json({
        message: 'At least 2 product_ids are required',
      });
    }

    // Retrieve all products
    const productsData = await retrieveMultipleProducts(product_ids);

    if (productsData.length < 2) {
      return res.status(404).json({
        message: 'Could not retrieve all products',
      });
    }

    // Build feature comparison prompt
    const featureQuery = feature
      ? `Compare these products specifically on the feature: ${feature}`
      : 'Provide a detailed feature comparison of these products';

    let context = `FEATURE COMPARISON\n\n`;
    for (const productData of productsData) {
      context += `Product: ${productData.product.product_title}\n`;
      context += `Price: ${productData.product.price}\n`;
      context += `Specifications: ${JSON.stringify(productData.specifications)}\n\n`;
    }

    const prompt = `You are a product comparison expert. Compare the following products on their features.
${context}

Request: ${featureQuery}

Provide a clear, structured comparison of the features.`;

    // Get response from Ollama
    let response: string;
    try {
      response = await getLocalResponse(prompt);
    } catch (error) {
      console.error('Ollama error');
      response = `Comparison of ${productsData.length} products. Each product has distinct specifications and price points.`;
    }

    response = sanitizeResponse(response);

    return res.status(200).json({
      message: 'Feature comparison completed',
      products: productsData.map((p) => ({
        id: p.product.product_id,
        title: p.product.product_title,
        price: p.product.price,
        rating: p.product.rating,
      })),
      feature: feature || 'Overall Features',
      comparison: response,
    });
  } catch (error) {
    console.error('Error in feature comparison:', error);
    return res.status(500).json({
      message: 'Error performing feature comparison',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
