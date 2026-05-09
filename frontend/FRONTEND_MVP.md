# SmartCart Frontend - E-Commerce MVP

Modern, responsive e-commerce frontend for SmartCart with AI-powered product analysis and comparison.

## 🎯 Features

### Core Features
- ✅ **Product Browsing** - Grid view with responsive layout
- ✅ **Advanced Filtering** - By category, price, rating
- ✅ **Product Search** - Full-text search across all products
- ✅ **Product Details** - Comprehensive product information with specifications, reviews
- ✅ **Shopping Cart** - Add/remove items, manage quantities (localStorage)
- ✅ **Wishlist** - Save products for later (localStorage)
- ✅ **Product Comparison** - Compare up to 3 products side-by-side
- ✅ **AI Chat Sidebar** - Ask questions about products (1-hour session storage)

### Design & UX
- 📱 **Fully Responsive** - Mobile, tablet, desktop optimized
- 🎨 **Modern UI** - Clean, minimal design with Tailwind CSS
- ⚡ **Performance** - Optimized with Next.js 16 and React 19
- 🎭 **Icons** - Lucide React icon library
- 💫 **Smooth Animations** - Transitions and hover effects

### Backend Integration
- 🔌 **API Client** - Built-in API utilities for backend calls
- 📦 **No Local Storage** - Products fetched from backend on demand
- 🤖 **LLM Integration** - ChatGPT-like AI assistant per product
- 💾 **Smart Storage** - Cart & Wishlist in localStorage, AI sessions in sessionStorage

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage with product grid & filters
│   │   ├── product/[id]/page.tsx  # Product detail page
│   │   ├── cart/page.tsx          # Shopping cart
│   │   ├── wishlist/page.tsx      # Saved products
│   │   ├── compare/page.tsx       # Product comparison
│   │   ├── search/page.tsx        # Search results
│   │   ├── layout.tsx             # Root layout with Navbar & Footer
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation bar with search
│   │   ├── ProductCard.tsx        # Individual product card
│   │   ├── ProductGrid.tsx        # Grid layout for products
│   │   └── AIChatSidebar.tsx      # AI chat sidebar
│   ├── lib/
│   │   ├── api.ts                 # API client functions
│   │   └── storage.ts             # localStorage & sessionStorage utilities
│   ├── hooks/
│   │   └── useCart.ts             # Cart & Wishlist hooks
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── .env.local                     # Environment configuration
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (uses Nodejs 24 in this project)
- Backend running on `http://localhost:5000/api/v1`

### Installation

```bash
cd frontend
pnpm install
```

### Running Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## 🔧 Configuration

### Environment Variables (.env.local)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Optional: Production URL
# NEXT_PUBLIC_API_URL=https://api.smartcart.com/api/v1
```

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with product listing & filters |
| `/product/[id]` | Product detail page with AI chat |
| `/cart` | Shopping cart management |
| `/wishlist` | Saved products |
| `/compare` | Compare up to 3 products |
| `/search?q=query` | Search results |

## 🎨 UI Components

### Navbar
- Logo on left
- Centered search bar
- Navigation links (Home, Products, About)
- Cart & Wishlist icons with item counts
- Mobile-responsive menu

### ProductCard
- Product image placeholder
- Title and description
- Rating with star display
- Price with discount badge
- Add to cart button
- Add to wishlist button
- Stock status indicator

### ProductGrid
- Responsive grid (1-4 columns)
- Loading skeleton
- Load more pagination
- Empty state message

### AIChatSidebar
- Slide-in sidebar
- Message history
- Session expiry indicator (1 hour)
- Typing indicator
- Send button with loading state

### CompareTable
- Side-by-side product comparison
- Price comparison
- Rating comparison
- Specification comparison
- Quick product removal

## 💾 Storage Management

### localStorage
```js
// Cart
cartStorage.getCart()
cartStorage.addToCart(productId, quantity)
cartStorage.removeFromCart(productId)
cartStorage.updateQuantity(productId, quantity)

