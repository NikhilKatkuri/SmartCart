# SmartCart Frontend - Quick Start & Testing Guide

## 🚀 Running the Frontend

### Step 1: Ensure Backend is Running
Before starting the frontend, make sure the backend server is running on port 5000:

```bash
cd backend
pnpm dev
# Should see: "Express server listening on port 5000"
```

### Step 2: Start Frontend Development Server

```bash
cd frontend
pnpm install  # if not already done
pnpm dev
```

The frontend should now be accessible at: **http://localhost:3000**

## 📝 Testing Checklist

### ✅ Navigation & Layout
- [ ] Homepage loads successfully
- [ ] Navbar is sticky at top with logo and search
- [ ] Mobile menu toggle works on small screens
- [ ] Footer displays at bottom on all pages
- [ ] All navigation links work (Home, Products, About)

### ✅ Product Browsing
- [ ] Products load on homepage
- [ ] Product grid is responsive (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] Product cards show: image placeholder, title, price, discount, rating
- [ ] Hover effects work on product cards
- [ ] Pagination "Load More" button works

### ✅ Product Filtering (Homepage)
- [ ] Category filter works
- [ ] Price range filter works (min/max)
- [ ] Rating filter works
- [ ] Filters apply instantly
- [ ] Filter results update product count

### ✅ Product Search
- [ ] Type in navbar search box
- [ ] Press Enter or click search icon
- [ ] Redirects to /search?q=query
- [ ] Search results display
- [ ] Product count matches results

### ✅ Product Detail Page
- [ ] Click on product from grid
- [ ] URL is /product/[product_id]
- [ ] Full product info displays:
  - [ ] Product image (placeholder)
  - [ ] Title and brand
  - [ ] Full price, discounted price, savings
  - [ ] Rating and review count
  - [ ] Stock availability indicator
  - [ ] Specifications section
  - [ ] Customer reviews (first 5)
- [ ] "Add to Cart" button works
- [ ] "Save to Wishlist" button works
- [ ] "Compare" button takes to compare page
- [ ] "Ask AI" button opens sidebar

### ✅ AI Chat Sidebar (Product Page)
- [ ] Opens on "Ask AI" button click
- [ ] Shows product context
- [ ] Can type message and send
- [ ] Chat history displays
- [ ] Messages from AI appear with delay
- [ ] Session storage shows 1 hour expiry
- [ ] Sidebar closes on close button
- [ ] Session persists when closing/reopening (within 1 hour)

### ✅ Shopping Cart
- [ ] Click cart icon in navbar
- [ ] URL is /cart
- [ ] Added items display with details
- [ ] Quantity controls work (+ / -)
- [ ] Remove button deletes items
- [ ] Total price calculated correctly
- [ ] Discount savings shown
- [ ] Persist after refresh (localStorage)
- [ ] "Continue Shopping" clears cart
- [ ] Empty cart shows proper message

### ✅ Wishlist
- [ ] Click heart icon in navbar
- [ ] URL is /wishlist
- [ ] Saved items display in grid
- [ ] Items persist after refresh (localStorage)
- [ ] "Add to Cart" from wishlist works
- [ ] "Remove" from wishlist works
- [ ] "Clear Wishlist" removes all items
- [ ] Empty wishlist shows proper message

### ✅ Product Comparison
- [ ] Go to /compare route
- [ ] Search for products to compare
- [ ] Add up to 3 products
- [ ] Products display side-by-side
- [ ] Compare table shows:
  - [ ] Product names and brands
  - [ ] Prices with discounts
  - [ ] Ratings and review counts
  - [ ] Stock availability
  - [ ] All specifications
- [ ] Remove button removes products
- [ ] Add button disabled after 3 products
- [ ] Link from product detail page works

### ✅ About Page
- [ ] Navigation link works
- [ ] URL is /about
- [ ] Hero section displays
- [ ] Mission statement visible
- [ ] Features section shows benefits
- [ ] Contact information present
- [ ] Team section displays
- [ ] CTA button links back to home

### ✅ Responsive Design
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1024px+)
- [ ] All layouts adapt properly
- [ ] Mobile menu works on small screens
- [ ] Search bar appears/hides appropriately
- [ ] Grid layouts collapse to 1 column on mobile

### ✅ Icons & Styling
- [ ] Lucide React icons display correctly
- [ ] Colors match design (blue-600 primary)
- [ ] Hover effects smooth
- [ ] Transitions working
- [ ] No layout shifts or jumps
- [ ] Font rendering clean

### ✅ Storage & Persistence
- [ ] Cart persists after page refresh
- [ ] Wishlist persists after page refresh
- [ ] AI chat session persists for 1 hour
- [ ] AI session auto-clears after 1 hour
- [ ] Multiple products can have separate AI sessions

