import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';

const OffersPage = () => {
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedOffers();
  }, []);

  const fetchFeaturedOffers = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ limit: 8, discount: { $gt: 0 } });
      const products = response.data || response;
      setFeaturedOffers(products);
    } catch (error) {
      console.error('Error fetching featured offers:', error);
      // Use demo data if API fails
      setFeaturedOffers(getDemoOffers());
    } finally {
      setLoading(false);
    }
  };

  const getDemoOffers = () => [
    {
      _id: 1,
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      price: 1199,
      discount: 15,
      priceAfterDiscount: 1019,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=iPhone+15+Pro+Max',
      category: 'Mobile',
      isExclusive: true,
      badge: 'Flash Sale'
    },
    {
      _id: 2,
      name: 'MacBook Air M4',
      brand: 'Apple',
      price: 1099,
      discount: 20,
      priceAfterDiscount: 879,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=MacBook+Air+M4',
      category: 'Laptop',
      isExclusive: false,
      badge: 'Limited Time'
    },
    {
      _id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      price: 1099,
      discount: 12,
      priceAfterDiscount: 967,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=Galaxy+S24+Ultra',
      category: 'Mobile',
      isExclusive: true,
      badge: 'Hot Deal'
    },
    {
      _id: 4,
      name: 'AirPods Pro (3rd Gen)',
      brand: 'Apple',
      price: 249,
      discount: 25,
      priceAfterDiscount: 187,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=AirPods+Pro',
      category: 'Audio',
      isExclusive: false,
      badge: 'Best Seller'
    },
    {
      _id: 5,
      name: 'iPad Pro 12.9"',
      brand: 'Apple',
      price: 899,
      discount: 18,
      priceAfterDiscount: 737,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=iPad+Pro',
      category: 'Tablet',
      isExclusive: true,
      badge: 'New Arrival'
    },
    {
      _id: 6,
      name: 'Apple Watch Series 9',
      brand: 'Apple',
      price: 399,
      discount: 30,
      priceAfterDiscount: 279,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=Apple+Watch',
      category: 'Wearables',
      isExclusive: false,
      badge: 'Trending'
    },
    {
      _id: 7,
      name: 'Sony WH-1000XM5',
      brand: 'Sony',
      price: 349,
      discount: 22,
      priceAfterDiscount: 272,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=Sony+WH-1000XM5',
      category: 'Audio',
      isExclusive: true,
      badge: 'Premium'
    },
    {
      _id: 8,
      name: 'Dell XPS 13 Plus',
      brand: 'Dell',
      price: 1299,
      discount: 16,
      priceAfterDiscount: 1091,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=Dell+XPS+13',
      category: 'Laptop',
      isExclusive: false,
      badge: 'Staff Pick'
    }
  ];

  const getBadgeColor = (badge) => {
    const colors = {
      'Flash Sale': 'bg-red-600',
      'Limited Time': 'bg-orange-600',
      'Hot Deal': 'bg-pink-600',
      'Best Seller': 'bg-green-600',
      'New Arrival': 'bg-blue-600',
      'Trending': 'bg-purple-600',
      'Premium': 'bg-yellow-600',
      'Staff Pick': 'bg-indigo-600'
    };
    return colors[badge] || 'bg-blue-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Exclusive Offers & Deals
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Discover amazing discounts on premium tech products. Limited time offers on the latest gadgets and accessories.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
              Up to 30% Off
            </div>
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
              Free Shipping
            </div>
            <div className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
              Exclusive Deals
            </div>
          </div>
        </div>

        {/* Featured Offers Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Offers</h2>
            <Link 
              to="/search" 
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              View All Products →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredOffers.map((offer) => (
              <div key={offer._id} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group border border-gray-700">
                <div className="relative">
                  <img 
                    src={offer.image} 
                    alt={offer.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    <span className={`${getBadgeColor(offer.badge)} text-white px-2 py-1 rounded-md text-xs font-bold`}>
                      {offer.badge}
                    </span>
                    <span className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -{offer.discount}% OFF
                    </span>
                  </div>
                  {offer.isExclusive && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                      EXCLUSIVE
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {offer.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3">{offer.brand}</p>
                  
                  <div className="flex items-baseline mb-3">
                    <span className="text-xl font-bold text-blue-500">${offer.priceAfterDiscount}</span>
                    <span className="text-gray-400 line-through ml-2">${offer.price}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-500">In Stock</span>
                    <Link 
                      to={`/product/${offer._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      View Deal
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Mobile Phones', icon: '📱', category: 'Mobile', discount: 'Up to 25% Off' },
              { name: 'Laptops', icon: '💻', category: 'Laptop', discount: 'Up to 30% Off' },
              { name: 'Tablets', icon: '📱', category: 'Tablet', discount: 'Up to 20% Off' },
              { name: 'Smartwatches', icon: '⌚', category: 'Wearables', discount: 'Up to 35% Off' },
              { name: 'Headphones', icon: '🎧', category: 'Audio', discount: 'Up to 40% Off' },
              { name: 'Accessories', icon: '🔌', category: 'Accessories', discount: 'Up to 50% Off' }
            ].map((cat) => (
              <Link 
                key={cat.name}
                to={`/search?category=${cat.category}`}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600 group"
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-green-400 font-medium">{cat.discount}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive deals, new product launches, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersPage; 