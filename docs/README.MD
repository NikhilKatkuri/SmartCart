| No  | Endpoint                                        | Method | Functionality                                                                                         |
| --- | ----------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| 1   | `/api/v1/products`                              | GET    | Retrieve all products. Supports optional filters (category, price range, rating).                     |
| 2   | `/api/v1/products/:productId`                   | GET    | Retrieve full details of a specific product including specifications and reviews.                     |
| 3   | `/api/v1/products/search?q=keyword`             | GET    | Search products based on name, category, or specifications.                                           |
| 4   | `/api/v1/products/compare?id1=ID1&id2=ID2`      | GET    | Compare two products of the same category and return structured comparison (specs, price, rating).    |
| 5   | `/api/v1/products/:productId/reviews`           | GET    | Retrieve all reviews of a specific product.                                                           |
| 6   | `/api/v1/products/:productId/reviews/summarize` | POST   | Generate AI-based summary of product reviews (positive, negative, overall sentiment).                 |
| 7   | `/api/v1/products/:productId/ask`               | POST   | Core AI endpoint. Accepts user question, runs RAG + LLM, returns grounded response about the product. |
| 8   | `/api/v1/products`                              | POST   | Create a new product (Admin use). Stores product data and generates embeddings for RAG.               |
| 9   | `/api/v1/products/:productId`                   | PUT    | Update product details. Re-generates embeddings if specifications or reviews change.                  |
| 10  | `/api/v1/products/:productId`                   | DELETE | Delete product and remove associated embeddings from vector store.                                    |