### ✅ Error Handling
- [ ] Search with empty query shows validation
- [ ] Invalid product ID shows error
- [ ] API failure shows friendly error message
- [ ] Loading states show during API calls
- [ ] Network errors handled gracefully

### ✅ Performance
- [ ] Pages load quickly
- [ ] No console errors
- [ ] No memory leaks (check DevTools)
- [ ] Smooth scrolling
- [ ] Animations at 60fps

## 🐛 Debugging Tips

### Check Console Errors
```
Open DevTools: F12 or Right-click → Inspect
Go to Console tab
Check for red errors
```

### Check API Calls
```
Go to Network tab
Look for API calls to http://localhost:5000/api/v1
Check response status and data
```

### Check Storage
```
Go to Application tab
Check localStorage for:
  - cart: {...}
  - wishlist: {...}
  - aiSessions: {...}
Check sessionStorage for AI chat data
```

### Common Issues

**Issue: Products not loading**
- Check if backend is running on port 5000
- Check Network tab for failed API calls
- Verify .env.local has correct NEXT_PUBLIC_API_URL

**Issue: Cart not persisting**
- Open DevTools → Application → localStorage
- Should see "cart" entry
- Try clearing localStorage and reload
- Check browser storage settings

**Issue: AI chat not working**
- Check if Ollama is running: `curl http://localhost:11434`
- Check backend logs for LLM errors
- Try restarting backend

**Issue: Styling looks broken**
- Check if Tailwind CSS compiled
- Try: `pnpm tailwindcss`
- Clear browser cache (Ctrl+Shift+Del)
- Restart dev server

## 📊 Test Scenarios

### Scenario 1: New User Shopping
1. Open homepage
2. Browse products
3. Filter by category and price
4. Search for specific product
5. Click on product detail
6. Ask AI about product
7. Add to cart
8. View cart
9. Proceed to checkout (placeholder)

### Scenario 2: Comparison Shopping
1. Find product A from search
2. Open product A detail
3. Click "Compare"
4. Search and add product B
5. Add product C
6. Compare specifications
7. Remove one product
8. Try adding 4th product (should be disabled)

### Scenario 3: Wishlist Management
1. Browse products
2. Add multiple items to wishlist
3. Click wishlist icon
4. Verify all items present
5. Remove one item
6. Add item to cart from wishlist
7. Verify cart updated
8. Refresh page (items should persist)

### Scenario 4: AI Chat Session
1. Open product detail
2. Click "Ask AI"
3. Type question about product
4. Send message
5. Receive AI response
6. Close sidebar
7. Reopen sidebar (session should persist)
8. Wait 1 hour (mock time in DevTools)
9. Session should expire and prompt refresh

## 🔧 Advanced Testing

### Testing with Production API
Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.example.com/api/v1
```

Then restart dev server.

### Testing with Mock Data
In `src/lib/api.ts`, add mock responses:
```typescript
if (process.env.NODE_ENV === 'test') {
  // Return mock data
}
```

### Performance Testing
```bash
# Build production bundle
pnpm build

# Run lighthouse audit
pnpm audit
```

## ✅ Final Checklist Before Deployment

- [ ] All tests pass
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Environment variables configured
- [ ] Backend verified running
- [ ] All pages responsive
- [ ] All features working
- [ ] Performance acceptable
- [ ] SEO meta tags added
- [ ] Analytics configured (if needed)

## 📞 Support Commands

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Reset dev server
pnpm dev

# Check TypeScript errors
pnpm tsc --noEmit

# Run ESLint
pnpm eslint .

# Check Tailwind compilation
pnpm tailwindcss --input ./src/app/globals.css --output ./dist/output.css
```

## 🚀 Deployment Checklist

Before deploying to production:

1. **Environment Setup**
   - Set NEXT_PUBLIC_API_URL to production API
   - Enable any production services

2. **Build Verification**
   ```bash
   pnpm build
   pnpm start  # Test production build
   ```

3. **Testing**
   - Run full test suite
   - Test on production API
   - Verify all features work

4. **Security**
   - Remove debug logs
   - Enable HTTPS
   - Configure CORS (backend)
   - Secure sensitive data

5. **Performance**
   - Optimize images
   - Enable compression
   - Set cache headers
   - Monitor Core Web Vitals

6. **Monitoring**
   - Set up error tracking (Sentry)
   - Set up analytics
   - Monitor API performance
   - Set up alerts

---

**Status**: Frontend MVP Complete ✅
**All Pages Implemented**: 7 pages
**Components Implemented**: 4 major components
**Features Implemented**: 8 core features
**Ready for Testing**: Yes ✅
