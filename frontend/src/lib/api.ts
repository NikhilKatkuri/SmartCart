/**
 * API Client for SmartCart Backend
 * Handles all API calls to the backend server
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T> {
  message: string;
  data?: T;
  product?: T;
  results?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Make an API request
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error at ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Product API endpoints
 */
export const productAPI = {
  // Get all products with pagination and filters
  getAllProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiCall<any>(`/products?${queryParams.toString()}`);
  },

  // Get product by ID
  getProductById: async (productId: string) => {
    return apiCall<any>(`/products/by-id/${productId}`);
  },

  // Search products
  searchProducts: async (query: string, limit = 20) => {
    return apiCall<any>(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  },
};

/**
 * LLM/AI API endpoints
 */
export const llmAPI = {
  // Check health of LLM service
  checkHealth: async () => {
    return apiCall<any>('/products/llm/health');
  },

  // Analyze single product
  analyzeProduct: async (productId: string, query: string) => {
    return apiCall<any>('/products/llm/analyze/' + productId, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },

  // Compare products
  compareProducts: async (productIds: string[], aspects?: string[]) => {
    return apiCall<any>('/products/llm/compare', {
      method: 'POST',
      body: JSON.stringify({ product_ids: productIds, aspects }),
    });
  },

  // Chatbot analysis
  chatbotAnalysis: async (productId: string, conversation: any[]) => {
    return apiCall<any>('/products/llm/chatbot/' + productId, {
      method: 'POST',
      body: JSON.stringify({ conversation }),
    });
  },
};

export default { productAPI, llmAPI };
