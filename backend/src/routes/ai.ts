/**
 * AI Query Endpoint with Server-Sent Events (SSE) Streaming
 * POST /api/v1/ai/query/:productId - Query about a product
 * POST /api/v1/ai/compare - Compare multiple products
 * GET /api/v1/ai/history/:sessionId - Get conversation history
 * DELETE /api/v1/ai/history/:sessionId - Clear conversation
 */

import { Router, Request, Response } from 'express';
import { AIPipeline } from '../services/pipeline';
import { retrieveProductData } from '../services/rag';

const router: Router = Router();

// Store pipelines per session
const pipelineSessions = new Map<string, AIPipeline>();

/**
 * Health check for AI service
 * GET /api/v1/ai/health
 */
router.get('/health', (_req: Request, res: Response) => {
      res.json({
            status: 'ok',
            message: 'AI service is healthy',
      });
});

/**
 * Query about a specific product with SSE streaming
 * POST /api/v1/ai/query/:productId
 *
 * Body: {
 *   sessionId: string (unique session identifier),
 *   query: string (user question),
 *   conversationHistory?: Array<{role: 'user'|'assistant', content: string}>
 * }
 *
 * Response: Server-Sent Events (SSE) Stream
 * Events: {type: 'status'|'chunk'|'metadata'|'complete'|'error', data: ...}
 */
router.post('/query/:productId', async (req: Request, res: Response) => {
      try {
            const { productId } = req.params as { productId: string };
            const { sessionId, query, conversationHistory } = req.body;

            // Validate input
            if (!query || !query.trim()) {
                  res.status(400).json({ error: 'Query is required' });
                  return;
            }

            if (!sessionId) {
                  res.status(400).json({ error: 'Session ID is required' });
                  return;
            }

            // Validate product exists
            const productData = await retrieveProductData(productId);
            if (!productData) {
                  res.status(404).json({ error: 'Product not found' });
                  return;
            }

            // Get or create pipeline for this session
            let pipeline = pipelineSessions.get(sessionId);
            if (!pipeline) {
                  pipeline = new AIPipeline();
                  pipelineSessions.set(sessionId, pipeline);
            }

            // Set conversation history if provided
            if (conversationHistory && Array.isArray(conversationHistory)) {
                  pipeline.setHistory(conversationHistory);
            }

            // Set up SSE response headers
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('X-Accel-Buffering', 'no');
            res.setHeader('Access-Control-Allow-Origin', '*');

            // Stream response
            try {
                  for await (const sse of pipeline.query(productId, query)) {
                        res.write(`data: ${sse}\n\n`);
                  }
                  res.end();
            } catch (streamError) {
                  res.write(
                        `data: ${JSON.stringify({
                              type: 'error',
                              data: {
                                    message: streamError instanceof Error ? streamError.message : 'Streaming error',
                              },
                        })}\n\n`
                  );
                  res.end();
            }
      } catch (error) {
            console.error('AI Query Error:', error);
            res.status(500).json({
                  error: error instanceof Error ? error.message : 'Internal server error',
            });
      }
});

/**
 * Compare multiple products with streaming
 * POST /api/v1/ai/compare
 *
 * Body: {
 *   sessionId: string,
 *   productIds: string[] (at least 2),
 *   query: string (comparison question),
 *   aspects?: string[] (comparison aspects)
 * }
 */
router.post('/compare', async (req: Request, res: Response) => {
      try {
            const { sessionId, productIds, query } = req.body;

            // Validate input
            if (!Array.isArray(productIds) || productIds.length < 2) {
                  res.status(400).json({ error: 'At least 2 product IDs required' });
                  return;
            }

            if (!query || !query.trim()) {
                  res.status(400).json({ error: 'Query is required' });
                  return;
            }

            if (!sessionId) {
                  res.status(400).json({ error: 'Session ID is required' });
                  return;
            }

            // Get or create pipeline
            let pipeline = pipelineSessions.get(sessionId);
            if (!pipeline) {
                  pipeline = new AIPipeline();
                  pipelineSessions.set(sessionId, pipeline);
            }

            // Set up SSE response
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('X-Accel-Buffering', 'no');
            res.setHeader('Access-Control-Allow-Origin', '*');

            try {
                  for await (const message of pipeline.streamComparison(query, productIds, (status) => {
                        res.write(
                              `data: ${JSON.stringify({
                                    type: 'status',
                                    data: status,
                              })}\n\n`
                        );
                  })) {
                        // Forward all message types
                        res.write(`data: ${JSON.stringify(message)}\n\n`);
                  }

                  res.write(
                        `data: ${JSON.stringify({
                              type: 'complete',
                              data: { success: true },
                        })}\n\n`
                  );

                  res.end();
            } catch (streamError) {
                  res.write(
                        `data: ${JSON.stringify({
                              type: 'error',
                              data: {
                                    message: streamError instanceof Error ? streamError.message : 'Comparison error',
                              },
                        })}\n\n`
                  );
                  res.end();
            }
      } catch (error) {
            console.error('Comparison Error:', error);
            res.status(500).json({
                  error: error instanceof Error ? error.message : 'Internal server error',
            });
      }
});


/**
 * Clear conversation history for a session
 * DELETE /api/v1/ai/history/:sessionId
 */
router.delete('/history/:sessionId', (req: Request, res: Response) => {
      try {
            const { sessionId } = req.params as { sessionId: string };
            const pipeline = pipelineSessions.get(sessionId);

            if (!pipeline) {
                  res.status(404).json({ error: 'Session not found' });
                  return;
            }

            const messageCount = pipeline.getHistory().length;
            pipeline.clearHistory();

            res.json({
                  message: 'Conversation cleared',
                  sessionId,
                  messagesDeleted: messageCount,
            });
      } catch (error) {
            console.error('Clear History Error:', error);
            res.status(500).json({
                  error: error instanceof Error ? error.message : 'Internal server error',
            });
      }
});

/**
 * End session and cleanup resources
 * DELETE /api/v1/ai/session/:sessionId
 */
router.delete('/session/:sessionId', (req: Request, res: Response) => {
      try {
            const { sessionId } = req.params as { sessionId: string };
            const existed = pipelineSessions.has(sessionId);

            if (existed) {
                  pipelineSessions.delete(sessionId);
            }

            res.json({
                  message: 'Session ended and cleanup completed',
                  sessionId,
                  wasActive: existed,
                  activeSessions: pipelineSessions.size,
            });
      } catch (error) {
            console.error('Session Error:', error);
            res.status(500).json({
                  error: error instanceof Error ? error.message : 'Internal server error',
            });
      }
});

export default router;
