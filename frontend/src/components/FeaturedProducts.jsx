import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FeaturedProducts = ({ className }) => {
  const productsRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token")
      try {
        setLoading(true);
        // Get random products (using the same approach as AllProducts)
        const response = await axios.get('http://127.0.0.1:3000/api/product', {
          headers: {
            Authorization: token
          },
        });
        
        // Get 4 random products from the response
        if (response.data.data && response.data.data.length > 0) {
          const allProducts = response.data.data;
          const randomProducts = [];
          
          // Get 4 random products or all if less than 4
          const numProducts = Math.min(4, allProducts.length);
          const usedIndices = new Set();
          
          while (randomProducts.length < numProducts) {
            const randomIndex = Math.floor(Math.random() * allProducts.length);
            if (!usedIndices.has(randomIndex)) {
              usedIndices.add(randomIndex);
              randomProducts.push(allProducts[randomIndex]);
            }
          }
          
          setProducts(randomProducts);
        } else {
          // Fallback to default products if API doesn't return expected format
          setProducts(defaultProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        // Use default products as fallback
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Animation for product cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productCards = entry.target.querySelectorAll('.product-card');
            productCards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-fadeIn');
                card.style.opacity = 1;
              }, index * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (productsRef.current) {
      observer.observe(productsRef.current);
    }

    return () => {
      if (productsRef.current) {
        observer.unobserve(productsRef.current);
      }
    };
  }, [products]);

  // Default products as fallback
  const defaultProducts = [
    {
      _id: 1,
      name: 'iPhone 15 Pro Max',
      company: { name: 'Apple' },
      price: 1199,
      discount: 100,
      rating: 4.8,
      views: 2847,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=iPhone+15+Pro+Max',
      badge: 'Best Seller',
    },
    {
      _id: 2,
      name: 'AirPods Pro (3rd Gen)',
      company: { name: 'Apple' },
      price: 249,
      discount: 30,
      rating: 4.6,
      views: 3421,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=AirPods+Pro',
      badge: 'Popular',
    },
    {
      _id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      company: { name: 'Samsung' },
      price: 1099,
      discount: 100,
      rating: 4.7,
      views: 1876,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=Galaxy+S24+Ultra',
      badge: 'Popular',
    },
    {
      _id: 4,
      name: 'MacBook Air M4',
      company: { name: 'Apple' },
      price: 1099,
      discount: 100,
      rating: 4.9,
      views: 1523,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=MacBook+Air+M4',
      badge: 'New arrival',
    },
  ];

  // Determine product badge based on properties
  const getProductBadge = (product) => {
    if (product.badge) return product.badge;
    if (product.views > 3000) return 'Best Seller';
    if (product.views > 1500) return 'Popular';
    if (product.discount && product.discount > 50) return 'Big Discount';
    if (product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) return 'New arrival';
    return null;
  };

  // Calculate original price from discount
  const getOriginalPrice = (product) => {
    if (product.discount) {
      return product.price + product.discount;
    }
    return null;
  };

  // Get company/brand name
  const getBrandName = (product) => {
    if (product.company && product.company.name) {
      return product.company.name;
    }
    return 'Unknown Brand';
  };

  // Get product image
  const getProductImage = (product) => {
    if (product.image) {
      return product.image;
    }
    return `https://placehold.co/300x200/e2e8f0/1e293b?text=${encodeURIComponent(product.name || 'Product')}`;
  };

  // Get product rating
  const getProductRating = (product) => {
    return product.rating || 0;
  };

  // Get product reviews/views
  const getProductReviews = (product) => {
    return product.views || 0;
  };

  if (loading) {
    return (
      <div className={`py-16 px-6 bg-dark ${className || ''}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4 animate-fadeIn">Featured Products</h2>
          <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto animate-fadeIn delay-100">
            Discover our handpicked selection of the latest and most popular tech products
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse h-80">
                <div className="h-48 bg-gray-700"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error(error);
  }

  return (
    <div className={`py-16 px-6 bg-dark ${className || ''}`} ref={productsRef}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4 animate-fadeIn">Featured Products</h2>
        <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto animate-fadeIn delay-100">
          Discover our handpicked selection of the latest and most popular tech products
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
            const badge = getProductBadge(product);
            const originalPrice = getOriginalPrice(product);
            const brandName = getBrandName(product);
            const productImage = getProductImage(product);
            const rating = getProductRating(product);
            const reviews = getProductReviews(product);
            
            return (
              <div 
                key={product._id || index} 
                className="product-card bg-gray-800 rounded-lg overflow-hidden opacity-0 transition-all duration-500 hover:shadow-xl"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Link to={`/product/${product._id}`} className="block">
                  <div className="relative overflow-hidden">
                    <img 
                      src={productImage} 
                      alt={product.name} 
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                    />
                    {badge && (
                      <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        {badge}
                      </span>
                    )}
                  </div>
                </Link>
                
                <div className="p-5">
                  <div className="text-gray-400 text-sm mb-1">{brandName}</div>
                  <Link to={`/product/${product._id}`} className="block">
                    <h3 className="text-white font-semibold text-lg mb-2 hover:text-blue-500 transition-colors">{product.name}</h3>
                  </Link>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="text-white">{rating.toFixed(1)}</span>
                    <span className="text-gray-400 ml-1">({reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-blue-500 font-bold">${product.price}</span>
                      {originalPrice && (
                        <span className="text-gray-400 line-through ml-2">${originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-5 pb-5">
                  <Link to={`/product/${product._id}`} className="block w-full">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 hover:scale-105">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;