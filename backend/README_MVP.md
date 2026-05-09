# SmartCart Backend MVP

A Local-First, AI-Powered E-Commerce Product Assistant built with **TypeScript**, **Express**, **MongoDB**, and **Ollama**. This MVP implements the complete RAG (Retrieval-Augmented Generation) pipeline for grounded product analysis without cloud dependencies.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ & pnpm
- MongoDB
- Ollama (for local LLM inference)

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env

# 3. Start MongoDB
# (Make sure MongoDB is running on localhost:27017)

# 4. Pull and run Ollama (in a separate terminal)
ollama pull llama2
ollama serve

# 5. Run development server
pnpm dev
```

### Environment Variables
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/smartcart

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

---

## 📋 MVP Features

### ✅ Admin Routes
- **Create Product**: Add new products with full metadata
- **Update Product**: Modify existing product details
- **Delete Product**: Remove products (with cascading deletes)
- **Bulk Create**: Load entire product catalog with related data (reviews, specs, variants)

### ✅ User Routes
- **Get All Products**: Browse with pagination (page, limit)
- **Advanced Filters**: Category, brand, price range, rating, tags
- **Search**: Full-text search across title, description, brand
- **Get by ID**: Fetch single product with all related data

### ✅ LLM Routes (AI Features)
- **Product Analysis**: Deep-dive analysis of single product with AI
- **Product Comparison**: Compare 2 products on specific aspects
- **Chatbot API**: Q&A interface for detailed product discussion
- **Feature Comparison**: Compare features across multiple products
- **Health Check**: Verify Ollama service availability

---

## 🏗️ Architecture

### Data Flow
```
User Query 
  ↓
Data Retrieval (RAG Layer)
  ↓
Prompt Augmentation (Add Context)
  ↓
Ollama Inference (Local LLM)
  ↓
Safety Checks (Hallucination Detection)
  ↓
Response Formatting
  ↓
User Response
```

### Models
- **Product**: Core product information (title, price, rating, etc.)
- **Review**: Customer ratings and comments
- **Specification**: Detailed product specs (processor, RAM, etc.)
- **Knowledge Base**: Long descriptions for AI context
- **Variant**: Product variants (colors, sizes, models)
- **AI Context**: Additional context for LLM analysis
- **Inventory**: Price and stock tracking

---

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Example Requests

#### 1️⃣ Get All Products with Filters
```bash
curl "http://localhost:5000/api/v1/products?category=Electronics&minPrice=10000&maxPrice=50000&page=1&limit=10"
```

#### 2️⃣ Search Products
```bash
curl "http://localhost:5000/api/v1/products/search?q=laptop"
```

#### 3️⃣ Create Product (Admin)
```bash
curl -X POST "http://localhost:5000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "product_id": "LAP003",
      "product_title": "New Gaming Laptop",
      "category": "Electronics",
      "sub_category": "Laptop",
      "brand": "TechBrand",
      "price": 85000,
      "currency": "INR",
      "discount_percentage": 15,
      "stock_quantity": 50,
      "rating": 0,
      "review_count": 0,
      "short_description": "High-performance gaming laptop",
      "long_description": "Detailed specs...",
      "tags": ["gaming", "powerful"]
    }
  }'
```

#### 4️⃣ Analyze Product (AI)
```bash
curl "http://localhost:5000/api/v1/products/llm/analyze/LAP001?query=Is%20this%20good%20for%20video%20editing?"
```

#### 5️⃣ Compare Two Products (AI)
```bash
curl -X POST "http://localhost:5000/api/v1/products/llm/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id_1": "LAP001",
    "product_id_2": "LAP002",
    "aspect": "gaming_performance"
  }'
```

#### 6️⃣ Chatbot - Ask About Product
```bash
curl -X POST "http://localhost:5000/api/v1/products/llm/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "LAP001",
    "message": "Can I run Unreal Engine 5 on this laptop?"
  }'
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── admin.ts          # Admin CRUD operations
│   │   ├── user.ts           # User read operations
│   │   └── llm.ts            # LLM-powered features
│   ├── services/
│   │   ├── ollama.ts         # Ollama API integration
│   │   ├── rag.ts            # RAG pipeline
│   │   └── response-handler.ts # Safety checks & formatting
│   ├── models/
│   │   ├── product/
│   │   │   ├── product.ts
│   │   │   ├── review.ts
│   │   │   ├── specifications.ts
│   │   │   ├── knowledge.ts
│   │   │   ├── inventory.ts
│   │   │   ├── meta.ts
│   │   │   ├── variant.ts
│   │   │   └── ai-context.ts
│   │   └── index.ts          # Exports all models
│   ├── routes/
│   │   └── product/
│   │       └── index.ts      # All product routes
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── API_DOCUMENTATION.md      # Detailed API docs
└── README.md                 # This file
```

---

## 🔑 Key Implementation Details

### RAG Pipeline
```typescript
// 1. Retrieve product data from DB
const productData = await retrieveProductData(product_id);

