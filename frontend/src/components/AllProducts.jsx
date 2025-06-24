import { useState } from 'react';

const AllProducts = () => {
  const [selectedFilter, setSelectedFilter] = useState('Featured');
  const [expandedFilters, setExpandedFilters] = useState([]);

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
    {
      id: 5,
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
      id: 6,
      name: 'AirPods Pro (3rd Gen)',
      brand: 'Apple',
      price: 249,
      originalPrice: 279,
      rating: 4.6,
      reviews: 3421,
      image: 'https://placehold.co/300x200/e2e8f0/1e293b?text=AirPods+Pro',
      badge: 'Popular',
    },
  ];

  const filters = [
    {
      id: 'brands',
      name: 'Brands',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'samsung', label: 'Samsung' },
        { value: 'sony', label: 'Sony' },
        { value: 'lenovo', label: 'Lenovo' },
        { value: 'dell', label: 'Dell' },
      ],
    },
  ];

  const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Newest'];

  const toggleFilter = (filterId) => {
    if (expandedFilters.includes(filterId)) {
      setExpandedFilters(expandedFilters.filter((id) => id !== filterId));
    } else {
      setExpandedFilters([...expandedFilters, filterId]);
    }
  };

  return (
    <div className="py-16 px-6 bg-dark" id="products">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">All Products</h2>
        <p className="text-gray-400 mb-8">Showing {products.length} of {products.length} products</p>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl font-semibold">Filters</h3>
                <button className="text-gray-400 hover:text-white text-sm">
                  Clear
                </button>
              </div>
              
              {filters.map((filter) => (
                <div key={filter.id} className="mb-6">
                  <button
                    className="flex justify-between items-center w-full text-white font-medium mb-3"
                    onClick={() => toggleFilter(filter.id)}
                  >
                    <span>{filter.name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${expandedFilters.includes(filter.id) ? 'transform rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  
                  {expandedFilters.includes(filter.id) && (
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-${filter.id}-${option.value}`}
                            name={`${filter.id}[]`}
                            defaultValue={option.value}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`filter-${filter.id}-${option.value}`}
                            className="ml-3 text-sm text-gray-300"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Price range (EGP)</h4>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    placeholder="0"
                    className="bg-gray-700 text-white px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="number"
                    placeholder="2000"
                    className="bg-gray-700 text-white px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Products */}
          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="flex space-x-2 mb-4 sm:mb-0">
                <button className="bg-blue-600 text-white p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="bg-gray-700 text-gray-400 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="relative">
                <button
                  type="button"
                  className="bg-gray-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                >
                  <span>{selectedFilter}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 object-cover"
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
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;