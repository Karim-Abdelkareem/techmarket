import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts } from '../services/api';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    productType: searchParams.get('productType') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    brand: searchParams.get('brand') || '',
  });

  // Enhanced categories with icons and descriptions
  const categories = [
    { 
      id: 'Mobile', 
      name: 'Mobile Phones', 
      icon: '📱', 
      description: 'Latest smartphones and mobile devices',
      color: 'bg-blue-500',
      productTypes: ['MobileTablet']
    },
    { 
      id: 'Tablet', 
      name: 'Tablets', 
      icon: '📱', 
      description: 'Tablets and iPads for work and entertainment',
      color: 'bg-purple-500',
      productTypes: ['MobileTablet']
    },
    { 
      id: 'Laptop', 
      name: 'Laptops', 
      icon: '💻', 
      description: 'Gaming, business, and student laptops',
      color: 'bg-green-500',
      productTypes: ['Laptop']
    },
    { 
      id: 'Accessories', 
      name: 'Accessories', 
      icon: '🔧', 
      description: 'Cables, chargers, and device accessories',
      color: 'bg-orange-500',
      productTypes: ['Cable', 'Charger', 'PowerBank', 'CaseCover', 'ScreenProtector']
    },
    { 
      id: 'Wearables', 
      name: 'Wearables', 
      icon: '⌚', 
      description: 'Smart watches and fitness trackers',
      color: 'bg-red-500',
      productTypes: ['Wearable']
    },
    { 
      id: 'Audio', 
      name: 'Audio', 
      icon: '🎧', 
      description: 'Headphones, speakers, and audio equipment',
      color: 'bg-pink-500',
      productTypes: ['Audio']
    },
  ];

  // Popular brands for mobile phones (similar to 2B)
  const popularBrands = [
    { id: 'Apple', name: 'Apple', icon: '🍎', color: 'bg-gray-800' },
    { id: 'Samsung', name: 'Samsung', icon: '📱', color: 'bg-blue-600' },
    { id: 'Huawei', name: 'Huawei', icon: '🌸', color: 'bg-red-600' },
    { id: 'Xiaomi', name: 'Xiaomi', icon: '⚡', color: 'bg-orange-600' },
    { id: 'Honor', name: 'Honor', icon: '🏆', color: 'bg-purple-600' },
    { id: 'Vivo', name: 'Vivo', icon: '📷', color: 'bg-blue-500' },
    { id: 'OPPO', name: 'OPPO', icon: '📱', color: 'bg-green-600' },
    { id: 'Realme', name: 'Realme', icon: '⚡', color: 'bg-yellow-600' },
    { id: 'Infinix', name: 'Infinix', icon: '📱', color: 'bg-indigo-600' },
    { id: 'Nokia', name: 'Nokia', icon: '🔵', color: 'bg-blue-700' },
    { id: 'MOTOROLA', name: 'Motorola', icon: '🦅', color: 'bg-red-700' },
    { id: 'Tecno', name: 'Tecno', icon: '📱', color: 'bg-blue-800' },
    { id: 'HMD', name: 'HMD', icon: '📱', color: 'bg-gray-700' },
    { id: 'Nothing', name: 'Nothing', icon: '⚫', color: 'bg-black' },
  ];

  const productTypes = {
    Mobile: ['MobileTablet'],
    Tablet: ['MobileTablet'],
    Laptop: ['Laptop'],
    Accessories: ['Cable', 'Charger', 'PowerBank', 'CaseCover', 'ScreenProtector'],
    Wearables: ['Wearable'],
    Audio: ['Audio'],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        
        if (filters.category) params.category = filters.category;
        if (filters.productType) params.productType = filters.productType;
        if (filters.search) params.search = filters.search;
        if (filters.sort) params.sort = filters.sort;
        if (filters.priceMin) params.priceMin = filters.priceMin;
        if (filters.priceMax) params.priceMax = filters.priceMax;
        if (filters.brand) params.brand = filters.brand;

        const response = await searchProducts(params);
        setProducts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      productType: '',
      search: '',
      sort: 'newest',
      priceMin: '',
      priceMax: '',
      brand: '',
    });
    setSearchParams({});
  };

  const ProductCard = ({ product }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group border border-gray-700">
      <div className="relative">
        <img 
          src={product.image || '/assets/default-product.jpg'} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => { e.target.src = '/assets/default-product.jpg'; }}
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-bold">
            -{product.discount}%
          </div>
        )}
        {product.isExclusive && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-sm font-bold">
            EXCLUSIVE
          </div>
        )}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        
        {product.brand && (
          <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
        )}
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-400 text-sm">({product.views || 0} views)</span>
        </div>
        
        <div className="flex items-baseline mb-3">
          {product.priceAfterDiscount && product.price && product.priceAfterDiscount < product.price ? (
            <>
              <span className="text-xl font-bold text-blue-500">${product.priceAfterDiscount}</span>
              <span className="text-gray-400 line-through ml-2">${product.price}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-blue-500">${product.price || 0}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm ${product.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
          <Link 
            to={`/product/${product._id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  const CategoryCard = ({ category }) => (
    <Link 
      to={`/search?category=${category.id}`}
      className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600 group"
    >
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-2xl mr-4`}>
          {category.icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
            {category.name}
          </h3>
          <p className="text-gray-400 text-sm">{category.description}</p>
        </div>
      </div>
      <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
        <span className="text-sm font-medium">Browse {category.name}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </Link>
  );

  const BrandCard = ({ brand }) => (
    <button
      onClick={() => handleFilterChange('brand', filters.brand === brand.id ? '' : brand.id)}
      className={`block bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-300 border-2 ${
        filters.brand === brand.id 
          ? 'border-blue-500 bg-blue-900/20' 
          : 'border-gray-700 hover:border-gray-600'
      } group`}
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-lg ${brand.color} flex items-center justify-center text-xl mr-3`}>
          {brand.icon}
        </div>
        <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
          {brand.name}
        </span>
      </div>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show categories if no specific category is selected
  if (!filters.category && !filters.search && !filters.productType) {
    return (
      <div className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Shop by Category</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover the latest tech products and accessories across all categories
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search for products..."
                className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          {/* Featured Products Section */}
          {products.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6">Featured Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {filters.category ? categories.find(c => c.id === filters.category)?.name : 'Search Results'}
              </h1>
              <p className="text-gray-400 text-lg">
                {filters.search ? `Search results for "${filters.search}"` : 'Discover the latest tech products'}
              </p>
            </div>
            <Link 
              to="/search" 
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Categories
            </Link>
          </div>
        </div>

        {/* Shop by Brand Section (similar to 2B) */}
        {filters.category === 'Mobile' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Shop by brand</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {popularBrands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        )}

        {/* Sort and View Options */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <span className="text-gray-300 font-medium">Sort By:</span>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="most-selling">Most Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 font-medium">View as:</span>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-gray-700 rounded-md text-white hover:bg-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </button>
              <button className="p-2 bg-blue-600 rounded-md text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
            <span className="text-gray-400 text-sm">{products.length} items</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-4 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Categories
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={filters.category === category.id}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-300 hover:text-white transition-colors">
                        {category.icon} {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              {filters.category === 'Mobile' && (
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    Brand
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {popularBrands.map((brand) => (
                      <label key={brand.id} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="brand"
                          value={brand.id}
                          checked={filters.brand === brand.id}
                          onChange={(e) => handleFilterChange('brand', e.target.value)}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-300 hover:text-white transition-colors">
                          {brand.icon} {brand.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Types */}
              {filters.category && productTypes[filters.category] && (
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    Product Types
                  </label>
                  <div className="space-y-2">
                    {productTypes[filters.category].map((type) => (
                      <label key={type} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="productType"
                          value={type}
                          checked={filters.productType === type}
                          onChange={(e) => handleFilterChange('productType', e.target.value)}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-300 hover:text-white transition-colors">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Price Range
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    placeholder="Min Price"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    placeholder="Max Price"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {error ? (
              <div className="bg-red-900/50 text-white p-6 rounded-lg text-center">
                <p>{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-gray-800 text-white p-12 rounded-lg text-center border border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search terms</p>
                <button 
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination (similar to 2B) */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-gray-400">
                    Showing {products.length} products
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">Show:</span>
                    <select className="bg-gray-700 border border-gray-600 rounded-md text-white px-2 py-1 text-sm">
                      <option value="16">16</option>
                      <option value="24">24</option>
                      <option value="48">48</option>
                    </select>
                    <span className="text-gray-400 text-sm">per page</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 