# SmartCart Data Loading Guide

## 📊 Loading CSV Data to Database

This guide explains how to load product data from the CSV file into MongoDB using the admin API endpoints.

---

## 🚀 Quick Start

### Prerequisites
1. **Backend running**: `pnpm dev` in the backend folder
2. **MongoDB running**: Ensure MongoDB is up and running
3. **API available**: http://localhost:5000/api/v1 should be accessible

### Load Data in 2 Steps

```bash
# From backend folder
cd backend

# Run the data loader
pnpm load-data
```

That's it! ✨

---

## 📋 What Gets Loaded

The CSV loader will:
- ✅ Parse **SMART_CART_DATA.csv** from the backend folder
- ✅ Extract 10 products with complete data
- ✅ Create product records with:
  - Basic info (title, brand, category, price, rating)
  - Reviews (ratings and comments)
  - Specifications (detailed specs)
  - Variants (colors, sizes, models)
  - Tags (searchable keywords)
  - AI context (for LLM analysis)
- ✅ Push data in batches via the **bulk create** admin API endpoint
- ✅ Show progress and results

---

## 📊 Products Included

The SMART_CART_DATA.csv includes:

| Product ID | Title | Category | Price | Rating |
|------------|-------|----------|-------|--------|
| LAP001 | AeroBook Pro 15 | Laptop | ₹74,999 | 4.3/5 |
| PHN001 | Nova X5 Pro | Smartphone | ₹28,999 | 4.4/5 |
| PHN002 | MaxPhone 12 Ultra | Smartphone | ₹14,999 | 4.0/5 |
| TAB001 | AeroPad Ultra 11 | Tablet | ₹45,999 | 4.5/5 |
| HEAD001 | WavePro Noise Cancelling | Headphones | ₹8,999 | 4.6/5 |
| HEAD002 | BudsPro TWS Earbuds | Earbuds | ₹2,999 | 4.2/5 |
| CAM001 | ProShot DSLR 5000 | Camera | ₹52,999 | 4.7/5 |
| WATCH001 | FitWatch Pro 3 | Smartwatch | ₹12,999 | 4.3/5 |
| LAP002 | MaxBook Air 14 | Laptop | ₹42,999 | 4.1/5 |

---

## 🔧 Advanced Usage

### Custom API URL

```bash
# If API is running on a different host/port
API_URL=http://your-server:5000/api/v1 pnpm load-data
```

### Manual Step-by-Step

If you prefer, you can also:

1. **Get product data** from the CSV file
2. **Format it** as JSON
3. **Call the API** manually:

```bash
curl -X POST http://localhost:5000/api/v1/products/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {
        "product_id": "LAP001",
        "product_title": "AeroBook Pro 15",
        "category": "Electronics",
        "...": "..."
      }
    ]
  }'
```

---

## 📝 Data Structure

Each product loaded includes:

```json
{
  "product_id": "LAP001",
  "product_title": "AeroBook Pro 15",
  "category": "Electronics",
  "sub_category": "Laptop",
  "brand": "AeroTech",
  "Img_URL": null,
  "short_description": "High-performance gaming laptop",
  "long_description": "Powerful laptop designed for gaming...",
  "price": 74999,
  "currency": "INR",
  "discount_percentage": 10,
  "stock_quantity": 25,
  "rating": 4.3,
  "review_count": 120,
  "tags": ["gaming", "laptop", "RTX", "editing"],
  "reviews": [
    { "rating": 5, "comment": "Great gaming performance" },
    { "rating": 3, "comment": "Battery life is average" }
  ],
  "specifications": {
    "processor": "Intel i7 12th Gen",
    "ram": "16GB DDR4",
    "storage": "512GB SSD",
    "gpu": "RTX 3050 4GB",
    "display": "15.6 inch FHD 144Hz",
    "battery": "70Wh"
  },
  "variants": [
    { "color": "Black", "ram": "16GB" },
    { "color": "Silver", "ram": "16GB" }
  ],
  "ai_context_text": "AeroBook Pro 15 - Powerful laptop designed for gaming..."
}
```

---

## ✅ Verification

After loading, verify the data:

### Check via API

```bash
# Get all products
curl http://localhost:5000/api/v1/products?page=1&limit=20

# Search for a product
curl "http://localhost:5000/api/v1/products/search?q=laptop"

# Get specific product
curl http://localhost:5000/api/v1/products/by-id/LAP001
```

### Check in MongoDB

```bash
# Connect to MongoDB
mongosh localhost:27017/smartcart

# Check products
db.products.find().pretty()
db.products.countDocuments()
```

---

## 🐛 Troubleshooting

### Error: "CSV file not found"
```bash
# Make sure you're in the backend folder
cd backend
pnpm load-data
```

### Error: "API is not reachable"
```bash
# Start the backend in another terminal
pnpm dev

# Then run the loader in a different terminal
pnpm load-data
```

### Error: "Failed to parse..."
- Check that the CSV file is properly formatted
- Ensure JSON fields in CSV are properly escaped
- Check for encoding issues (should be UTF-8)

### Partial Data Loading
- The script processes in batches
- Check the console output for specific errors
- Failed items are reported but won't block other items

---

## 🔄 Reloading Data

### Clear all products first (optional)

```bash
# Using MongoDB directly
mongosh
db.products.deleteMany({})
db.reviews.deleteMany({})
db.variants.deleteMany({})
db.specifications.deleteMany({})
db.knowledge.deleteMany({})
db.aicontexttexts.deleteMany({})
```

Then reload:
```bash
pnpm load-data
```

---

## 📊 Performance

**Loading Statistics:**
- **Products**: 9 items
- **Reviews**: ~25 total
- **Variants**: ~20 total
- **Specifications**: 9 items
- **Processing time**: < 2 seconds (typical)

**Batch Processing:**
- Processes data in batches of 50 products
- Shows progress for each batch
- Reports errors without stopping

---

## 🎯 Next Steps

After loading data:

1. ✅ Test with API calls
2. ✅ Try searching and filtering
3. ✅ Test AI features (product analysis, comparison)
4. ✅ Check database with MongoDB Compass

---

## 📞 Need Help?

- Check **API_DOCUMENTATION.md** for API details
- Review **README_MVP.md** for project setup
- Check console output for detailed error messages

---

**Status**: ✅ Data Loading Ready
**Last Updated**: May 9, 2026