// 2. Build augmented prompt with context
const prompt = buildAugmentedPrompt(userQuery, productData);

// 3. Send to Ollama
const response = await getLocalResponse(prompt);

// 4. Validate response
const validation = validateResponse(response);
```

### Safety Checks
- ✅ Hallucination Detection (phrases like "I think", "probably")
- ✅ Confidence Scoring
- ✅ Structure Validation
- ✅ Fallback Responses

### Grounding Mechanism
- Responses grounded in actual product data
- Cannot hallucinate features
- Clear uncertainty handling ("I don't have enough information")

---

## 🎯 Response Examples

### Product Analysis Response
```json
{
  "message": "Product analysis completed",
  "product_id": "LAP001",
  "analysis": "The AeroBook Pro 15 is a high-performance gaming laptop with an RTX 3050 GPU and 16GB DDR4 RAM. It's suitable for gaming, video editing, and heavy multitasking...",
  "metadata": {
    "isValid": true,
    "warnings": [],
    "requiresFallback": false
  }
}
```

### Product Comparison Response
```json
{
  "message": "Product comparison completed",
  "comparison": {
    "product_1": {
      "id": "LAP001",
      "title": "AeroBook Pro 15",
      "price": 74999,
      "rating": 4.3
    },
    "product_2": {
      "id": "LAP002",
      "title": "MaxBook Air 14",
      "price": 42999,
      "rating": 4.1
    }
  },
  "analysis": "The AeroBook Pro 15 excels in raw performance and screen size, making it better for gaming and video editing. However, the MaxBook Air 14 offers superior portability with its lighter weight and smaller form factor...",
  "aspect": "Overall"
}
```

---

## 🛠️ Development Commands

```bash
# Development with auto-reload
pnpm dev

# Type checking
pnpm type-check

# Linting & formatting
pnpm lint
pnpm prettier:check
pnpm prettier  # Fix formatting

# Build
pnpm build

# Production
pnpm start
```

---

## 📊 Database Schema

### Indexes
- `Product`: category, brand, price, rating (for fast filtering)
- `Review`: product_id, rating
- `Specification`: product_id
- `Knowledge`: product_id, rating
- `Variant`: product_id

---

## 🔐 Error Handling

All endpoints have comprehensive error handling:

| Status | Description |
|--------|-------------|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request (validation error) |
| `404` | Resource not found |
| `409` | Conflict (duplicate) |
| `500` | Server error |

---

## 🚦 Health Check

```bash
curl "http://localhost:5000/api/v1/products/health"
```

Response:
```json
{
  "message": "Health check result",
  "ollama": {
    "healthy": true,
    "baseUrl": "http://localhost:11434"
  }
}
```

---

## 🎓 Understanding the RAG Approach

### Problem Solved
- ❌ **Before**: LLMs hallucinate product features not in database
- ✅ **After**: Responses grounded in actual product data

### How It Works
1. **Retrieval**: Extract relevant product data from MongoDB
2. **Augmentation**: Add context to user query
3. **Generation**: LLM responds based only on provided context

### Example
```
User: "Can I run Unreal Engine 5 on this laptop?"

System Prompt: "Use ONLY the provided context. If not mentioned, say you don't have that information."

Context: 
- GPU: RTX 3050 4GB
- RAM: 16GB DDR4
- Processor: Intel i7 12th Gen

LLM Response: "Based on the specifications, with an RTX 3050 GPU and 16GB RAM, this laptop can run Unreal Engine 5. However, for optimal performance, Unreal Engine 5 recommends an RTX 2080 or better..."
```

---

## 📈 Future Enhancements

- [ ] User Authentication & Authorization
- [ ] Rate Limiting per User
- [ ] Product Image Upload & Processing
- [ ] User Reviews & Ratings System
- [ ] Wishlist & Cart Functionality
- [ ] Advanced Caching Layer
- [ ] Analytics & Logging
- [ ] API Documentation (Swagger/OpenAPI)
- [ ] Performance Optimization
- [ ] Multi-language Support

---

## 🐛 Troubleshooting

### Ollama Not Responding
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

### MongoDB Connection Error
```bash
# Verify MongoDB
mongosh localhost:27017/smartcart

# Check connection string in .env
```

### Type Errors
```bash
pnpm type-check
```

---

## 📝 Notes

- All timestamps in ISO 8601 format
- Pagination is 1-indexed
- Prices in specified currency (default: INR)
- LLM responses always grounded in product data
- Fallback responses if Ollama unavailable

---

## 👨‍💻 Author

Built for SmartCart - A Local-First E-Commerce AI Assistant

---

## 📄 License

ISC

