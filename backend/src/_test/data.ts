// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Utility Types
type Attributes = Record<string, string>;

// Product Variant Types
export interface ProductVariant {
  product_id: string;
  attributes: Attributes;
}

export interface ProductReview {
  rating: number;
  comment: string;
}

export interface ProductReviews {
  product_id: string;
  reviews: ProductReview[];
}

export interface ProductAiContext {
  product_id: string;
  ai_context_text: string;
}

// Main Product Types
export interface Product {
  product_id: string;
  category: string;
  sub_category: string;
  brand: string;
  product_title: string;
  image_url: string[] | null;
  short_description: string;
  long_description: string;
  price: number;
  currency: 'INR' | string;
  discount_percentage: number;
  stock_quantity: number;
  rating: number;
  review_count: number;
  specifications: Attributes;
  tags: string[];
}

// Internal Data Type
export type ProductData = {
  product_id: string;
  category: string;
  sub_category: string;
  brand: string;
  product_title: string;
  Img_URL: null;
  short_description: string;
  long_description: string;
  price: number;
  currency: string;
  discount_percentage: number;
  stock_quantity: number;
  rating: number;
  review_count: number;
  ai_context_text: string;
  specifications: Attributes;
  tags: string[];
  reviews: ProductReview[];
  variants: Attributes[];
};

// ============================================================================
// PRODUCT DATA
// ============================================================================

