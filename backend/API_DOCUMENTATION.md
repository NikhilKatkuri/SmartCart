# SmartCart Backend MVP API Documentation

## Overview
SmartCart Backend MVP is built with TypeScript, Express, and MongoDB. It follows the Local-First RAG (Retrieval-Augmented Generation) architecture with Ollama integration for on-device AI inference.

## Architecture
- **Admin Routes**: Product CRUD operations
- **User Routes**: Product browsing with pagination and filters
- **LLM Routes**: AI-powered product analysis, comparisons, and chatbot

## Environment Setup

### Required Environment Variables
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
DATABASE_URL=mongodb://localhost:27017/smartcart
NODE_ENV=development
```

### Starting Ollama Locally
```bash
# Pull and run Ollama with llama2 model
ollama pull llama2
ollama serve
```

---

## API Routes

### Base URL
```
http://localhost:5000/api/v1
```

---

## USER ROUTES (Read-only)

### 1. Get All Products with Pagination & Filters
```http
GET /products
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `sub_category` (string): Filter by sub-category
- `brand` (string): Filter by brand
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `minRating` (number): Minimum rating
- `tags` (string): Comma-separated tags
- `search` (string): Search in title and description

**Example:**
```bash
curl "http://localhost:5000/api/v1/products?page=1&limit=10&category=Electronics&minPrice=5000"
```

**Response:**
```json
{
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "...",
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

---

### 2. Search Products
```http
GET /products/search
```

**Query Parameters:**
- `q` (string): Search query (required)
- `page` (number): Page number
- `limit` (number): Items per page

**Example:**
```bash
curl "http://localhost:5000/api/v1/products/search?q=laptop&page=1&limit=5"
```

**Response:**
```json
{
  "message": "Products found",
  "data": [...],
  "pagination": {...}
}
```

---

### 3. Get Product by MongoDB ID
```http
GET /products/:productId
```

**Parameters:**
- `productId` (string): MongoDB ObjectId

**Example:**
```bash
curl "http://localhost:5000/api/v1/products/507f1f77bcf86cd799439011"
```

**Response:**
```json
{
  "message": "Product fetched successfully",
  "product": {
    "_id": "...",
    "product_id": "LAP001",
    "product_title": "AeroBook Pro 15",
    "category": "Electronics",
    "sub_category": "Laptop",
    "brand": "AeroTech",
    "price": 74999,
    "discount_percentage": 10,
    "rating": 4.3,
    "review_count": 120,
    "reviews": [...],
    "specifications": {
      "processor": "Intel i7 12th Gen",
      "ram": "16GB DDR4",
      "storage": "512GB SSD"
    },
    "variants": [...]
  }
}
```

---

### 4. Get Product by Product ID
```http
GET /products/by-id/:product_id
```

**Parameters:**
- `product_id` (string): Custom product ID (e.g., LAP001)

**Example:**
```bash
curl "http://localhost:5000/api/v1/products/by-id/LAP001"
```

---

## ADMIN ROUTES (Write Operations)

### 1. Create Product
```http
POST /products
```

**Body:**
```json
{
  "data": {
    "product_id": "NEW001",
    "product_title": "New Product",
    "category": "Electronics",
    "sub_category": "Laptop",
    "brand": "BrandName",
    "Img_URL": null,
    "short_description": "Short description",
    "long_description": "Long detailed description",
    "price": 50000,
    "currency": "INR",
    "discount_percentage": 10,
    "stock_quantity": 25,
    "rating": 0,
    "review_count": 0,
    "tags": ["tag1", "tag2"]
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:5000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "product_id": "NEW001",
      "product_title": "New Product",
      "category": "Electronics",
      "sub_category": "Laptop",
      "brand": "BrandName",
      "Img_URL": null,
      "short_description": "A new product",
      "long_description": "Detailed description of the new product",
      "price": 50000,
      "currency": "INR",
      "discount_percentage": 10,
      "stock_quantity": 25,
      "rating": 0,
      "review_count": 0,
      "tags": ["new", "product"]
    }
  }'
