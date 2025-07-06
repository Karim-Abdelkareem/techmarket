import { useState, useEffect } from 'react';

// Demo data for offers - No API calls
const demoProducts = [
  {
    _id: '1',
    name: 'MacBook Pro 16" M2 Pro',
    brand: 'Apple',
    category: 'Laptop',
    price: 2499.99,
    priceAfterDiscount: 2199.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 15,
    reviews: 42,
    isExclusive: true,
    badge: 'HOT DEAL'
  },
  {
    _id: '2',
    name: 'iPhone 14 Pro Max - 256GB',
    brand: 'Apple',
    category: 'Mobile',
    price: 1299.99,
    priceAfterDiscount: 1099.99,
    image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 23,
    reviews: 78,
    isExclusive: false,
    badge: 'BESTSELLER'
  },
  {
    _id: '3',
    name: 'Samsung Galaxy S23 Ultra',
    brand: 'Samsung',
    category: 'Mobile',
    price: 1199.99,
    priceAfterDiscount: 949.99,
    image: 'https://images.unsplash.com/photo-1678911820864-e5cfd0902d7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 18,
    reviews: 56,
    isExclusive: false,
    badge: 'LIMITED'
  },
  {
    _id: '4',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    category: 'Audio',
    price: 399.99,
    priceAfterDiscount: 299.99,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 32,
    reviews: 124,
    isExclusive: false,
    badge: 'NEW'
  },
  {
    _id: '5',
    name: 'iPad Pro 12.9" M2 Chip',
    brand: 'Apple',
    category: 'Tablet',
    price: 1099.99,
    priceAfterDiscount: 899.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 9,
    reviews: 37,
    isExclusive: true,
    badge: 'EXCLUSIVE'
  },
  {
    _id: '6',
    name: 'Apple Watch Series 8',
    brand: 'Apple',
    category: 'Wearable',
    price: 499.99,
    priceAfterDiscount: 429.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 27,
    reviews: 93,
    isExclusive: false,
    badge: 'SALE'
  },
  {
    _id: '7',
    name: 'Dell XPS 15 OLED',
    brand: 'Dell',
    category: 'Laptop',
    price: 1899.99,
    priceAfterDiscount: 1599.99,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 12,
    reviews: 45,
    isExclusive: false,
    badge: 'HOT DEAL'
  },
  {
    _id: '8',
    name: 'Samsung Galaxy Tab S8 Ultra',
    brand: 'Samsung',
    category: 'Tablet',
    price: 899.99,
    priceAfterDiscount: 749.99,
    image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9dd8df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 14,
    reviews: 29,
    isExclusive: false,
    badge: 'NEW'
  },
  {
    _id: '9',
    name: 'Bose QuietComfort Earbuds II',
    brand: 'Bose',
    category: 'Audio',
    price: 299.99,
    priceAfterDiscount: 249.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 21,
    reviews: 67,
    isExclusive: false,
    badge: 'BESTSELLER'
  },
  {
    _id: '10',
    name: 'Samsung Galaxy Watch 5 Pro',
    brand: 'Samsung',
    category: 'Wearable',
    price: 449.99,
    priceAfterDiscount: 379.99,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 19,
    reviews: 41,
    isExclusive: false,
    badge: 'LIMITED'
  },
  {
    _id: '11',
    name: 'Google Pixel 7 Pro',
    brand: 'Google',
    category: 'Mobile',
    price: 899.99,
    priceAfterDiscount: 749.99,
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 16,
    reviews: 52,
    isExclusive: false,
    badge: 'SALE'
  },
  {
    _id: '12',
    name: 'Anker 20000mAh Power Bank',
    brand: 'Anker',
    category: 'Accessory',
    price: 59.99,
    priceAfterDiscount: 39.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    quantity: 38,
    reviews: 112,
    isExclusive: false,
    badge: 'HOT DEAL'
  }
];

