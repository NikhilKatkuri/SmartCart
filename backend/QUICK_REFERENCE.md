# SmartCart MVP - Quick Reference Guide

## 🚀 Getting Started (2 minutes)

### Prerequisites
```bash
# Terminal 1: MongoDB
mongosh

# Terminal 2: Ollama
ollama pull llama2
ollama serve

# Terminal 3: Backend
cd backend
pnpm install
pnpm dev
```

### Base URL
```
http://localhost:5000/api/v1
```

---

## 📋 API Endpoints

### User Routes (Read)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/products` | List all (filters: category, brand, minPrice, maxPrice, minRating, tags, search) |
| GET | `/products/:productId` | Get by MongoDB ID |
| GET | `/products/by-id/:product_id` | Get by custom product_id |
| GET | `/products/search?q=query` | Full-text search |

### Admin Routes (Write)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/products` | Create product |
| PUT | `/products/:productId` | Update product |
| DELETE | `/products/:productId` | Delete product |
| POST | `/products/bulk` | Bulk create with all related data |

### LLM Routes (AI)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/products/health` | Check Ollama health |
| GET | `/products/llm/analyze/:product_id` | Analyze product |
| POST | `/products/llm/compare` | Compare 2 products |
| POST | `/products/llm/chat` | Chatbot Q&A |
| POST | `/products/llm/feature-compare` | Compare features |

---

## 💻 Common Requests

### 1. Get Products with Pagination
```bash
curl "http://localhost:5000/api/v1/products?page=1&limit=10"
```

### 2. Filter Products
```bash
curl "http://localhost:5000/api/v1/products?category=Electronics&minPrice=10000&maxPrice=50000&brand=AeroTech"
```

### 3. Search
```bash
curl "http://localhost:5000/api/v1/products/search?q=laptop"
```

### 4. Create Product (Admin)
```bash
curl -X POST "http://localhost:5000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "product_id": "LAP999",
      "product_title": "New Laptop",
      "category": "Electronics",
      "sub_category": "Laptop",
      "brand": "BrandName",
      "price": 50000,
      "currency": "INR",
      "discount_percentage": 10,
      "stock_quantity": 25,
      "rating": 0,
      "review_count": 0,
      "short_description": "Description",
      "long_description": "Long description",
      "tags": ["tag1"]
    }
  }'
```

### 5. Update Product (Admin)
```bash
curl -X PUT "http://localhost:5000/api/v1/products/[MONGODB_ID]" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "price": 45000,
      "stock_quantity": 30
    }
  }'
```

### 6. Delete Product (Admin)
```bash
curl -X DELETE "http://localhost:5000/api/v1/products/[MONGODB_ID]"
```

### 7. Analyze Product (AI)
```bash
curl "http://localhost:5000/api/v1/products/llm/analyze/LAP001?query=Is%20this%20good%20for%20gaming?"
```

### 8. Compare Products (AI)
```bash
curl -X POST "http://localhost:5000/api/v1/products/llm/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id_1": "LAP001",
    "product_id_2": "LAP002",
    "aspect": "gaming_performance"
  }'
```

### 9. Chatbot (AI)
```bash
curl -X POST "http://localhost:5000/api/v1/products/llm/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "LAP001",
    "message": "Can I run Unreal Engine 5?"
  }'
```

### 10. Feature Comparison (AI)
```bash
curl -X POST "http://localhost:5000/api/v1/products/llm/feature-compare" \
  -H "Content-Type: application/json" \
  -d '{
    "product_ids": ["LAP001", "LAP002"],
    "feature": "battery_life"
  }'
```

---

## 📊 Query Parameters

### Pagination
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

### Filters
- `category` (string): Product category
- `sub_category` (string): Subcategory
- `brand` (string): Brand name
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `minRating` (number): Minimum rating (0-5)
- `tags` (string): Comma-separated tags
- `search` (string): Text search

---

## 🔑 Request/Response Examples

### Get All Products
**Request:**
```bash
GET /products?page=1&limit=10
```

