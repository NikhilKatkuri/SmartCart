# END POINTS

1. **GET** 
      endpoint: `/health`
      Response: 
      ```JSON
      {
        "status": "ok"
      }
      
2. **GET** 
      endpoint: `/api/v1/products`
      Response: 
      ```JSON
      {
      "message": "Products fetched successfully",
      "data": [
        {
          "_id": "69ff55c3a049561856255d13",
          "product_id": "BOOK010",
          "category": "Books",
          "sub_category": "Romance",
          "brand": "LoveStory Press",
          "product_title": "Hearts Entwined",
          "Img_URL": null,
          "short_description": "Contemporary romance novel",
          "long_description": "Heartwarming love story set in modern times with relatable     characters.",
          "price": 379,
          "currency": "INR",
          "discount_percentage": 22,
          "stock_quantity": 95,
          "rating": 4.2,
          "review_count": 212,
          "tags": [
            "romance",
            "love story",
            "contemporary",
            "fiction",
            "emotional"
          ],
          "createdAt": "2026-05-09T15:41:55.139Z",
          "updatedAt": "2026-05-09T15:41:55.139Z",
          "__v": 0
        }
      ],
      "pagination": {
          "page": 1,
          "limit": 10,
          "total": 50,
          "totalPages": 5
        }
        }


3. **GET**  - endpoint: `/api/v1/products/search?q=AeroBook Pro`
      Response: 
      ```JSON
            {
        "message": "Products found",
        "data": [
          {
            "_id":      "69ff55c2a049561856255993",
            "product_id": "LAP001",
            "category": "Electronics",
            "sub_category": "Laptop",
            "brand": "AeroTech",
            "product_title": "AeroBook Pro      15",
            "Img_URL": null,
            "short_description":    "High-performance gaming   laptop",
            "long_description": "Powerful       laptop designed for gaming,   editing and heavy multitasking  with dedicated GPU.",
            "price": 74999,
            "currency": "INR",
            "discount_percentage": 10,
            "stock_quantity": 25,
            "rating": 4.3,
            "review_count": 120,
            "tags": [
              "gaming",
              "laptop",
              "RTX",
              "editing"
            ],
            "createdAt":      "2026-05-09T15:41:54.083Z",
            "updatedAt":      "2026-05-09T15:41:54.083Z",
            "__v": 0
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 10,
          "total": 1,
          "totalPages": 1
        }
      }

4. **GET**  - endpoint: `/api/v1/products/69ff55c2a049561856255993`
      Response: 
      ```JSON 
      {
        "message": "Product fetched successfully",
        "product": {
          "_id": "69ff55c2a049561856255993",
          "product_id": "LAP001",
          "category": "Electronics",
          "sub_category": "Laptop",
          "brand": "AeroTech",
          "product_title": "AeroBook Pro 15",
          "Img_URL": null,
          "short_description": "High-performance gaming     laptop",
          "long_description": "Powerful laptop designed     for gaming, editing and heavy multitasking with     dedicated GPU.",
          "price": 74999,
          "currency": "INR",
          "discount_percentage": 10,
          "stock_quantity": 25,
          "rating": 4.3,
          "review_count": 120,
          "tags": [
            "gaming",
            "laptop",
            "RTX",
            "editing"
          ],
          "createdAt": "2026-05-09T15:41:54.083Z",
          "updatedAt": "2026-05-09T15:41:54.083Z",
          "__v": 0,
          "reviews": [
            {
              "_id": "69ff55c2a049561856255997",
              "product_id": "LAP001",
              "rating": 5,
              "comment": "Great gaming performance",
              "createdAt": "2026-05-09T15:41:54.153Z",
              "updatedAt": "2026-05-09T15:41:54.153Z",
              "__v": 0
            },
            {
              "_id": "69ff55c2a049561856255999",
              "product_id": "LAP001",
              "rating": 3,
              "comment": "Battery life is average",
              "createdAt": "2026-05-09T15:41:54.170Z",
              "updatedAt": "2026-05-09T15:41:54.170Z",
              "__v": 0
            }
          ],
          "specifications": {
            "processor": "Intel i7 12th Gen",
            "ram": "16GB DDR4",
            "storage": "512GB SSD",
            "gpu": "RTX 3050 4GB",
            "display": "15.6 inch FHD 144Hz",
            "battery": "70Wh"
          },
          "knowledgeBase": {
            "_id": "69ff55c2a049561856255995",
            "product_id": "LAP001",
            "short_description": "High-performance gaming   laptop",
            "long_description": "Powerful laptop designed   for gaming, editing and heavy multitasking  with dedicated GPU.",
            "rating": 4.3,
            "review_count": 120,
            "createdAt": "2026-05-09T15:41:54.128Z",
            "updatedAt": "2026-05-09T15:41:54.128Z",
            "__v": 0
          },
          "variants": [
            {
              "_id": "69ff55c2a04956185625599f",
              "product_id": "LAP001",
              "variant_name": "color",
              "variant_value": "Black",
              "createdAt": "2026-05-09T15:41:54.218Z",
              "updatedAt": "2026-05-09T15:41:54.218Z",
              "__v": 0
            },
            {
              "_id": "69ff55c2a0495618562559a1",
              "product_id": "LAP001",
              "variant_name": "ram",
              "variant_value": "16GB",
              "createdAt": "2026-05-09T15:41:54.240Z",
              "updatedAt": "2026-05-09T15:41:54.240Z",
              "__v": 0
            },
            {
              "_id": "69ff55c2a0495618562559a3",
              "product_id": "LAP001",
              "variant_name": "color",
              "variant_value": "Silver",
              "createdAt": "2026-05-09T15:41:54.246Z",
              "updatedAt": "2026-05-09T15:41:54.246Z",
              "__v": 0
            },
            {
              "_id": "69ff55c2a0495618562559a5",
              "product_id": "LAP001",
              "variant_name": "ram",
              "variant_value": "16GB",
              "createdAt": "2026-05-09T15:41:54.251Z",
              "updatedAt": "2026-05-09T15:41:54.251Z",
              "__v": 0
            }
          ]
        }
      }

5. **GET**  - endpoint: `/api/v1/products/by-id/69ff55c2a049561856255993`
      Response: 
      ```JSON 
      {
      "message": "Product fetched successfully",
      "product": {
      "_id": "69ff55c2a049561856255993",
      "product_id": "LAP001",
      "category": "Electronics",
      "sub_category": "Laptop",
      "brand": "AeroTech",
      "product_title": "AeroBook Pro 15",
      "Img_URL": null,
      "short_description": "High-performance gaming laptop",
      "long_description": "Powerful laptop designed for gaming, editing and heavy multitasking with dedicated GPU.",
      "price": 74999,
      "currency": "INR",
      "discount_percentage": 10,
      "stock_quantity": 25,
      "rating": 4.3,
      "review_count": 120,
      "tags": [
            "gaming",
            "laptop",
            "RTX",
            "editing"
      ],
      "createdAt": "2026-05-09T15:41:54.083Z",
      "updatedAt": "2026-05-09T15:41:54.083Z",
      "__v": 0,
      "reviews": [],
      "specifications": {},
      "knowledgeBase": null,
      "variants": []
      }
      }