const OffersPage = () => {
  const [offers, setOffers] = useState(demoProducts);
  const [filteredOffers, setFilteredOffers] = useState(demoProducts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount');
  const [loading, setLoading] = useState(true);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories', count: demoProducts.length },
    { id: 'Laptop', name: 'Laptops', count: demoProducts.filter(p => p.category === 'Laptop').length },
    { id: 'Mobile', name: 'Mobile Phones', count: demoProducts.filter(p => p.category === 'Mobile').length },
    { id: 'Tablet', name: 'Tablets', count: demoProducts.filter(p => p.category === 'Tablet').length },
    { id: 'Audio', name: 'Audio & Headphones', count: demoProducts.filter(p => p.category === 'Audio').length },
    { id: 'Wearable', name: 'Wearables', count: demoProducts.filter(p => p.category === 'Wearable').length },
    { id: 'Accessory', name: 'Accessories', count: demoProducts.filter(p => p.category === 'Accessory').length }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [activeCategory, sortBy]);

  const filterAndSortProducts = () => {
    let filtered = [...demoProducts];
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    
    // Sort products
    switch (sortBy) {
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = calculateDiscount(a.price, a.priceAfterDiscount);
          const discountB = calculateDiscount(b.price, b.priceAfterDiscount);
          return discountB - discountA;
        });
        break;
      case 'price-low':
        filtered.sort((a, b) => a.priceAfterDiscount - b.priceAfterDiscount);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.priceAfteriscoun - a.priceAfterDiscount);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    setFilteredOffers(filtered);
  };

  const calculateDiscount = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-10 bg-gray-800 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
            </div>
            
            {/* Banner Skeleton */}
            <div className="bg-gray-800 rounded-xl h-32 mb-8"></div>
            
            {/* Filters Skeleton */}
            <div className="flex gap-4 mb-6 overflow-x-auto">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-800 rounded-lg w-32 flex-shrink-0"></div>
              ))}
            </div>
            
            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-700"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Special Offers</h1>
            <p className="text-gray-300 text-lg">
              Discover amazing deals on premium tech products
            </p>
          </div>
        </div>
      </div>

      {/* Promotional Banners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
            <div className="text-sm font-medium mb-1">Up to 24 Months</div>
            <div className="text-2xl font-bold">0% Interest</div>
            <div className="text-xs opacity-90">*T&C's apply</div>
          </div>
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
            <div className="text-sm font-medium mb-1">Discount up to</div>
            <div className="text-2xl font-bold">50% OFF</div>
            <div className="text-xs opacity-90">Limited time offer</div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
            <div className="text-sm font-medium mb-1">Exclusive Deals</div>
            <div className="text-2xl font-bold">Online Only</div>
            <div className="text-xs opacity-90">Shop now & save</div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Sort and Results Count */}
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              {filteredOffers.length} Items
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="discount">Highest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOffers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L9 5L6 7"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No offers found</h3>
            <p className="text-gray-400">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const discount = Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100);
  
  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'HOT DEAL': return 'bg-red-500';
      case 'BESTSELLER': return 'bg-green-500';
      case 'NEW': return 'bg-blue-500';
      case 'LIMITED': return 'bg-orange-500';
      case 'EXCLUSIVE': return 'bg-purple-500';
      case 'SALE': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group border border-gray-700">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:opacity-95 transition-opacity"
        />
        
        {/* Discount Badge */}
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-bold">
          -{discount}%
        </div>
        
        {/* Product Badge */}
        <div className={`absolute top-2 right-2 ${getBadgeColor(product.badge)} text-white px-2 py-1 rounded-md text-xs font-bold`}>
          {product.badge}
        </div>
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => alert(`Viewing ${product.name}`)}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Quick View
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <div className="text-blue-400 text-sm font-medium mb-1">{product.brand}</div>
        )}
        
        {/* Product Name */}
        <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        
        {/* Reviews */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          <span className="text-gray-400 text-sm">({product.reviews})</span>
        </div>
        
        {/* Pricing */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-400">{formatPrice(product.priceAfterDiscount)}</span>
            <span className="text-gray-400 line-through text-sm">{formatPrice(product.price)}</span>
          </div>
          <div className="text-green-400 text-sm font-medium">
            You save {formatPrice(product.price - product.priceAfterDiscount)}
          </div>
        </div>
        
        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
          </span>
          <button
            onClick={() => alert(`Viewing deal for ${product.name}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            View Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;