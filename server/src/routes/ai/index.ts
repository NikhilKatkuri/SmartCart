/**
 * AI Routes
 *
 * POST /api/v1/ai/query/:productId   — stream response for a product query
 * POST /api/v1/ai/compare            — stream comparison of multiple products
 * GET  /api/v1/ai/history/:sessionId — get conversation history
 * DEL  /api/v1/ai/session/:sessionId — end session and free memory
 * GET  /api/v1/ai/health             — service health check
 */

import { AIPipeline } from '@/services/pipeline';
import { getProductMeta } from '@/services/rag';
import { sseEvent } from '@/services/responseHandler';
import { Router, Request, Response } from 'express';

const router: Router = Router();
const baseName = "ai";
const fullBasePath = (name: string) => `/${baseName}${name}`;

// In-memory session store (one pipeline per session)
const sessions = new Map<string, AIPipeline>();

function getOrCreateSession(sessionId: string): AIPipeline {
      if (!sessions.has(sessionId)) { 
            sessions.set(sessionId, new AIPipeline());
      } 
      return sessions.get(sessionId)!;
}

function setupSSE(res: Response): void {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
      res.flushHeaders();
}

// ─── Health check ─────────────────────────────────────────────────────────────

router.get(fullBasePath('/health'), (_req, res) => {
      res.json({
            status: 'ok',
            groq_configured: !!(process.env.GROQ_API_KEY ?? process.env.GROQ_API_KEY_1),
            active_sessions: sessions.size,
      });
});

// ─── Query a product ──────────────────────────────────────────────────────────

router.post(fullBasePath('/query/:productId'), async (req: Request, res: Response) => {
      let bodyData = req.body;
      if (typeof bodyData === 'string') {
            try { bodyData = JSON.parse(bodyData); } catch (e) {}
      }

      const { productId } = req.params as { productId: string };
      const { sessionId, query, conversationHistory } = bodyData as {
            sessionId?: string;
            query?: string;
            conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
      };

      if (!query?.trim()) {
            res.status(400).json({ error: 'query is required' });
            return;
      }
      if (!sessionId) {
            res.status(400).json({ error: 'sessionId is required' });
            return;
      }

      // 1. Open SSE stream early to send live status updates
      setupSSE(res);

      res.write(sseEvent({
            type: 'status',
            message: 'Validating product existence...'
      }));

      // Pre-validate product exists
      const meta = await getProductMeta(productId);
      if (!meta) {
            res.write(sseEvent({
                  type: 'error',
                  data: { message: `Product "${productId}" not found` }
            }));
            res.end();
            return;
      }

      res.write(sseEvent({
            type: 'status',
            message: 'Product loaded successfully! Preparing AI pipeline...'
      }));

      const pipeline = getOrCreateSession(sessionId);

      // Restore history from client if provided (for stateless clients)
      if (conversationHistory?.length) {
            pipeline.setHistory(conversationHistory);
            res.write(sseEvent({
                  type: 'status',
                  message: 'Restored previous conversation history...'
            }));
      }

      try {
            res.write(sseEvent({
                  type: 'status',
                  message: 'Executing AI query...'
            }));
            for await (const event of pipeline.query(productId, query)) {
                  res.write(event);
            }
      } catch (error) {
            res.write(sseEvent({
                  type: 'error',
                  data: { message: error instanceof Error ? error.message : 'Unknown error' },
            }));
      } finally {
            res.end();
      }
});

// ─── Compare multiple products ────────────────────────────────────────────────

router.post(fullBasePath('/compare'), async (req: Request, res: Response) => {
      let bodyData = req.body;
      if (typeof bodyData === 'string') {
            try { bodyData = JSON.parse(bodyData); } catch (e) {}
      }

      const { sessionId, productIds, query } = bodyData as {
            sessionId?: string;
            productIds?: string[];
            query?: string;
      };

      // Ensure we haven't opened SSE if basic parameters fail
      if (!Array.isArray(productIds) || productIds.length < 2) {
            res.status(400).json({ error: 'At least 2 productIds required' });
            return;
      }
      if (!query?.trim()) {
            res.status(400).json({ error: 'query is required' });
            return;
      }
      if (!sessionId) {
            res.status(400).json({ error: 'sessionId is required' });
            return;
      }

      // 1. Open SSE stream early
      setupSSE(res);

      res.write(sseEvent({
            type: 'status',
            message: 'Initializing AI session for comparison...'
      }));

      const pipeline = getOrCreateSession(sessionId);

      try {
            res.write(sseEvent({
                  type: 'status',
                  message: 'Executing comparison pipeline...'
            }));
            for await (const event of pipeline.compare(productIds, query)) {
                  res.write(event);
            }
      } catch (error) {
            res.write(sseEvent({
                  type: 'error',
                  data: { message: error instanceof Error ? error.message : 'Comparison failed' },
            }));
      } finally {
            res.end();
      }
});

// ─── Get history ──────────────────────────────────────────────────────────────

router.get(fullBasePath('/history/:sessionId'), (req: Request, res: Response) => {
      const { sessionId } = req.params as { sessionId: string };
      const pipeline = sessions.get(sessionId);

      if (!pipeline) {
            res.status(404).json({ error: 'Session not found' });
            return;
      }

      res.json({ sessionId, history: pipeline.getHistory() });
});

// ─── End session ──────────────────────────────────────────────────────────────

router.delete(fullBasePath('/session/:sessionId'), (req: Request, res: Response) => {
      const { sessionId } = req.params as { sessionId: string };
      const existed = sessions.delete(sessionId);
      res.json({ sessionId, ended: existed, active_sessions: sessions.size });
});

export { router as aiRouter };
