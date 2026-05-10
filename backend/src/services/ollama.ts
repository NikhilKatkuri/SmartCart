/**
 * Ollama LLM Service
 * Handles integration with local Ollama instance for product analysis
 */

export interface OllamaConfig {
  baseUrl: string;
  model: string;
  temperature: number;
  numCtx: number;
}

export interface OllamaResponse {
  response: string;
  done: boolean;
  context: number[];
}

const DEFAULT_CONFIG: OllamaConfig = {
  baseUrl: 'http://localhost:11434',
  model: 'llama2',
  temperature: 0.1,
  numCtx: 4096,
};

/**
 * Get response from local Ollama instance
 */
export const getLocalResponse = async (
  augmentedPrompt: string,
  config: Partial<OllamaConfig> = {}
): Promise<string> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    const response = await fetch(`${finalConfig.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: finalConfig.model,
        prompt: augmentedPrompt,
        stream: false,
        options: {
          temperature: finalConfig.temperature,
          num_ctx: finalConfig.numCtx,
          top_k: 40,
          top_p: 0.9,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = (await response.json()) as OllamaResponse;
    return data.response.trim();
  } catch (error) {
    console.error('Local model unavailable:', error);
    throw new Error(`Failed to get response from Ollama: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Generate embedding for a text using Ollama
 */
export const generateEmbedding = async (
  text: string,
  config: Partial<OllamaConfig> = {}
): Promise<number[]> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    const response = await fetch(`${finalConfig.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: finalConfig.model,
        prompt: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama embeddings API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { embedding: number[] };
    return data.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Check if Ollama service is running
 */
export const checkOllamaHealth = async (baseUrl: string = DEFAULT_CONFIG.baseUrl): Promise<boolean> => {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Ollama health check failed:', error);
    return false;
  }
};