const datas: ProductData[] = [
  {
    product_id: 'LAP001',
    category: 'Electronics',
    sub_category: 'Laptop',
    brand: 'AeroTech',
    product_title: 'AeroBook Pro 15',
    Img_URL: null,
    short_description: 'High-performance gaming laptop',
    long_description:
      'Powerful laptop designed for gaming, editing and heavy multitasking with dedicated GPU.',
    price: 74999,
    currency: 'INR',
    discount_percentage: 10,
    stock_quantity: 25,
    rating: 4.3,
    review_count: 120,
    variants: [
      { color: 'Black', ram: '16GB' },
      { color: 'Silver', ram: '16GB' },
    ],
    specifications: {
      processor: 'Intel i7 12th Gen',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      gpu: 'RTX 3050 4GB',
      display: '15.6 inch FHD 144Hz',
      battery: '70Wh',
    },
    tags: ['gaming', 'laptop', 'RTX', 'editing'],
    reviews: [
      { rating: 5, comment: 'Great gaming performance' },
      { rating: 3, comment: 'Battery life is average' },
    ],
    ai_context_text:
      'AeroBook Pro 15 by AeroTech is a gaming laptop priced at 74999 INR. It features Intel i7 12th Gen processor, 16GB RAM, RTX 3050 GPU and 512GB SSD. Rated 4.3 from 120 reviews. Users praise performance but mention moderate battery life.',
  },
  {
    product_id: 'PHN001',
    category: 'Electronics',
    sub_category: 'Smartphone',
    brand: 'NovaTech',
    product_title: 'Nova X5 Pro',
    Img_URL: null,
    short_description: 'Flagship smartphone with AMOLED display',
    long_description:
      'Premium smartphone offering high refresh rate display, strong processor and advanced camera setup.',
    price: 28999,
    currency: 'INR',
    discount_percentage: 8,
    stock_quantity: 50,
    rating: 4.4,
    review_count: 210,
    variants: [
      { color: 'Black', storage: '128GB' },
      { color: 'Silver', storage: '256GB' },
    ],
    specifications: {
      processor: 'Snapdragon 8 Gen 1',
      ram: '8GB',
      storage: '128GB',
      camera: '108MP + 12MP',
      battery: '5000mAh',
      display: '6.7 inch AMOLED 120Hz',
    },
    tags: ['smartphone', 'amoled', 'gaming', 'camera'],
    reviews: [
      { rating: 5, comment: 'Camera quality is excellent' },
      { rating: 4, comment: 'Battery lasts full day' },
    ],
    ai_context_text:
      'Nova X5 Pro by NovaTech is priced at 28999 INR. It comes with Snapdragon 8 Gen 1 processor, 8GB RAM, 108MP camera and 5000mAh battery. Rated 4.4 from 210 reviews. Users appreciate camera and display performance.',
  },
  {
    product_id: 'PHN002',
    category: 'Electronics',
    sub_category: 'Smartphone',
    brand: 'TechMax',
    product_title: 'MaxPhone 12 Ultra',
    Img_URL: null,
    short_description: 'Budget-friendly smartphone with dual camera',
    long_description:
      'Affordable smartphone with excellent battery life and reliable performance for everyday tasks.',
    price: 14999,
    currency: 'INR',
    discount_percentage: 12,
    stock_quantity: 80,
    rating: 4,
    review_count: 145,
    variants: [
      { color: 'Blue', storage: '64GB' },
      { color: 'Black', storage: '128GB' },
    ],
    specifications: {
      processor: 'MediaTek Helio G88',
      ram: '6GB',
      storage: '64GB',
      camera: '50MP + 8MP',
      battery: '6000mAh',
      display: '6.5 inch IPS LCD',
    },
    tags: ['budget', 'smartphone', 'long battery', 'everyday use'],
    reviews: [
      { rating: 4, comment: 'Great value for money' },
      { rating: 4, comment: 'Battery lasts 2 days' },
    ],
    ai_context_text:
      'MaxPhone 12 Ultra by TechMax is an affordable smartphone at 14999 INR. Features MediaTek Helio G88, 6GB RAM, 50MP camera and massive 6000mAh battery. Rated 4.0 from 145 reviews. Customers praise battery life and value.',
  },
  {
    product_id: 'TAB001',
    category: 'Electronics',
    sub_category: 'Tablet',
    brand: 'AeroTech',
    product_title: 'AeroPad Ultra 11',
    Img_URL: null,
    short_description: 'Premium tablet for productivity and entertainment',
    long_description:
      'Large screen tablet perfect for work, streaming and creative tasks with stylus support.',
    price: 45999,
    currency: 'INR',
    discount_percentage: 5,
    stock_quantity: 30,
    rating: 4.5,
    review_count: 89,
    variants: [
      { color: 'Space Gray', storage: '128GB' },
      { color: 'Silver', storage: '256GB' },
    ],
    specifications: {
      processor: 'Snapdragon 870',
      ram: '8GB',
      storage: '128GB',
      display: '11 inch 2K LCD',
      battery: '8000mAh',
      stylus: 'Supported',
    },
    tags: ['tablet', 'productivity', 'stylus', 'entertainment'],
    reviews: [
      { rating: 5, comment: 'Perfect for note-taking' },
      { rating: 4, comment: 'Great for watching movies' },
    ],
    ai_context_text:
      'AeroPad Ultra 11 by AeroTech is a premium tablet priced at 45999 INR. Features Snapdragon 870, 8GB RAM, 11-inch 2K display and stylus support. Rated 4.5 from 89 reviews. Users love it for productivity and media consumption.',
  },
  {
    product_id: 'HEAD001',
    category: 'Electronics',
    sub_category: 'Headphones',
    brand: 'SoundWave',
    product_title: 'WavePro Noise Cancelling',
    Img_URL: null,
    short_description: 'Wireless over-ear headphones with ANC',
    long_description:
      'Premium wireless headphones with active noise cancellation and superior sound quality.',
    price: 8999,
    currency: 'INR',
    discount_percentage: 20,
    stock_quantity: 60,
    rating: 4.6,
    review_count: 234,
    variants: [{ color: 'Black' }, { color: 'Silver' }],
    specifications: {
      type: 'Over-Ear',
      connectivity: 'Bluetooth 5.2',
      battery: '30 hours',
      anc: 'Active',
      drivers: '40mm',
    },
    tags: ['headphones', 'wireless', 'ANC', 'premium audio'],
    reviews: [
      { rating: 5, comment: 'Noise cancellation is amazing' },
      { rating: 4, comment: 'Very comfortable for long use' },
    ],
    ai_context_text:
      'WavePro Noise Cancelling by SoundWave is priced at 8999 INR. Features Bluetooth 5.2, active noise cancellation and 30-hour battery. Rated 4.6 from 234 reviews. Praised for excellent ANC and comfort.',
  },
  {
    product_id: 'HEAD002',
    category: 'Electronics',
    sub_category: 'Earbuds',
    brand: 'SoundWave',
    product_title: 'BudsPro TWS Earbuds',
    Img_URL: null,
    short_description: 'True wireless earbuds with charging case',
    long_description:
      'Compact TWS earbuds with great sound quality and touch controls.',
    price: 2999,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 120,
    rating: 4.2,
    review_count: 312,
    variants: [{ color: 'White' }, { color: 'Black' }],
    specifications: {
      type: 'In-Ear',
      connectivity: 'Bluetooth 5.0',
      battery: '24 hours with case',
      water_resistance: 'IPX4',
      touch_controls: 'Yes',
    },
    tags: ['earbuds', 'TWS', 'wireless', 'portable'],
    reviews: [
      { rating: 4, comment: 'Good sound quality' },
      { rating: 4, comment: 'Comfortable fit' },
    ],
    ai_context_text:
      'BudsPro TWS Earbuds by SoundWave priced at 2999 INR. Offers Bluetooth 5.0, 24-hour battery with case and IPX4 water resistance. Rated 4.2 from 312 reviews. Users appreciate sound quality and fit.',
  },
  {
    product_id: 'CAM001',
    category: 'Electronics',
    sub_category: 'Camera',
    brand: 'PixelPro',
    product_title: 'ProShot DSLR 5000',
    Img_URL: null,
    short_description: 'Professional DSLR camera with 24MP sensor',
    long_description:
      'High-quality DSLR camera perfect for photography enthusiasts and professionals.',
    price: 52999,
    currency: 'INR',
    discount_percentage: 8,
    stock_quantity: 15,
    rating: 4.7,
    review_count: 67,
    variants: [{ type: 'Body Only' }, { type: 'With 18-55mm Lens' }],
    specifications: {
      sensor: '24MP APS-C CMOS',
      iso: '100-25600',
      video: '4K 30fps',
      viewfinder: 'Optical',
      screen: '3 inch Touchscreen',
    },
    tags: ['camera', 'DSLR', 'photography', 'professional'],
    reviews: [
      { rating: 5, comment: 'Outstanding image quality' },
      { rating: 4, comment: 'Great for beginners' },
    ],
    ai_context_text:
      'ProShot DSLR 5000 by PixelPro is priced at 52999 INR. Features 24MP APS-C sensor, 4K video and optical viewfinder. Rated 4.7 from 67 reviews. Highly regarded for image quality.',
  },
  {
    product_id: 'WATCH001',
    category: 'Electronics',
    sub_category: 'Smartwatch',
    brand: 'FitTech',
    product_title: 'FitWatch Pro 3',
    Img_URL: null,
    short_description: 'Advanced smartwatch with health tracking',
    long_description:
      'Feature-rich smartwatch with heart rate monitoring, GPS and fitness tracking.',
    price: 12999,
    currency: 'INR',
    discount_percentage: 10,
    stock_quantity: 45,
    rating: 4.3,
    review_count: 178,
    variants: [
      { color: 'Black', size: '42mm' },
      { color: 'Silver', size: '46mm' },
    ],
    specifications: {
      display: '1.4 inch AMOLED',
      battery: '7 days',
      sensors: 'Heart Rate, SpO2, GPS',
      water_resistance: '5ATM',
      os: 'Wear OS',
    },
    tags: ['smartwatch', 'fitness', 'health tracking', 'GPS'],
    reviews: [
      { rating: 4, comment: 'Accurate fitness tracking' },
      { rating: 5, comment: 'Battery life is excellent' },
    ],
    ai_context_text:
      'FitWatch Pro 3 by FitTech priced at 12999 INR. Features 1.4-inch AMOLED display, 7-day battery, heart rate and SpO2 sensors. Rated 4.3 from 178 reviews. Users love fitness tracking accuracy.',
  },
  {
    product_id: 'LAP002',
    category: 'Electronics',
    sub_category: 'Laptop',
    brand: 'TechMax',
    product_title: 'MaxBook Air 14',
    Img_URL: null,
    short_description: 'Lightweight ultrabook for students',
    long_description:
      'Portable and efficient laptop perfect for students and professionals on the go.',
    price: 42999,
    currency: 'INR',
    discount_percentage: 12,
    stock_quantity: 35,
    rating: 4.1,
    review_count: 95,
    variants: [
      { color: 'Silver', ram: '8GB' },
      { color: 'Gold', ram: '16GB' },
    ],
    specifications: {
      processor: 'Intel i5 11th Gen',
      ram: '8GB DDR4',
      storage: '512GB SSD',
      display: '14 inch FHD',
      battery: '50Wh',
      weight: '1.3kg',
    },
    tags: ['laptop', 'ultrabook', 'lightweight', 'student'],
    reviews: [
      { rating: 4, comment: 'Very portable' },
      { rating: 4, comment: 'Good for office work' },
    ],
    ai_context_text:
      'MaxBook Air 14 by TechMax priced at 42999 INR. Features Intel i5 11th Gen, 8GB RAM, 512GB SSD and weighs only 1.3kg. Rated 4.1 from 95 reviews. Appreciated for portability.',
  },
  {
    product_id: 'TV001',
    category: 'Electronics',
    sub_category: 'Television',
    brand: 'VisionTech',
    product_title: 'UltraView 55 4K Smart TV',
    Img_URL: null,
    short_description: '55-inch 4K UHD Smart TV',
    long_description:
      'Stunning 4K display with HDR support and built-in streaming apps.',
    price: 38999,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 20,
    rating: 4.4,
    review_count: 156,
    variants: [{ size: '55 inch' }, { size: '65 inch' }],
    specifications: {
      resolution: '4K UHD',
      hdr: 'HDR10',
      smart: 'Android TV',
      sound: '20W Dolby Audio',
      ports: '3 HDMI, 2 USB',
    },
    tags: ['TV', '4K', 'smart TV', 'HDR', 'streaming'],
    reviews: [
      { rating: 5, comment: 'Picture quality is superb' },
      { rating: 4, comment: 'Great for movies' },
    ],
    ai_context_text:
      'UltraView 55 4K Smart TV by VisionTech priced at 38999 INR. Features 4K UHD resolution, HDR10, Android TV and Dolby Audio. Rated 4.4 from 156 reviews. Praised for picture quality.',
  },
  {
    product_id: 'SPEAK001',
    category: 'Electronics',
    sub_category: 'Speaker',
    brand: 'SoundWave',
    product_title: 'BoomBox Bluetooth Speaker',
    Img_URL: null,
    short_description: 'Portable wireless speaker with deep bass',
    long_description:
      'Powerful Bluetooth speaker with 360-degree sound and waterproof design.',
    price: 3999,
    currency: 'INR',
    discount_percentage: 18,
    stock_quantity: 70,
    rating: 4.3,
    review_count: 203,
    variants: [{ color: 'Black' }, { color: 'Blue' }],
    specifications: {
      connectivity: 'Bluetooth 5.0',
      battery: '12 hours',
      water_resistance: 'IPX7',
      output: '20W',
      bass: 'Enhanced',
    },
    tags: ['speaker', 'Bluetooth', 'portable', 'waterproof', 'bass'],
    reviews: [
      { rating: 4, comment: 'Amazing bass' },
      { rating: 5, comment: 'Very loud and clear' },
    ],
    ai_context_text:
      'BoomBox Bluetooth Speaker by SoundWave priced at 3999 INR. Features Bluetooth 5.0, 12-hour battery, IPX7 waterproof and 20W output. Rated 4.3 from 203 reviews. Users love bass quality.',
  },
  {
    product_id: 'MON001',
    category: 'Electronics',
    sub_category: 'Monitor',
    brand: 'ViewMax',
    product_title: 'ProDisplay 27 QHD',
    Img_URL: null,
    short_description: '27-inch QHD monitor for professionals',
    long_description:
      'High-resolution monitor with color accuracy perfect for designers and content creators.',
    price: 24999,
    currency: 'INR',
    discount_percentage: 10,
    stock_quantity: 25,
    rating: 4.5,
    review_count: 82,
    variants: [{ size: '27 inch' }, { size: '32 inch' }],
    specifications: {
      resolution: '2560x1440 QHD',
      refresh_rate: '75Hz',
      panel: 'IPS',
      color: '99% sRGB',
      ports: 'HDMI, DisplayPort, USB-C',
    },
    tags: ['monitor', 'QHD', 'professional', 'color accurate', 'IPS'],
    reviews: [
      { rating: 5, comment: 'Perfect for photo editing' },
      { rating: 4, comment: 'Great color accuracy' },
    ],
    ai_context_text:
      'ProDisplay 27 QHD by ViewMax priced at 24999 INR. Features 2560x1440 resolution, 75Hz refresh rate, IPS panel and 99% sRGB coverage. Rated 4.5 from 82 reviews. Excellent for creative work.',
  },
  {
    product_id: 'KEYB001',
    category: 'Electronics',
    sub_category: 'Keyboard',
    brand: 'TypeMaster',
    product_title: 'MechPro RGB Keyboard',
    Img_URL: null,
    short_description: 'Mechanical gaming keyboard with RGB',
    long_description:
      'Premium mechanical keyboard with customizable RGB lighting and tactile switches.',
    price: 4999,
    currency: 'INR',
    discount_percentage: 20,
    stock_quantity: 55,
    rating: 4.4,
    review_count: 127,
    variants: [{ switch: 'Blue' }, { switch: 'Red' }],
    specifications: {
      type: 'Mechanical',
      switches: 'Cherry MX',
      backlight: 'RGB',
      connection: 'Wired USB',
      keys: '104 keys',
    },
    tags: ['keyboard', 'mechanical', 'gaming', 'RGB', 'tactile'],
    reviews: [
      { rating: 5, comment: 'Typing feels amazing' },
      { rating: 4, comment: 'RGB looks great' },
    ],
    ai_context_text:
      'MechPro RGB Keyboard by TypeMaster priced at 4999 INR. Features Cherry MX switches, RGB backlighting and wired USB connection. Rated 4.4 from 127 reviews. Great tactile feedback.',
  },
  {
    product_id: 'MOUSE001',
    category: 'Electronics',
    sub_category: 'Mouse',
    brand: 'TypeMaster',
    product_title: 'GameX Pro Gaming Mouse',
    Img_URL: null,
    short_description: 'High-precision wireless gaming mouse',
    long_description:
      'Professional gaming mouse with adjustable DPI and programmable buttons.',
    price: 2499,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 85,
    rating: 4.2,
    review_count: 164,
    variants: [{ color: 'Black' }, { color: 'White' }],
    specifications: {
      type: 'Wireless',
      dpi: '16000',
      buttons: '8 programmable',
      battery: '70 hours',
      rgb: 'Yes',
    },
    tags: ['mouse', 'gaming', 'wireless', 'high DPI', 'RGB'],
    reviews: [
      { rating: 4, comment: 'Very responsive' },
      { rating: 4, comment: 'Comfortable grip' },
    ],
    ai_context_text:
      'GameX Pro Gaming Mouse by TypeMaster priced at 2499 INR. Features 16000 DPI, 8 programmable buttons, 70-hour battery and RGB lighting. Rated 4.2 from 164 reviews. Praised for precision.',
  },
  {
    product_id: 'POW001',
    category: 'Electronics',
    sub_category: 'Power Bank',
    brand: 'ChargePlus',
    product_title: 'PowerMax 20000mAh',
    Img_URL: null,
    short_description: 'High-capacity portable charger',
    long_description:
      'Fast-charging power bank with multiple ports for all your devices.',
    price: 1999,
    currency: 'INR',
    discount_percentage: 25,
    stock_quantity: 100,
    rating: 4.1,
    review_count: 289,
    variants: [{ color: 'Black' }, { color: 'Blue' }],
    specifications: {
      capacity: '20000mAh',
      ports: '2 USB-A, 1 USB-C',
      fast_charging: 'Yes',
      output: '18W',
      input: 'USB-C',
    },
    tags: ['power bank', 'portable charger', 'fast charging', 'high capacity'],
    reviews: [
      { rating: 4, comment: 'Charges my phone 4 times' },
      { rating: 4, comment: 'Compact and portable' },
    ],
    ai_context_text:
      'PowerMax 20000mAh by ChargePlus priced at 1999 INR. Features 20000mAh capacity, fast charging, multiple ports with 18W output. Rated 4.1 from 289 reviews. Great value for capacity.',
  },
  {
    product_id: 'CLO001',
    category: 'Clothing',
    sub_category: 'T-Shirt',
    brand: 'UrbanWear',
    product_title: 'Slim Fit Cotton T-Shirt',
    Img_URL: null,
    short_description: 'Comfortable everyday cotton t-shirt',
    long_description:
      '100% cotton breathable slim fit t-shirt ideal for daily wear and casual outings.',
    price: 999,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 100,
    rating: 4.1,
    review_count: 58,
    variants: [
      { color: 'Black', size: 'M' },
      { color: 'Blue', size: 'L' },
    ],
    specifications: {
      material: 'Cotton',
      fit: 'Slim',
      pattern: 'Solid',
      sleeve: 'Half Sleeve',
      care: 'Machine Wash',
    },
    tags: ['casual', 'cotton', 'summer', 'slim fit'],
    reviews: [
      { rating: 4, comment: 'Comfortable fabric' },
      { rating: 2, comment: 'Size runs slightly small' },
    ],
    ai_context_text:
      'Slim Fit Cotton T-Shirt by UrbanWear is priced at 999 INR. Made from cotton with slim fit design and solid pattern. Rated 4.1 from 58 reviews. Customers like comfort but mention sizing concerns.',
  },
  {
    product_id: 'CLO002',
    category: 'Clothing',
    sub_category: 'Jeans',
    brand: 'DenimCraft',
    product_title: 'Classic Blue Slim Fit Jeans',
    Img_URL: null,
    short_description: 'Stylish slim fit denim jeans',
    long_description:
      'Premium quality denim jeans with comfortable stretch and modern slim fit.',
    price: 2499,
    currency: 'INR',
    discount_percentage: 20,
    stock_quantity: 75,
    rating: 4.3,
    review_count: 142,
    variants: [
      { color: 'Light Blue', size: '32' },
      { color: 'Dark Blue', size: '34' },
    ],
    specifications: {
      material: 'Denim',
      fit: 'Slim',
      wash: 'Stone Washed',
      closure: 'Button Fly',
      stretch: 'Yes',
    },
    tags: ['jeans', 'denim', 'slim fit', 'casual', 'stretch'],
    reviews: [
      { rating: 5, comment: 'Perfect fit and comfort' },
      { rating: 4, comment: 'Good quality denim' },
    ],
    ai_context_text:
      'Classic Blue Slim Fit Jeans by DenimCraft priced at 2499 INR. Features premium denim with stretch, stone washed finish. Rated 4.3 from 142 reviews. Customers praise fit and comfort.',
  },
  {
    product_id: 'CLO003',
    category: 'Clothing',
    sub_category: 'Jacket',
    brand: 'OutdoorPro',
    product_title: 'Winter Puffer Jacket',
    Img_URL: null,
    short_description: 'Warm insulated jacket for winter',
    long_description:
      'Water-resistant puffer jacket with thermal insulation perfect for cold weather.',
    price: 3999,
    currency: 'INR',
    discount_percentage: 18,
    stock_quantity: 40,
    rating: 4.5,
    review_count: 98,
    variants: [
      { color: 'Black', size: 'L' },
      { color: 'Navy', size: 'XL' },
    ],
    specifications: {
      material: 'Polyester',
      insulation: 'Synthetic',
      water_resistant: 'Yes',
      pockets: '4',
      hood: 'Detachable',
    },
    tags: ['jacket', 'winter', 'puffer', 'warm', 'water resistant'],
    reviews: [
      { rating: 5, comment: 'Very warm and comfortable' },
      { rating: 4, comment: 'Great for cold weather' },
    ],
    ai_context_text:
      'Winter Puffer Jacket by OutdoorPro priced at 3999 INR. Features synthetic insulation, water resistance and detachable hood. Rated 4.5 from 98 reviews. Excellent warmth for winter.',
  },
  {
    product_id: 'CLO004',
    category: 'Clothing',
    sub_category: 'Shirt',
    brand: 'FormalFit',
    product_title: 'Formal White Dress Shirt',
    Img_URL: null,
    short_description: 'Classic white formal shirt',
    long_description:
      'Premium cotton formal shirt perfect for office and formal occasions.',
    price: 1799,
    currency: 'INR',
    discount_percentage: 12,
    stock_quantity: 90,
    rating: 4.2,
    review_count: 123,
    variants: [
      { color: 'White', size: '40' },
      { color: 'Light Blue', size: '42' },
    ],
    specifications: {
      material: 'Cotton',
      fit: 'Regular',
      collar: 'Spread',
      cuff: 'Button',
      pattern: 'Solid',
    },
    tags: ['shirt', 'formal', 'office', 'cotton', 'classic'],
    reviews: [
      { rating: 4, comment: 'Good quality fabric' },
      { rating: 4, comment: 'Perfect for office' },
    ],
    ai_context_text:
      'Formal White Dress Shirt by FormalFit priced at 1799 INR. Made from premium cotton with spread collar and regular fit. Rated 4.2 from 123 reviews. Great for formal wear.',
  },
  {
    product_id: 'CLO005',
    category: 'Clothing',
    sub_category: 'Dress',
    brand: 'ChicStyle',
    product_title: 'Floral Maxi Dress',
    Img_URL: null,
    short_description: 'Elegant floral print maxi dress',
    long_description:
      'Beautiful flowing maxi dress with vibrant floral print perfect for summer.',
    price: 2999,
    currency: 'INR',
    discount_percentage: 22,
    stock_quantity: 55,
    rating: 4.4,
    review_count: 87,
    variants: [
      { color: 'Floral Print', size: 'S' },
      { color: 'Floral Print', size: 'M' },
    ],
    specifications: {
      material: 'Rayon',
      length: 'Maxi',
      pattern: 'Floral',
      fit: 'A-Line',
      sleeve: 'Sleeveless',
    },
    tags: ['dress', 'maxi', 'floral', 'summer', 'elegant'],
    reviews: [
      { rating: 5, comment: 'Beautiful dress' },
      { rating: 4, comment: 'Comfortable and stylish' },
    ],
    ai_context_text:
      'Floral Maxi Dress by ChicStyle priced at 2999 INR. Made from rayon with vibrant floral print and A-line fit. Rated 4.4 from 87 reviews. Perfect for summer occasions.',
  },
  {
    product_id: 'CLO006',
    category: 'Clothing',
    sub_category: 'Hoodie',
    brand: 'UrbanWear',
    product_title: 'Cotton Pullover Hoodie',
    Img_URL: null,
    short_description: 'Cozy cotton hoodie for casual wear',
    long_description:
      'Comfortable pullover hoodie with kangaroo pocket perfect for relaxed style.',
    price: 1799,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 80,
    rating: 4.3,
    review_count: 156,
    variants: [
      { color: 'Gray', size: 'M' },
      { color: 'Black', size: 'L' },
    ],
    specifications: {
      material: 'Cotton Blend',
      fit: 'Regular',
      hood: 'Yes',
      pocket: 'Kangaroo',
      care: 'Machine Wash',
    },
    tags: ['hoodie', 'casual', 'cotton', 'comfortable', 'streetwear'],
    reviews: [
      { rating: 4, comment: 'Very comfortable' },
      { rating: 5, comment: 'Perfect for winter' },
    ],
    ai_context_text:
      'Cotton Pullover Hoodie by UrbanWear priced at 1799 INR. Features cotton blend material, kangaroo pocket and regular fit. Rated 4.3 from 156 reviews. Great for casual wear.',
  },
  {
    product_id: 'CLO007',
    category: 'Clothing',
    sub_category: 'Trousers',
    brand: 'FormalFit',
    product_title: 'Formal Pleated Trousers',
    Img_URL: null,
    short_description: 'Classic formal trousers for office',
    long_description:
      'Elegant pleated trousers with comfortable fit ideal for professional settings.',
    price: 1999,
    currency: 'INR',
    discount_percentage: 10,
    stock_quantity: 65,
    rating: 4.1,
    review_count: 94,
    variants: [
      { color: 'Black', size: '32' },
      { color: 'Gray', size: '34' },
    ],
    specifications: {
      material: 'Polyester Blend',
      fit: 'Regular',
      pleats: 'Double',
      closure: 'Zipper',
      pockets: '4',
    },
    tags: ['trousers', 'formal', 'office', 'pleated', 'professional'],
    reviews: [
      { rating: 4, comment: 'Good fit' },
      { rating: 4, comment: 'Comfortable for all day wear' },
    ],
    ai_context_text:
      'Formal Pleated Trousers by FormalFit priced at 1999 INR. Made from polyester blend with double pleats and regular fit. Rated 4.1 from 94 reviews. Ideal for office wear.',
  },
  {
    product_id: 'CLO008',
    category: 'Clothing',
    sub_category: 'Shorts',
    brand: 'ActiveSport',
    product_title: 'Athletic Running Shorts',
    Img_URL: null,
    short_description: 'Lightweight shorts for workouts',
    long_description:
      'Quick-dry athletic shorts with moisture-wicking fabric perfect for running and gym.',
    price: 899,
    currency: 'INR',
    discount_percentage: 20,
    stock_quantity: 110,
    rating: 4.2,
    review_count: 178,
    variants: [
      { color: 'Black', size: 'M' },
      { color: 'Navy', size: 'L' },
    ],
    specifications: {
      material: 'Polyester',
      fit: 'Regular',
      length: 'Above Knee',
      pockets: '2',
      moisture_wicking: 'Yes',
    },
    tags: ['shorts', 'athletic', 'running', 'gym', 'quick dry'],
    reviews: [
      { rating: 4, comment: 'Very comfortable for running' },
      { rating: 4, comment: 'Dries quickly' },
    ],
    ai_context_text:
      'Athletic Running Shorts by ActiveSport priced at 899 INR. Features moisture-wicking polyester and quick-dry technology. Rated 4.2 from 178 reviews. Perfect for active lifestyle.',
  },
  {
    product_id: 'CLO009',
    category: 'Clothing',
    sub_category: 'Sweater',
    brand: 'CozyKnit',
    product_title: 'Wool Blend Pullover Sweater',
    Img_URL: null,
    short_description: 'Warm wool pullover for winter',
    long_description:
      'Soft wool blend sweater with ribbed cuffs perfect for cold weather.',
    price: 2499,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 50,
    rating: 4.4,
    review_count: 112,
    variants: [
      { color: 'Navy', size: 'M' },
      { color: 'Maroon', size: 'L' },
    ],
    specifications: {
      material: 'Wool Blend',
      fit: 'Regular',
      neck: 'Crew Neck',
      sleeve: 'Long Sleeve',
      care: 'Hand Wash',
    },
    tags: ['sweater', 'wool', 'winter', 'warm', 'pullover'],
    reviews: [
      { rating: 5, comment: 'Very warm and soft' },
      { rating: 4, comment: 'Good quality' },
    ],
    ai_context_text:
      'Wool Blend Pullover Sweater by CozyKnit priced at 2499 INR. Made from soft wool blend with crew neck. Rated 4.4 from 112 reviews. Excellent warmth for winter.',
  },
  {
    product_id: 'CLO010',
    category: 'Clothing',
    sub_category: 'Polo Shirt',
    brand: 'SportFit',
    product_title: 'Classic Pique Polo Shirt',
    Img_URL: null,
    short_description: 'Casual polo shirt with collar',
    long_description:
      'Timeless pique polo shirt suitable for both casual and semi-formal occasions.',
    price: 1299,
    currency: 'INR',
    discount_percentage: 18,
    stock_quantity: 95,
    rating: 4.2,
    review_count: 134,
    variants: [
      { color: 'White', size: 'M' },
      { color: 'Navy', size: 'L' },
    ],
    specifications: {
      material: 'Cotton Pique',
      fit: 'Regular',
      collar: 'Polo',
      closure: 'Button',
      pattern: 'Solid',
    },
    tags: ['polo', 'casual', 'collar', 'cotton', 'versatile'],
    reviews: [
      { rating: 4, comment: 'Good quality fabric' },
      { rating: 4, comment: 'Versatile shirt' },
    ],
    ai_context_text:
      'Classic Pique Polo Shirt by SportFit priced at 1299 INR. Made from cotton pique with regular fit. Rated 4.2 from 134 reviews. Great for casual and semi-formal wear.',
  },
  {
    product_id: 'CLO011',
    category: 'Clothing',
    sub_category: 'Blazer',
    brand: 'FormalFit',
    product_title: 'Tailored Business Blazer',
    Img_URL: null,
    short_description: 'Professional blazer for business wear',
    long_description:
      'Sophisticated tailored blazer with notch lapel perfect for formal occasions.',
    price: 4999,
    currency: 'INR',
    discount_percentage: 12,
    stock_quantity: 30,
    rating: 4.5,
    review_count: 76,
    variants: [
      { color: 'Black', size: '40' },
      { color: 'Charcoal', size: '42' },
    ],
    specifications: {
      material: 'Polyester Blend',
      fit: 'Slim',
      lapel: 'Notch',
      buttons: '2 Button',
      pockets: '3',
      lining: 'Fully Lined',
    },
    tags: ['blazer', 'formal', 'business', 'tailored', 'professional'],
    reviews: [
      { rating: 5, comment: 'Perfect fit and quality' },
      { rating: 4, comment: 'Great for meetings' },
    ],
    ai_context_text:
      'Tailored Business Blazer by FormalFit priced at 4999 INR. Features slim fit, notch lapel and full lining. Rated 4.5 from 76 reviews. Excellent for professional settings.',
  },
  {
    product_id: 'CLO012',
    category: 'Clothing',
    sub_category: 'Leggings',
    brand: 'ActiveSport',
    product_title: 'High Waist Yoga Leggings',
    Img_URL: null,
    short_description: 'Comfortable leggings for yoga and fitness',
    long_description:
      'Stretchy high-waist leggings with compression fit perfect for workouts.',
    price: 1199,
    currency: 'INR',
    discount_percentage: 25,
    stock_quantity: 120,
    rating: 4.3,
    review_count: 198,
    variants: [
      { color: 'Black', size: 'S' },
      { color: 'Gray', size: 'M' },
    ],
    specifications: {
      material: 'Spandex Blend',
      fit: 'Compression',
      waist: 'High Waist',
      length: 'Full Length',
      pocket: 'Side Pocket',
    },
    tags: ['leggings', 'yoga', 'fitness', 'stretchy', 'high waist'],
    reviews: [
      { rating: 4, comment: 'Very comfortable' },
      { rating: 5, comment: 'Perfect for yoga' },
    ],
    ai_context_text:
      'High Waist Yoga Leggings by ActiveSport priced at 1199 INR. Features compression fit, high waist and side pocket. Rated 4.3 from 198 reviews. Ideal for yoga and fitness.',
  },
  {
    product_id: 'CLO013',
    category: 'Clothing',
    sub_category: 'Tank Top',
    brand: 'ActiveSport',
    product_title: 'Breathable Training Tank',
    Img_URL: null,
    short_description: 'Lightweight tank top for workouts',
    long_description:
      'Breathable athletic tank with moisture management for intense training sessions.',
    price: 699,
    currency: 'INR',
    discount_percentage: 20,
    stock_quantity: 130,
    rating: 4.1,
    review_count: 167,
    variants: [
      { color: 'Black', size: 'M' },
      { color: 'Blue', size: 'L' },
    ],
    specifications: {
      material: 'Polyester',
      fit: 'Regular',
      neck: 'Scoop Neck',
      back: 'Racerback',
      moisture_wicking: 'Yes',
    },
    tags: ['tank top', 'training', 'breathable', 'gym', 'athletic'],
    reviews: [
      { rating: 4, comment: 'Great for gym' },
      { rating: 4, comment: 'Breathable fabric' },
    ],
    ai_context_text:
      'Breathable Training Tank by ActiveSport priced at 699 INR. Features moisture-wicking polyester with racerback design. Rated 4.1 from 167 reviews. Perfect for gym workouts.',
  },
  {
    product_id: 'CLO014',
    category: 'Clothing',
    sub_category: 'Cardigan',
    brand: 'CozyKnit',
    product_title: 'Button Front Knit Cardigan',
    Img_URL: null,
    short_description: 'Cozy knit cardigan for layering',
    long_description:
      'Soft knit cardigan with button closure perfect for layering in cool weather.',
    price: 2199,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 60,
    rating: 4.3,
    review_count: 105,
    variants: [
      { color: 'Beige', size: 'M' },
      { color: 'Gray', size: 'L' },
    ],
    specifications: {
      material: 'Acrylic Blend',
      fit: 'Regular',
      closure: 'Button',
      pockets: '2',
      length: 'Hip Length',
    },
    tags: ['cardigan', 'knit', 'layering', 'cozy', 'button front'],
    reviews: [
      { rating: 4, comment: 'Very soft and comfortable' },
      { rating: 4, comment: 'Great for layering' },
    ],
    ai_context_text:
      'Button Front Knit Cardigan by CozyKnit priced at 2199 INR. Made from soft acrylic blend with button closure. Rated 4.3 from 105 reviews. Perfect layering piece.',
  },
  {
    product_id: 'CLO015',
    category: 'Clothing',
    sub_category: 'Tracksuit',
    brand: 'ActiveSport',
    product_title: 'Complete Training Tracksuit',
    Img_URL: null,
    short_description: 'Full tracksuit for sports and casual',
    long_description:
      'Matching jacket and pants set perfect for training, jogging and casual wear.',
    price: 3499,
    currency: 'INR',
    discount_percentage: 20,
    stock_quantity: 45,
    rating: 4.2,
    review_count: 89,
    variants: [
      { color: 'Black', size: 'M' },
      { color: 'Navy', size: 'L' },
    ],
    specifications: {
      material: 'Polyester',
      fit: 'Regular',
      jacket: 'Zip Up',
      pants: 'Elastic Waist',
      pockets: '4 Total',
    },
    tags: ['tracksuit', 'training', 'sports', 'casual', 'matching set'],
    reviews: [
      { rating: 4, comment: 'Comfortable for jogging' },
      { rating: 4, comment: 'Good quality' },
    ],
    ai_context_text:
      'Complete Training Tracksuit by ActiveSport priced at 3499 INR. Includes zip-up jacket and elastic waist pants. Rated 4.2 from 89 reviews. Great for training and casual wear.',
  },
  {
    product_id: 'HOME001',
    category: 'Home & Kitchen',
    sub_category: 'Cookware',
    brand: 'ChefPro',
    product_title: 'Non-Stick Cookware Set 5 Pieces',
    Img_URL: null,
    short_description: 'Complete non-stick cookware set',
    long_description:
      'Premium 5-piece cookware set with durable non-stick coating and heat-resistant handles.',
    price: 3999,
    currency: 'INR',
    discount_percentage: 18,
    stock_quantity: 40,
    rating: 4.4,
    review_count: 156,
    variants: [
      { color: 'Black', pieces: '5' },
      { color: 'Red', pieces: '7' },
    ],
    specifications: {
      material: 'Aluminum',
      coating: 'Non-Stick',
      pieces: '5',
      induction: 'No',
      oven_safe: 'No',
    },
    tags: ['cookware', 'non-stick', 'kitchen', 'cooking', 'set'],
    reviews: [
      { rating: 5, comment: 'Excellent quality' },
      { rating: 4, comment: 'Easy to clean' },
    ],
    ai_context_text:
      'Non-Stick Cookware Set by ChefPro priced at 3999 INR. Includes 5 pieces with durable non-stick coating. Rated 4.4 from 156 reviews. Easy to clean and maintain.',
  },
  {
    product_id: 'HOME002',
    category: 'Home & Kitchen',
    sub_category: 'Mixer Grinder',
    brand: 'PowerBlend',
    product_title: 'PowerBlend Pro 750W Mixer',
    Img_URL: null,
    short_description: 'Powerful mixer grinder with 3 jars',
    long_description:
      'High-performance 750W mixer grinder with stainless steel jars and blades.',
    price: 4499,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 35,
    rating: 4.3,
    review_count: 189,
    variants: [
      { color: 'White', jars: '3' },
      { color: 'Red', jars: '4' },
    ],
    specifications: {
      power: '750W',
      jars: '3',
      material: 'Stainless Steel',
      speeds: '3',
      warranty: '2 years',
    },
    tags: ['mixer grinder', 'kitchen appliance', 'powerful', 'stainless steel'],
    reviews: [
      { rating: 4, comment: 'Grinds very well' },
      { rating: 5, comment: 'Powerful motor' },
    ],
    ai_context_text:
      'PowerBlend Pro 750W Mixer by PowerBlend priced at 4499 INR. Features 750W motor, 3 stainless steel jars and 3 speed settings. Rated 4.3 from 189 reviews. Powerful grinding performance.',
  },
  {
    product_id: 'HOME003',
    category: 'Home & Kitchen',
    sub_category: 'Vacuum Cleaner',
    brand: 'CleanMaster',
    product_title: 'Bagless Vacuum Cleaner 1400W',
    Img_URL: null,
    short_description: 'Powerful bagless vacuum cleaner',
    long_description:
      'High-suction vacuum cleaner with HEPA filter and multiple attachments.',
    price: 6999,
    currency: 'INR',
    discount_percentage: 20,
    stock_quantity: 25,
    rating: 4.2,
    review_count: 134,
    variants: [{ color: 'Blue' }, { color: 'Red' }],
    specifications: {
      power: '1400W',
      type: 'Bagless',
      capacity: '2L',
      filter: 'HEPA',
      attachments: '5',
    },
    tags: ['vacuum cleaner', 'bagless', 'HEPA filter', 'cleaning', 'powerful'],
    reviews: [
      { rating: 4, comment: 'Great suction power' },
      { rating: 4, comment: 'Easy to use' },
    ],
    ai_context_text:
      'Bagless Vacuum Cleaner by CleanMaster priced at 6999 INR. Features 1400W power, 2L capacity, HEPA filter and 5 attachments. Rated 4.2 from 134 reviews. Excellent suction power.',
  },
  {
    product_id: 'HOME004',
    category: 'Home & Kitchen',
    sub_category: 'Air Purifier',
    brand: 'PureAir',
    product_title: 'Smart Air Purifier with HEPA',
    Img_URL: null,
    short_description: 'Advanced air purifier for clean air',
    long_description:
      'Smart air purifier with True HEPA filter removes 99.97% of pollutants.',
    price: 8999,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 30,
    rating: 4.5,
    review_count: 167,
    variants: [
      { color: 'White', coverage: '300 sq ft' },
      { color: 'Black', coverage: '500 sq ft' },
    ],
    specifications: {
      filter: 'True HEPA',
      coverage: '300 sq ft',
      modes: '4',
      noise: '25dB',
      smart: 'App Control',
    },
    tags: ['air purifier', 'HEPA', 'smart', 'clean air', 'home'],
    reviews: [
      { rating: 5, comment: 'Excellent for allergies' },
      { rating: 4, comment: 'Very quiet' },
    ],
    ai_context_text:
      'Smart Air Purifier by PureAir priced at 8999 INR. Features True HEPA filter, 300 sq ft coverage, app control and quiet operation. Rated 4.5 from 167 reviews. Great for allergies.',
  },
  {
    product_id: 'HOME005',
    category: 'Home & Kitchen',
    sub_category: 'Water Purifier',
    brand: 'AquaPure',
    product_title: 'RO Water Purifier 7 Stage',
    Img_URL: null,
    short_description: 'Advanced RO water purification system',
    long_description:
      '7-stage RO purification with UV and UF technology for safe drinking water.',
    price: 12999,
    currency: 'INR',
    discount_percentage: 18,
    stock_quantity: 20,
    rating: 4.4,
    review_count: 198,
    variants: [{ capacity: '7L' }, { capacity: '10L' }],
    specifications: {
      technology: 'RO+UV+UF',
      stages: '7',
      capacity: '7L',
      tds: 'Up to 2000ppm',
      warranty: '1 year',
    },
    tags: ['water purifier', 'RO', 'UV', 'safe water', 'kitchen'],
    reviews: [
      { rating: 5, comment: 'Water tastes great' },
      { rating: 4, comment: 'Easy installation' },
    ],
    ai_context_text:
      'RO Water Purifier by AquaPure priced at 12999 INR. Features 7-stage RO+UV+UF purification, 7L capacity. Rated 4.4 from 198 reviews. Ensures safe drinking water.',
  },
  {
    product_id: 'HOME006',
    category: 'Home & Kitchen',
    sub_category: 'Coffee Maker',
    brand: 'BrewMaster',
    product_title: 'Automatic Coffee Machine',
    Img_URL: null,
    short_description: 'Programmable coffee maker with timer',
    long_description:
      'Advanced coffee maker with multiple brew strength options and keep-warm function.',
    price: 5499,
    currency: 'INR',
    discount_percentage: 20,
    stock_quantity: 45,
    rating: 4.3,
    review_count: 145,
    variants: [
      { capacity: '10 cups', color: 'Black' },
      { capacity: '12 cups', color: 'Silver' },
    ],
    specifications: {
      capacity: '10 cups',
      programmable: 'Yes',
      keep_warm: 'Yes',
      brew_strength: '3 levels',
      filter: 'Permanent',
    },
    tags: ['coffee maker', 'automatic', 'programmable', 'kitchen', 'brewing'],
    reviews: [
      { rating: 4, comment: 'Makes great coffee' },
      { rating: 5, comment: 'Love the timer feature' },
    ],
    ai_context_text:
      'Automatic Coffee Machine by BrewMaster priced at 5499 INR. Features programmable timer, 10-cup capacity, 3 brew strengths. Rated 4.3 from 145 reviews. Perfect morning coffee.',
  },
  {
    product_id: 'HOME007',
    category: 'Home & Kitchen',
    sub_category: 'Dinner Set',
    brand: 'DineWell',
    product_title: 'Ceramic Dinner Set 24 Pieces',
    Img_URL: null,
    short_description: 'Complete ceramic dinner set for 6',
    long_description:
      'Elegant 24-piece ceramic dinner set with modern design for family dining.',
    price: 3499,
    currency: 'INR',
    discount_percentage: 22,
    stock_quantity: 50,
    rating: 4.2,
    review_count: 112,
    variants: [
      { design: 'Floral', pieces: '24' },
      { design: 'Geometric', pieces: '32' },
    ],
    specifications: {
      material: 'Ceramic',
      pieces: '24',
      serves: '6',
      microwave_safe: 'Yes',
      dishwasher_safe: 'Yes',
    },
    tags: ['dinner set', 'ceramic', 'tableware', 'dining', 'family'],
    reviews: [
      { rating: 4, comment: 'Beautiful design' },
      { rating: 4, comment: 'Good quality' },
    ],
    ai_context_text:
      'Ceramic Dinner Set by DineWell priced at 3499 INR. Includes 24 pieces serving 6, microwave and dishwasher safe. Rated 4.2 from 112 reviews. Elegant for family dining.',
  },
  {
    product_id: 'HOME008',
    category: 'Home & Kitchen',
    sub_category: 'Pressure Cooker',
    brand: 'ChefPro',
    product_title: 'Stainless Steel Pressure Cooker 5L',
    Img_URL: null,
    short_description: 'Durable pressure cooker for fast cooking',
    long_description:
      'Premium stainless steel pressure cooker with safety features and induction base.',
    price: 2999,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 60,
    rating: 4.4,
    review_count: 223,
    variants: [{ capacity: '3L' }, { capacity: '5L' }],
    specifications: {
      material: 'Stainless Steel',
      capacity: '5L',
      induction: 'Yes',
      safety_valves: '3',
      warranty: '5 years',
    },
    tags: [
      'pressure cooker',
      'stainless steel',
      'induction',
      'fast cooking',
      'kitchen',
    ],
    reviews: [
      { rating: 5, comment: 'Cooks very fast' },
      { rating: 4, comment: 'Very safe to use' },
    ],
    ai_context_text:
      'Stainless Steel Pressure Cooker by ChefPro priced at 2999 INR. Features 5L capacity, induction compatible, 3 safety valves. Rated 4.4 from 223 reviews. Fast and safe cooking.',
  },
  {
    product_id: 'HOME009',
    category: 'Home & Kitchen',
    sub_category: 'Microwave Oven',
    brand: 'CookFast',
    product_title: 'Convection Microwave 28L',
    Img_URL: null,
    short_description: 'Multi-function convection microwave',
    long_description:
      'Versatile convection microwave with grill and bake functions for complete cooking.',
    price: 11999,
    currency: 'INR',
    discount_percentage: 18,
    stock_quantity: 28,
    rating: 4.3,
    review_count: 176,
    variants: [
      { capacity: '23L', color: 'Black' },
      { capacity: '28L', color: 'Silver' },
    ],
    specifications: {
      capacity: '28L',
      type: 'Convection',
      power: '900W',
      functions: 'Microwave, Grill, Bake',
      auto_cook: '101 menus',
    },
    tags: [
      'microwave',
      'convection',
      'multi-function',
      'baking',
      'kitchen appliance',
    ],
    reviews: [
      { rating: 4, comment: 'Very versatile' },
      { rating: 5, comment: 'Baking works great' },
    ],
    ai_context_text:
      'Convection Microwave by CookFast priced at 11999 INR. Features 28L capacity, 900W power, multiple cooking functions and 101 auto-cook menus. Rated 4.3 from 176 reviews. Perfect for all cooking needs.',
  },
  {
    product_id: 'HOME010',
    category: 'Home & Kitchen',
    sub_category: 'Bedsheet Set',
    brand: 'SleepWell',
    product_title: 'Cotton Bedsheet Set King Size',
    Img_URL: null,
    short_description: 'Premium cotton bedsheet with pillowcases',
    long_description:
      'Soft and breathable cotton bedsheet set with matching pillow covers.',
    price: 1999,
    currency: 'INR',
    discount_percentage: 25,
    stock_quantity: 75,
    rating: 4.2,
    review_count: 189,
    variants: [
      { size: 'Queen', design: 'Floral' },
      { size: 'King', design: 'Geometric' },
    ],
    specifications: {
      material: '100% Cotton',
      size: 'King',
      thread_count: '200',
      includes: '1 Bedsheet, 2 Pillow Covers',
      care: 'Machine Wash',
    },
    tags: ['bedsheet', 'cotton', 'king size', 'bedroom', 'comfortable'],
    reviews: [
      { rating: 4, comment: 'Very soft and comfortable' },
      { rating: 4, comment: 'Good quality cotton' },
    ],
    ai_context_text:
      'Cotton Bedsheet Set by SleepWell priced at 1999 INR. Made from 100% cotton, king size with 200 thread count. Rated 4.2 from 189 reviews. Soft and breathable for good sleep.',
  },
  {
    product_id: 'BOOK001',
    category: 'Books',
    sub_category: 'Fiction',
    brand: 'ReadMore Publishing',
    product_title: 'The Midnight Garden',
    Img_URL: null,
    short_description: 'Mystery thriller novel',
    long_description:
      'Gripping mystery thriller about secrets hidden in an old mansion garden.',
    price: 399,
    currency: 'INR',
    discount_percentage: 20,
    stock_quantity: 150,
    rating: 4.4,
    review_count: 234,
    variants: [{ format: 'Paperback' }, { format: 'Hardcover' }],
    specifications: {
      author: 'Sarah Mitchell',
      pages: '384',
      language: 'English',
      publisher: 'ReadMore Publishing',
      isbn: '978-1234567890',
    },
    tags: ['fiction', 'thriller', 'mystery', 'suspense', 'bestseller'],
    reviews: [
      { rating: 5, comment: 'Could not put it down' },
      { rating: 4, comment: 'Great plot twists' },
    ],
    ai_context_text:
      'The Midnight Garden by Sarah Mitchell priced at 399 INR. Mystery thriller with 384 pages published by ReadMore. Rated 4.4 from 234 reviews. Engaging plot with unexpected twists.',
  },
  {
    product_id: 'BOOK002',
    category: 'Books',
    sub_category: 'Self Help',
    brand: 'GrowthMind Publishing',
    product_title: 'Mindful Success',
    Img_URL: null,
    short_description: 'Guide to achieving goals mindfully',
    long_description:
      'Practical guide combining mindfulness with goal achievement strategies.',
    price: 449,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 120,
    rating: 4.5,
    review_count: 189,
    variants: [{ format: 'Paperback' }, { format: 'eBook' }],
    specifications: {
      author: 'Dr. James Cooper',
      pages: '256',
      language: 'English',
      publisher: 'GrowthMind Publishing',
      isbn: '978-9876543210',
    },
    tags: [
      'self help',
      'mindfulness',
      'success',
      'motivation',
      'personal growth',
    ],
    reviews: [
      { rating: 5, comment: 'Life-changing book' },
      { rating: 4, comment: 'Very practical advice' },
    ],
    ai_context_text:
      'Mindful Success by Dr. James Cooper priced at 449 INR. Self-help book with 256 pages on mindfulness and goal achievement. Rated 4.5 from 189 reviews. Practical and transformative.',
  },
  {
    product_id: 'BOOK003',
    category: 'Books',
    sub_category: 'Programming',
    brand: 'TechBooks Press',
    product_title: 'Python for Data Science',
    Img_URL: null,
    short_description: 'Complete guide to Python data analysis',
    long_description:
      'Comprehensive guide covering Python programming for data science and machine learning.',
    price: 699,
    currency: 'INR',
    discount_percentage: 18,
    stock_quantity: 90,
    rating: 4.6,
    review_count: 267,
    variants: [{ format: 'Paperback' }, { format: 'eBook' }],
    specifications: {
      author: 'Michael Chen',
      pages: '512',
      language: 'English',
      publisher: 'TechBooks Press',
      isbn: '978-5555555555',
    },
    tags: [
      'programming',
      'Python',
      'data science',
      'machine learning',
      'technical',
    ],
    reviews: [
      { rating: 5, comment: 'Best Python resource' },
      { rating: 5, comment: 'Very comprehensive' },
    ],
    ai_context_text:
      'Python for Data Science by Michael Chen priced at 699 INR. Technical book with 512 pages covering Python for data science. Rated 4.6 from 267 reviews. Comprehensive and well-structured.',
  },
  {
    product_id: 'BOOK004',
    category: 'Books',
    sub_category: 'Biography',
    brand: 'LifeStory Publishers',
    product_title: 'Journey to Innovation',
    Img_URL: null,
    short_description: 'Biography of tech entrepreneur',
    long_description:
      'Inspiring story of a tech entrepreneur who revolutionized the industry.',
    price: 499,
    currency: 'INR',
    discount_percentage: 20,
    stock_quantity: 80,
    rating: 4.3,
    review_count: 156,
    variants: [{ format: 'Paperback' }, { format: 'Hardcover' }],
    specifications: {
      author: 'Robert Williams',
      pages: '368',
      language: 'English',
      publisher: 'LifeStory Publishers',
      isbn: '978-7777777777',
    },
    tags: [
      'biography',
      'entrepreneur',
      'technology',
      'inspiration',
      'success story',
    ],
    reviews: [
      { rating: 4, comment: 'Very inspiring' },
      { rating: 5, comment: 'Motivational read' },
    ],
    ai_context_text:
      'Journey to Innovation by Robert Williams priced at 499 INR. Biography with 368 pages about tech entrepreneur journey. Rated 4.3 from 156 reviews. Inspiring and motivational.',
  },
  {
    product_id: 'BOOK005',
    category: 'Books',
    sub_category: 'Cooking',
    brand: 'FlavorBooks',
    product_title: 'Indian Cuisine Masterclass',
    Img_URL: null,
    short_description: 'Comprehensive Indian cooking guide',
    long_description:
      'Complete guide to authentic Indian recipes with step-by-step instructions.',
    price: 599,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 70,
    rating: 4.5,
    review_count: 178,
    variants: [{ format: 'Paperback' }, { format: 'Hardcover' }],
    specifications: {
      author: 'Chef Priya Sharma',
      pages: '320',
      language: 'English',
      publisher: 'FlavorBooks',
      isbn: '978-8888888888',
    },
    tags: ['cooking', 'Indian cuisine', 'recipes', 'food', 'culinary'],
    reviews: [
      { rating: 5, comment: 'Authentic recipes' },
      { rating: 4, comment: 'Easy to follow' },
    ],
    ai_context_text:
      'Indian Cuisine Masterclass by Chef Priya Sharma priced at 599 INR. Cooking book with 320 pages of Indian recipes. Rated 4.5 from 178 reviews. Authentic and easy to follow.',
  },
  {
    product_id: 'BOOK006',
    category: 'Books',
    sub_category: 'Science',
    brand: 'Discovery Books',
    product_title: 'Cosmos Explained',
    Img_URL: null,
    short_description: 'Journey through space and time',
    long_description:
      'Fascinating exploration of the universe from atoms to galaxies.',
    price: 549,
    currency: 'INR',
    discount_percentage: 12,
    stock_quantity: 65,
    rating: 4.6,
    review_count: 198,
    variants: [{ format: 'Paperback' }, { format: 'Hardcover' }],
    specifications: {
      author: 'Dr. Neil Robertson',
      pages: '432',
      language: 'English',
      publisher: 'Discovery Books',
      isbn: '978-9999999999',
    },
    tags: ['science', 'astronomy', 'cosmos', 'space', 'education'],
    reviews: [
      { rating: 5, comment: 'Mind-blowing content' },
      { rating: 5, comment: 'Beautifully explained' },
    ],
    ai_context_text:
      'Cosmos Explained by Dr. Neil Robertson priced at 549 INR. Science book with 432 pages about space and universe. Rated 4.6 from 198 reviews. Fascinating and educational.',
  },
  {
    product_id: 'BOOK007',
    category: 'Books',
    sub_category: 'Children',
    brand: 'KidsWorld Publishers',
    product_title: 'Adventures in Wonderland',
    Img_URL: null,
    short_description: 'Illustrated stories for kids',
    long_description:
      'Collection of magical stories with beautiful illustrations for young readers.',
    price: 349,
    currency: 'INR',
    discount_percentage: 20,
    stock_quantity: 110,
    rating: 4.4,
    review_count: 145,
    variants: [{ format: 'Paperback' }, { format: 'Hardcover' }],
    specifications: {
      author: 'Emma Thompson',
      pages: '128',
      language: 'English',
      publisher: 'KidsWorld Publishers',
      isbn: '978-1111111111',
      age_group: '5-10 years',
    },
    tags: ['children', 'illustrated', 'stories', 'kids', 'adventure'],
    reviews: [
      { rating: 5, comment: 'Kids love it' },
      { rating: 4, comment: 'Beautiful illustrations' },
    ],
    ai_context_text:
      'Adventures in Wonderland by Emma Thompson priced at 349 INR. Children book with 128 illustrated pages for ages 5-10. Rated 4.4 from 145 reviews. Magical and engaging.',
  },
  {
    product_id: 'BOOK008',
    category: 'Books',
    sub_category: 'Business',
    brand: 'Executive Press',
    product_title: 'Leadership Principles',
    Img_URL: null,
    short_description: 'Modern leadership guide',
    long_description:
      'Essential principles and strategies for effective leadership in modern organizations.',
    price: 599,
    currency: 'INR',
    discount_percentage: 18,
    stock_quantity: 85,
    rating: 4.4,
    review_count: 167,
    variants: [{ format: 'Paperback' }, { format: 'Hardcover' }],
    specifications: {
      author: 'Margaret Foster',
      pages: '296',
      language: 'English',
      publisher: 'Executive Press',
      isbn: '978-2222222222',
    },
    tags: ['business', 'leadership', 'management', 'professional', 'strategy'],
    reviews: [
      { rating: 4, comment: 'Very insightful' },
      { rating: 5, comment: 'Must-read for managers' },
    ],
    ai_context_text:
      'Leadership Principles by Margaret Foster priced at 599 INR. Business book with 296 pages on modern leadership. Rated 4.4 from 167 reviews. Essential for managers and leaders.',
  },
  {
    product_id: 'BOOK009',
    category: 'Books',
    sub_category: 'History',
    brand: 'Heritage Publishers',
    product_title: 'Ancient Civilizations',
    Img_URL: null,
    short_description: 'Exploration of ancient world cultures',
    long_description:
      'Detailed account of major ancient civilizations and their contributions.',
    price: 649,
    currency: 'INR',
    discount_percentage: 15,
    stock_quantity: 60,
    rating: 4.5,
    review_count: 134,
    variants: [{ format: 'Paperback' }, { format: 'Hardcover' }],
    specifications: {
      author: 'Dr. Thomas Anderson',
      pages: '456',
      language: 'English',
      publisher: 'Heritage Publishers',
      isbn: '978-3333333333',
    },
    tags: ['history', 'ancient', 'civilizations', 'culture', 'education'],
    reviews: [
      { rating: 5, comment: 'Very informative' },
      { rating: 4, comment: 'Well researched' },
    ],
    ai_context_text:
      'Ancient Civilizations by Dr. Thomas Anderson priced at 649 INR. History book with 456 pages about ancient cultures. Rated 4.5 from 134 reviews. Comprehensive and well-researched.',
  },
  {
    product_id: 'BOOK010',
    category: 'Books',
    sub_category: 'Romance',
    brand: 'LoveStory Press',
    product_title: 'Hearts Entwined',
    Img_URL: null,
    short_description: 'Contemporary romance novel',
    long_description:
      'Heartwarming love story set in modern times with relatable characters.',
    price: 379,
    currency: 'INR',
    discount_percentage: 22,
    stock_quantity: 95,
    rating: 4.2,
    review_count: 212,
    variants: [{ format: 'Paperback' }, { format: 'eBook' }],
    specifications: {
      author: 'Jessica Martin',
      pages: '312',
      language: 'English',
      publisher: 'LoveStory Press',
      isbn: '978-4444444444',
    },
    tags: ['romance', 'love story', 'contemporary', 'fiction', 'emotional'],
    reviews: [
      { rating: 4, comment: 'Very romantic' },
      { rating: 5, comment: 'Loved the characters' },
    ],
    ai_context_text:
      'Hearts Entwined by Jessica Martin priced at 379 INR. Romance novel with 312 pages set in modern times. Rated 4.2 from 212 reviews. Heartwarming and relatable.',
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Upload bulk product data to the database
 * Sends all products with their reviews, AI context, and variants in one request
 * @param productsData - Array of product data to upload
 */
const uploadBulkProducts = async (
  productsData: ProductData[]
): Promise<void> => {
  try {
    console.log(`📦 Uploading ${productsData.length} products to database...`);

    const response = await fetch(`http://localhost:4000/api/v1/products/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: productsData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = (await response.json()) as {
      message: string;
      results: {
        productsCreated: number;
        reviewsCreated: number;
        aiContextCreated: number;
        variantsCreated: number;
        errors: string[];
      };
    };

    console.log(`✅ ${result.message}`);
    console.log(`📊 Results:`);
    console.log(`   - Products: ${result.results.productsCreated}`);
    console.log(`   - Reviews: ${result.results.reviewsCreated}`);
    console.log(`   - AI Contexts: ${result.results.aiContextCreated}`);
    console.log(`   - Variants: ${result.results.variantsCreated}`);

    if (result.results.errors.length > 0) {
      console.error(`⚠️  Errors encountered:`);
      result.results.errors.forEach(error => console.error(`   - ${error}`));
    }
  } catch (error) {
    console.error(`❌ Error uploading bulk products:`, error);
    throw error;
  }
};

/**
 * Load all product data into the database
 * Calls the bulk upload endpoint with all products
 */
const loadProductData = async (): Promise<void> => {
  console.log(`🚀 Starting bulk product data upload...`);
  await uploadBulkProducts(datas);
  console.log(`🎉 Bulk upload completed!`);
};

/**
 * Initialize and run the product data loader
 */
(async () => {
  await loadProductData();
})();