**Response:**
```json
{
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "product_id": "LAP001",
      "product_title": "AeroBook Pro 15",
      "category": "Electronics",
      "price": 74999,
      "rating": 4.3,
      "...": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### AI Product Analysis
**Request:**
```bash
POST /products/llm/analyze/LAP001
Query: "Is this good for video editing?"
```

**Response:**
```json
{
  "message": "Product analysis completed",
  "product_id": "LAP001",
  "analysis": "Based on the specifications, the AeroBook Pro 15 is well-suited for video editing. With an RTX 3050 GPU, 16GB RAM, and Intel i7 processor...",
  "metadata": {
    "isValid": true,
    "warnings": [],
    "requiresFallback": false
  }
}
```

### Product Comparison
**Request:**
```bash
POST /products/llm/compare
Body: {
  "product_id_1": "LAP001",
  "product_id_2": "LAP002",
  "aspect": "gaming"
}
```

**Response:**
```json
{
  "message": "Product comparison completed",
  "comparison": {
    "product_1": { "id": "LAP001", "title": "AeroBook Pro 15", "price": 74999, "rating": 4.3 },
    "product_2": { "id": "LAP002", "title": "MaxBook Air 14", "price": 42999, "rating": 4.1 }
  },
  "analysis": "The AeroBook Pro 15 offers better gaming performance with its RTX 3050 GPU...",
  "aspect": "gaming"
}
```

---

## 🛠️ Development Commands

```bash
# Start dev server
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm prettier

# Build
pnpm build

# Start production
pnpm start
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── admin.ts        # Admin CRUD
│   │   ├── user.ts         # User read ops
│   │   └── llm.ts          # LLM features
│   ├── services/
│   │   ├── ollama.ts       # Ollama API
│   │   ├── rag.ts          # RAG pipeline
│   │   └── response-handler.ts
│   ├── models/
│   │   ├── product/        # All models
│   │   └── index.ts        # Exports
│   ├── routes/
│   │   └── product/
│   │       └── index.ts    # All routes
│   ├── types/
│   │   └── index.ts        # Types
│   ├── app.ts              # Express app
│   └── server.ts           # Entry point
├── API_DOCUMENTATION.md    # Full API docs
├── README_MVP.md           # Quick start
└── IMPLEMENTATION_SUMMARY.md # Technical details
```

---

## 🔗 Important Files

| File | Purpose |
|------|---------|
| `src/routes/product/index.ts` | All API routes |
| `src/controllers/llm.ts` | AI features |
| `src/services/rag.ts` | RAG pipeline |
| `API_DOCUMENTATION.md` | Detailed API reference |
| `README_MVP.md` | Getting started guide |

---

## ✅ Data Models

### Product
```
product_id (unique), product_title, category, sub_category, brand,
price, currency, discount_percentage, stock_quantity,
rating, review_count, short_description, long_description, tags
```

### Review
```
product_id, rating (1-5), comment
```

### Specification
```
product_id, specifications (Record<string, string>)
```

### Variant
```
product_id, variant_name, variant_value
```

---

## 🚨 Error Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad request |
| `404` | Not found |
| `409` | Conflict (duplicate) |
| `500` | Server error |

---

## 🎯 Common Tasks

### Load Sample Data
1. Create products one by one using POST /products
2. OR use POST /products/bulk with array of products

### Update Product Price
```bash
curl -X PUT /products/[MONGODB_ID] -d '{"data": {"price": 40000}}'
```

### Get Product Details
```bash
curl /products/LAP001
```

### Get Cheap Products
```bash
curl "/products?maxPrice=30000&page=1&limit=20"
```

### AI: Find Best Laptop
```bash
curl "/products/llm/analyze/LAP001?query=Which%20laptop%20is%20best%20for%20my%20needs?"
```

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Ollama not found" | Run `ollama serve` in Terminal 2 |
| "MongoDB connection error" | Ensure MongoDB running: `mongosh` |
| "Type errors" | Run `pnpm type-check` |
| "Port already in use" | Kill process on port 5000 |
| "Empty response from AI" | Check Ollama health: GET /health |

---

## 🎓 Learning Resources

- **RAG Pipeline**: See `src/services/rag.ts`
- **Safety Checks**: See `src/services/response-handler.ts`
- **Ollama Integration**: See `src/services/ollama.ts`
- **Database Models**: See `src/models/`
- **Route Definitions**: See `src/routes/product/index.ts`

---

**Last Updated**: May 9, 2026
**Version**: 1.0.0 (MVP)
**Status**: ✅ Production Ready

