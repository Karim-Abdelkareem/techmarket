import { useRef, useEffect } from 'react';

const FeaturedProducts = ({ className }) => {
  const productsRef = useRef(null);

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
  }, []);

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      price: 1199,
      originalPrice: 1299,
      rating: 4.8,
      reviews: 2847,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=iPhone+15+Pro+Max',
      badge: 'Best Seller',
    },
    {
      id: 2,
      name: 'AirPods Pro (3rd Gen)',
      brand: 'Apple',
      price: 249,
      originalPrice: 279,
      rating: 4.6,
      reviews: 3421,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=AirPods+Pro',
      badge: 'Popular',
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      price: 1099,
      originalPrice: 1199,
      rating: 4.7,
      reviews: 1876,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=Galaxy+S24+Ultra',
      badge: 'Popular',
    },
    {
      id: 4,
      name: 'MacBook Air M4',
      brand: 'Apple',
      price: 1099,
      originalPrice: 1199,
      rating: 4.9,
      reviews: 1523,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=MacBook+Air+M4',
      badge: 'New arrival',
    },
  ];

  return (
    <div className={`py-16 px-6 bg-dark ${className || ''}`} ref={productsRef}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4 animate-fadeIn">Featured Products</h2>
        <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto animate-fadeIn delay-100">
          Discover our handpicked selection of the latest and most popular tech products
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="product-card bg-gray-800 rounded-lg overflow-hidden opacity-0 transition-all duration-500"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}
              </div>
              
              <div className="p-5">
                <div className="text-gray-400 text-sm mb-1">{product.brand}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-white">{product.rating}</span>
                  <span className="text-gray-400 ml-1">({product.reviews})</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-blue-500 font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through ml-2">${product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="px-5 pb-5">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 hover:scale-105">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;