// Wishlist
wishlistStorage.getWishlist()
wishlistStorage.addToWishlist(productId)
wishlistStorage.removeFromWishlist(productId)
wishlistStorage.isInWishlist(productId)
```

### sessionStorage
```js
// AI Chat Session (1 hour expiry)
aiSessionStorage.getSession(productId)
aiSessionStorage.createSession(productId)
aiSessionStorage.addMessage(productId, message)
aiSessionStorage.isSessionValid(productId)
```

## 🤖 API Integration

### Product APIs
```js
// Get all products with pagination & filters
productAPI.getAllProducts({
  page: 1,
  limit: 20,
  category: "Electronics",
  minPrice: 1000,
  maxPrice: 50000,
  minRating: 4
})

// Get product by ID
productAPI.getProductById(productId)

// Search products
productAPI.searchProducts("laptop", limit)
```

### LLM/AI APIs
```js
// Check LLM service health
llmAPI.checkHealth()

// Analyze single product
llmAPI.analyzeProduct(productId, query)

// Compare products
llmAPI.compareProducts(productIds, aspects)

// Chat with AI about product
llmAPI.chatbotAnalysis(productId, conversation)
```

## 🎯 Key Features Explained

### 1. Product Filtering
- Category filter (text input)
- Price range filter (min/max)
- Rating filter (select)
- Responsive filters (sidebar on desktop, collapsible on mobile)

### 2. Shopping Cart
- Add items with quantity
- Update quantities inline
- Remove items
- Calculate total with discounts
- Persist across sessions (localStorage)

### 3. Wishlist
- Save products for later
- Quick view wishlist
- Move to cart in one click
- Persist across sessions (localStorage)

### 4. AI Chat Sidebar
- Opens when clicking "Ask AI" button
- Maintains 1-hour session per product
- Session stored in sessionStorage
- Auto-expires and prompts refresh
- Shows chat history
- Typing indicators

### 5. Product Comparison
- Compare up to 3 products
- Side-by-side specifications
- Price comparison with savings
- Rating & review count comparison
- Stock availability
- Quick search to add products

## 🎨 Design System

### Colors
- Primary: `blue-600` (#2563eb)
- Secondary: `gray-700` (#374151)
- Success: `green-600` (#16a34a)
- Warning: `red-600` (#dc2626)
- Background: `gray-50` (#f9fafb)

### Typography
- Font: Geist (system font)
- Sizes: 12px to 48px scale
- Font weights: Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing
- 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px (Tailwind scale)

### Border Radius
- Small: 6px (rounded-lg)
- Medium: 8px (rounded-lg)
- Large: 12px (rounded-xl)

## 📊 Performance Optimizations

1. **Image Optimization** - Next.js Image component (if images enabled)
2. **Code Splitting** - Automatic with Next.js
3. **API Caching** - Fetch data on-demand, cache in React state
4. **Lazy Loading** - Products load on scroll with pagination
5. **Responsive Images** - Tailwind responsive classes

## 🔒 Security

- No authentication required (MVP)
- No payment processing (MVP)
- Environment variables for API URL
- CORS handled by backend
- Input sanitization on forms

## 🐛 Common Issues & Solutions

### Issue: API Not Responding
```
Solution: Ensure backend is running on http://localhost:5000
Check .env.local NEXT_PUBLIC_API_URL is correct
```

### Issue: LocalStorage Not Working
```
Solution: Check browser console for storage errors
Clear browser cache and try again
Ensure localStorage is not disabled
```

### Issue: AI Chat Not Appearing
```
Solution: Check backend LLM service is running
Ensure Ollama is configured correctly
Check sessionStorage in browser DevTools
```

## 📚 Dependencies

- **next** (16.1.6) - React framework
- **react** (19.2.3) - UI library
- **tailwindcss** (4) - CSS utility framework
- **lucide-react** (1.14.0) - Icon library
- **axios** (1.13.6) - HTTP client

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub, connect Vercel
# Set NEXT_PUBLIC_API_URL in environment variables
# Deploy automatically
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Manual
```bash
pnpm build
pnpm start  # Production server runs on port 3000
```

## 📝 Environment Setup

For development:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

For production:
```env
NEXT_PUBLIC_API_URL=https://api.example.com/api/v1
```

## 🤝 Contributing

1. Create a branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - feel free to use for any purpose

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check browser console for errors
4. Review backend logs

---

**Status**: ✅ MVP Complete
**Last Updated**: May 9, 2026
**Version**: 1.0.0
