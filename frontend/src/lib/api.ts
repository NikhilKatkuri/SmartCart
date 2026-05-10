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

async function streamSSE(
  endpoint: string,
  body: object,
  onEvent: (event: { type: string; data?: any; message?: string }) => void
): Promise<void> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok || !response.body) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';

    for (const part of parts) {
      const line = part.split('\n').find((l) => l.startsWith('data: '));
      if (!line) continue;
      try {
        const payload = JSON.parse(line.replace('data: ', '')) as {
          type: string;
          data?: any;
          message?: string;
        };
        onEvent(payload);
      } catch (error) {
        console.error('Error parsing SSE payload:', error);
      }
    }
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
export const aiAPI = {
  checkHealth: async () => {
    return apiCall<any>('/ai/health');
  },

  queryProduct: async (params: {
    productId: string;
    sessionId: string;
    query: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    onEvent: (event: { type: string; data?: any; message?: string }) => void;
  }) => {
    return streamSSE(`/ai/query/${params.productId}`, {
      sessionId: params.sessionId,
      query: params.query,
      conversationHistory: params.conversationHistory,
    }, params.onEvent);
  },

  compareProducts: async (params: {
    productIds: string[];
    sessionId: string;
    query: string;
    onEvent: (event: { type: string; data?: any; message?: string }) => void;
  }) => {
    return streamSSE('/ai/compare', {
      productIds: params.productIds,
      sessionId: params.sessionId,
      query: params.query,
    }, params.onEvent);
  },
};

export default { productAPI, aiAPI };
