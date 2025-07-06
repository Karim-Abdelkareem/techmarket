import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProductsByCategory } from '../../services/api';
import toast from 'react-hot-toast';

const CategoryPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || 'newest',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    brand: searchParams.get('brand') || '',
    productType: searchParams.get('productType') || ''
  });
  const searchTerm = searchParams.get('search') || '';

  const categories = {
    Mobile: {
      name: 'Mobile Phones & Tablets',
      icon: '📱',
      description: 'Latest smartphones and mobile devices',
      brands: ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'OPPO', 'Vivo', 'OnePlus', 'Google Pixel']
    },
  
    Laptop: {
      name: 'Laptops',
      icon: '💻',
      description: 'Gaming, business, and student laptops',
      brands: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Razer']
    },
    Accessories: {
      name: 'Accessories',
      icon: '🔧',
      description: 'Cables, chargers, and device accessories',
      brands: ['Apple', 'Samsung', 'Anker', 'Belkin', 'UGREEN', 'Baseus']
    },
    Wearables: {
      name: 'Wearables',
      icon: '⌚',
      description: 'Smart watches and fitness trackers',
      brands: ['Apple', 'Samsung', 'Fitbit', 'Garmin', 'Xiaomi', 'Huawei']
    },
    Audio: {
      name: 'Audio',
      icon: '🎧',
      description: 'Headphones, speakers, and audio equipment',
      brands: ['Apple', 'Samsung', 'Sony', 'Bose', 'JBL', 'Beats', 'Sennheiser']
    },
    Gaming: {
      name: 'Gaming',
      icon: '🎮',
      description: 'Gaming consoles and accessories',
      brands: ['Sony', 'Microsoft', 'Nintendo', 'Razer', 'Logitech', 'SteelSeries']
    }
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [category, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductsByCategory(category);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    if (searchTerm) newSearchParams.set('search', searchTerm);
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({
      sort: 'newest',
      priceMin: '',
      priceMax: '',
      brand: '',
      productType: ''
    });
    const newSearchParams = new URLSearchParams();
    if (searchTerm) newSearchParams.set('search', searchTerm);
    setSearchParams(newSearchParams);
  };

  // Filter products by search term if present
  const filteredProducts = searchTerm
    ? products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

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
          {product.discount > 0 ? (
            <>
              <span className="text-2xl font-bold text-white">${product.priceAfterDiscount}</span>
              <span className="text-gray-400 line-through ml-2">${product.price}</span>
            </>
          ) : (
            <span className="text-2xl font-bold text-white">${product.price}</span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">
            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  const currentCategory = categories[category];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">{currentCategory?.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{currentCategory?.name}</h1>
              <p className="text-gray-300">{currentCategory?.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>
              
              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Brands</option>
                  {currentCategory?.brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-300">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your filters or browse other categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 