```

**Response:**
```json
{
  "message": "Product created successfully",
  "id": "507f1f77bcf86cd799439011",
  "product": {...}
}
```

---

### 2. Bulk Create Products
```http
POST /products/bulk
```

**Body:**
```json
{
  "data": [
    {
      "product_id": "BLK001",
      "product_title": "Bulk Product 1",
      "category": "Electronics",
      "...": "...",
      "reviews": [
        {
          "rating": 5,
          "comment": "Great product"
        }
      ],
      "specifications": {
        "key": "value"
      },
      "variants": [
        {
          "color": "Black",
          "size": "Large"
        }
      ],
      "ai_context_text": "AI context for this product"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Bulk products created",
  "results": {
    "productsCreated": 10,
    "reviewsCreated": 25,
    "specificationsCreated": 10,
    "variantsCreated": 20,
    "aiContextCreated": 10,
    "errors": []
  }
}
```

---

### 3. Update Product
```http
PUT /products/:productId
```

**Parameters:**
- `productId` (string): MongoDB ObjectId

**Body:**
```json
{
  "data": {
    "price": 45000,
    "discount_percentage": 15,
    "stock_quantity": 30
  }
}
```

**Response:**
```json
{
  "message": "Product updated successfully",
  "product": {...}
}
```

---

### 4. Delete Product
```http
DELETE /products/:productId
```

**Parameters:**
- `productId` (string): MongoDB ObjectId

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

---

## LLM ROUTES (AI Features)

### 1. Analyze Single Product
```http
GET /products/llm/analyze/:product_id
```

**Parameters:**
- `product_id` (string): Custom product ID

**Query Parameters:**
- `query` (string): Optional custom analysis query

**Example:**
```bash
curl "http://localhost:5000/api/v1/products/llm/analyze/LAP001?query=Is%20this%20good%20for%20gaming?"
```

**Response:**
```json
{
  "message": "Product analysis completed",
  "product_id": "LAP001",
  "analysis": "Based on the specifications, the AeroBook Pro 15 is well-suited for gaming...",
  "metadata": {
    "isValid": true,
    "warnings": [],
    "requiresFallback": false
  }
}
```

---

### 2. Compare Two Products
```http
POST /products/llm/compare
```

**Body:**
```json
{
  "product_id_1": "LAP001",
  "product_id_2": "LAP002",
  "aspect": "gaming_performance"
}
```

**Example:**
```bash
curl -X POST "http://localhost:5000/api/v1/products/llm/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id_1": "LAP001",
    "product_id_2": "LAP002",
    "aspect": "For video editing"
  }'
```

**Response:**
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
  "analysis": "The AeroBook Pro 15 offers better performance for video editing due to its dedicated GPU...",
  "aspect": "For video editing",
  "metadata": {
    "isValid": true,
    "warnings": []
  }
}
```

---

### 3. Chatbot API - Detailed Product Analysis
```http
POST /products/llm/chat
```

**Body:**
```json
{
  "product_id": "LAP001",
  "message": "Can this laptop run Unreal Engine 5 for game development?"
}
```

**Example:**
```bash
curl -X POST "http://localhost:5000/api/v1/products/llm/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "LAP001",
    "message": "Can this laptop run Unreal Engine 5?"
  }'
```

**Response:**
```json
{
  "message": "Chatbot response generated",
  "product_id": "LAP001",
  "product_title": "AeroBook Pro 15",
  "user_message": "Can this laptop run Unreal Engine 5?",
  "assistant_response": "Yes, the AeroBook Pro 15 can run Unreal Engine 5...",
  "metadata": {
    "isValid": true,
    "warnings": [],
    "requiresFallback": false
  }
}
```

---

### 4. Compare Features Across Multiple Products
```http
POST /products/llm/feature-compare
```

**Body:**
```json
{
  "product_ids": ["LAP001", "LAP002", "TAB001"],
  "feature": "battery_life"
}
```

**Example:**
```bash
curl -X POST "http://localhost:5000/api/v1/products/llm/feature-compare" \
  -H "Content-Type: application/json" \
  -d '{
    "product_ids": ["LAP001", "LAP002"],
    "feature": "battery life and portability"
  }'
```

**Response:**
```json
{
  "message": "Feature comparison completed",
  "products": [
    {
      "id": "LAP001",
      "title": "AeroBook Pro 15",
      "price": 74999,
      "rating": 4.3
    },
    {
      "id": "LAP002",
      "title": "MaxBook Air 14",
      "price": 42999,
      "rating": 4.1
    }
  ],
  "feature": "battery life and portability",
  "comparison": "The MaxBook Air 14 excels in portability with a 50Wh battery and 1.3kg weight..."
}
```

---

### 5. Health Check
```http
GET /products/health
```

**Response:**
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

## Data Models

### Product
```typescript
{
  _id: ObjectId
  product_id: string (unique)
  product_title: string
  category: string
  sub_category: string
  brand: string
  Img_URL: string | null
  short_description: string
  long_description: string
  price: number
  currency: string
  discount_percentage: number
  stock_quantity: number
  rating: number
  review_count: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
```

### Review
```typescript
{
  _id: ObjectId
  product_id: string
  rating: 1-5
  comment: string
  createdAt: Date
}
```

### Specification
```typescript
{
  _id: ObjectId
  product_id: string
  specifications: Record<string, string>
  createdAt: Date
  updatedAt: Date
}
```

### Variant
```typescript
{
  _id: ObjectId
  product_id: string
  variant_name: string
  variant_value: string
  createdAt: Date
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "message": "Product data with product_id is required"
}
```

### 404 - Not Found
```json
{
  "message": "Product not found"
}
```

### 409 - Conflict
```json
{
  "message": "Product with this ID already exists"
}
```

### 500 - Server Error
```json
{
  "message": "Error creating product",
  "error": "Error details"
}
```

---

## Key Features

### 1. RAG Pipeline
- Retrieves relevant product data
- Augments user queries with product context
- Sends grounded prompts to LLM

### 2. Safety Checks
- Detects hallucination indicators
- Validates response structure
- Provides confidence scoring

### 3. Local-First Design
- Uses Ollama for on-device inference
- Processes data privately
- Zero operational costs

### 4. Fallback Strategy
- Automatic fallback if Ollama unavailable
- Structured responses
- Error handling

---

## Running the Backend

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

---

## TODO / Upcoming Features

- [ ] User authentication and authorization
- [ ] Rate limiting per user
- [ ] Product image uploads
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced filtering and sorting
- [ ] Analytics and logging
- [ ] Caching layer
- [ ] API documentation with Swagger/OpenAPI

---

## Notes

- All timestamps are in ISO 8601 format
- Pagination is 1-indexed
- Prices are in the specified currency (default: INR)
- LLM responses are grounded in provided data
- Empty responses trigger fallback mechanisms
