# AI Conversation Pipeline - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Get GROQ API Keys (Free)

1. Visit: https://console.groq.com/keys
2. Sign up with email (free account)
3. Create an API key
4. Copy the key (starts with `gsk_`)

> Optional: Create 2-3 keys for automatic fallback when rate-limited

### Step 2: Configure Environment

Edit `backend/.env`:

```env
SC_APP_NODE_ENV=development
SC_APP_PORT=5000
SC_APP_DATABASE_URL=mongodb://localhost:27017/smartcart

GROQ_API_KEY=gsk_your_key_here
# Optional for fallback:
# GROQ_API_KEY_1=gsk_key_1
# GROQ_API_KEY_2=gsk_key_2
# GROQ_API_KEY_3=gsk_key_3
```

### Step 3: Start Services

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend
pnpm install
pnpm dev

# Terminal 3: Start Frontend  
cd frontend
pnpm dev
```

### Step 4: Test AI Features

```bash
# Health check
curl http://localhost:5000/api/v1/ai/health

# Response:
# {
#   "status": "ok",
#   "message": "AI service is healthy",
#   "groqConfigured": true
# }
```

## 📱 Using AI Features

### Frontend Implementation (Next.js)

Create `frontend/src/hooks/useAIChat.ts`:

```typescript
import { useCallback, useState } from 'react';

interface StreamMessage {
  type: 'status' | 'chunk' | 'metadata' | 'complete' | 'error';
  data: any;
}

export function useAIChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');

  const queryProduct = useCallback(
    async (productId: string, query: string, sessionId: string) => {
      setIsLoading(true);
      setResponse('');
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ai/query/${productId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              query,
              conversationHistory: []
            })
          }
        );

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const message: StreamMessage = JSON.parse(line.slice(6));
              
              switch (message.type) {
                case 'status':
                  setStatus(message.data.message);
                  break;
                case 'chunk':
                  setResponse(prev => prev + message.data.content);
                  break;
              }
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { queryProduct, isLoading, response, status };
}
```

### Use in Component

```typescript
'use client';

import { useAIChat } from '@/hooks/useAIChat';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function ProductAIChat({ productId }: { productId: string }) {
  const [query, setQuery] = useState('');
  const { queryProduct, isLoading, response, status } = useAIChat();
  const [sessionId] = useState(() => `session_${uuidv4()}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await queryProduct(productId, query, sessionId);
    setQuery('');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Status Updates */}
      {status && (
        <div className="text-sm text-gray-600">
          {status}
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="bg-blue-50 p-4 rounded-lg text-gray-900">
          {response}
        </div>
      )}

      {/* Query Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask about this product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Asking AI...' : 'Ask'}
        </button>
      </form>
    </div>
  );
}
```

## 🔧 Architecture Decisions

### Why GROQ?

| Feature | Benefit |
|---------|---------|
| **Speed** | 50-150ms latency (very fast) |
| **Cost** | Free tier with generous limits |
| **Quality** | Mixtral 8x7b matches GPT-3.5 |
| **Reliability** | 99.9% uptime SLA |
| **Streaming** | Native SSE support |

### Why SSE (Server-Sent Events)?

```
❌ Bad: Wait for full response
User: "Tell me about this product"
...waits 5 seconds...
API: {response: "This is a great product..."}

✅ Good: Stream chunks in real-time  
User: "Tell me about this product"
API: "This is" → "a great" → "product" → "..."
User sees response appearing in real-time!
```

### Why MongoDB for Vector DB?

- Already in stack (no new dependency)
- Text search with regex matching
- Full product data as context
- Easy to scale

### Why Multi-Key Fallback?

```
Scenario: Your primary key hits rate limit at 10:30 AM

Without Fallback:
- All requests fail
- Users see error
- ❌ Poor experience

With Fallback:
- Auto-switch to Key 2
- Users don't notice
- ✅ Seamless experience
```

## 💡 Pro Tips

### 1. Test Locally First

```bash
# Check health
curl http://localhost:5000/api/v1/ai/health

# Test with sample product
curl -X POST http://localhost:5000/api/v1/ai/query/prod_123 \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session",
    "query": "What are the main features?"
  }' \
  -N
```

### 2. Monitor Token Usage

GROQ shows tokens used in response:
- Each product: ~300 tokens
- Each query: ~200 tokens
- Each response: ~400 tokens
- **Total**: ~900 tokens per conversation turn

Free tier limit: **200,000 tokens/min** (plenty!)

### 3. Optimize Prompts

```typescript
// ❌ Bad: Generic prompt
"Tell me about this product"

// ✅ Good: Specific questions
"What's the battery life and is it suitable for gaming?"
"How does this compare to a MacBook?"
"Is this good for video editing?"
```

### 4. Handle Rate Limits Gracefully

```typescript
// The system auto-handles this, but monitor logs:
if (statusCode === 429) {
  // System automatically switches to next API key
  // User doesn't see any error
  // Continue with next request
}
```

## 🚨 Common Issues

### Issue: "GROQ API keys not configured"

**Solution**: 
```bash
# Check your .env file has:
echo $GROQ_API_KEY  # Should show gsk_...

# Or:
echo $GROQ_API_KEY_1  # Should show gsk_...

# If empty, set it:
export GROQ_API_KEY=gsk_your_key_here
```

### Issue: Streaming not working

**Solution**:
```typescript
// Make sure you're reading response as stream:
const response = await fetch(url, { method: 'POST' });
const reader = response.body.getReader();  // ✅ This is important

// Don't do:
const data = await response.json();  // ❌ This waits for full response
```

### Issue: Hallucinated information

**Solution**: The system is designed to prevent this:
1. RAG layer retrieves real product data
2. System prompt includes exact specs
3. LLM instructed to say "not available" for missing info
4. Check product data is correct in MongoDB

### Issue: Slow responses

**Check**:
1. Network latency: `curl http://api.groq.com -I`
2. MongoDB query: Check product retrieval time
3. Token budget: Reduce context window if too large
4. API key rate limit: Check if hitting limits

## 📊 Expected Performance

| Metric | Value |
|--------|-------|
| TTFB (first chunk) | 200-500ms |
| Chunk delivery | 50-100ms |
| Full response | 2-5 seconds |
| Memory per session | ~100KB |
| Cost per query | $0.0001 (very cheap!) |

## 🎯 Next Steps

1. **Implement in Product Pages**
   - Add AI chat button on product detail page
   - Show streaming response
   - Save conversation history

2. **Add Comparison Feature**
   - Allow "Compare with other products"
   - Use `POST /api/v1/ai/compare` endpoint
   - Show side-by-side analysis

3. **Add User Feedback**
   - Thumbs up/down on responses
   - Track helpful vs unhelpful answers
   - Improve system prompts over time

4. **Analytics**
   - Track most-asked questions
   - Monitor LLM quality
   - Identify product info gaps

## 📚 Resources

- **GROQ Documentation**: https://console.groq.com/docs
- **SSE Guide**: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- **MongoDB Text Search**: https://docs.mongodb.com/manual/reference/operator/query/text/

## 🎉 You're All Set!

Your AI conversation pipeline is ready for:
- ✅ Product inquiries
- ✅ Specifications questions
- ✅ Product comparisons
- ✅ Real-time streaming responses
- ✅ Multi-key fallback handling
- ✅ Token-efficient generation

Happy building! 🚀
