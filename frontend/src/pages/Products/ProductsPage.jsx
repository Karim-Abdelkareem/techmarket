import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getProducts, getProductsByCategory } from '../../services/api';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('most-selling');
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    brand: [],
    priceRange: '',
    displaySize: [],
    operatingSystem: [],
    processor: [],
    ram: [],
    graphicsCard: [],
    hardDisk: []
  });

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy, itemsPerPage, currentPage, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        category: category,
        sort: sortBy,
        limit: itemsPerPage,
        page: currentPage,
        ...filters
      };
      
      const response = await getProducts(params);
      setProducts(response.data || response);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleItemsPerPageChange = (count) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'Laptop':
        return 'Best Laptops';
      case 'Tablet':
        return 'Best Tablets';
      case 'Mobile':
        return 'Best Mobile Phones';
      default:
        return 'Products';
    }
  };

  const getCategoryDescription = () => {
    switch (category) {
      case 'Laptop':
        return 'Discover the latest laptops from top brands with powerful processors, stunning displays, and exceptional performance.';
      case 'Tablet':
        return 'Explore premium tablets perfect for work, entertainment, and creativity with cutting-edge technology.';
      case 'Mobile':
        return 'Find the perfect smartphone with advanced cameras, powerful processors, and innovative features.';
      default:
        return 'Browse our collection of premium tech products.';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculateDiscount = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4">
                  <div className="h-48 bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-gray-300 md:ml-2 capitalize">{category}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{getCategoryTitle()}</h1>
          <p className="text-gray-400">{getCategoryDescription()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Filter</h2>
              
              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Brand</h3>
                <div className="space-y-2">
                  {['Apple', 'Samsung', 'HP', 'Dell', 'Lenovo', 'ASUS', 'MSI', 'Acer'].map(brand => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        checked={filters.brand.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('brand', [...filters.brand, brand]);
                          } else {
                            handleFilterChange('brand', filters.brand.filter(b => b !== brand));
                          }
                        }}
                      />
                      <span className="ml-2 text-gray-300">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Price</h3>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Prices</option>
                  <option value="0-500">Under $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2000">$1,000 - $2,000</option>
                  <option value="2000+">Over $2,000</option>
                </select>
              </div>

              {/* Display Size Filter */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Display Size</h3>
                <div className="space-y-2">
                  {['13 inches', '14 inches', '15.6 inches', '16 inches', '17.3 inches'].map(size => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        checked={filters.displaySize.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('displaySize', [...filters.displaySize, size]);
                          } else {
                            handleFilterChange('displaySize', filters.displaySize.filter(s => s !== size));
                          }
                        }}
                      />
                      <span className="ml-2 text-gray-300">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Operating System Filter */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Operating System</h3>
                <div className="space-y-2">
                  {['Windows 11', 'Windows 10', 'macOS', 'Ubuntu', 'Free DOS'].map(os => (
                    <label key={os} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        checked={filters.operatingSystem.includes(os)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('operatingSystem', [...filters.operatingSystem, os]);
                          } else {
                            handleFilterChange('operatingSystem', filters.operatingSystem.filter(o => o !== os));
                          }
                        }}
                      />
                      <span className="ml-2 text-gray-300">{os}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* RAM Filter */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">RAM</h3>
                <div className="space-y-2">
                  {['4 GB', '8 GB', '16 GB', '32 GB', '64 GB'].map(ram => (
                    <label key={ram} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        checked={filters.ram.includes(ram)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('ram', [...filters.ram, ram]);
                          } else {
                            handleFilterChange('ram', filters.ram.filter(r => r !== ram));
                          }
                        }}
                      />
                      <span className="ml-2 text-gray-300">{ram}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">{products.length} items</span>
                  
                  {/* Sort By */}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="most-selling">Most Selling</option>
                      <option value="price-low">Price Low to High</option>
                      <option value="price-high">Price High to Low</option>
                      <option value="newest">Newest</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* View Mode */}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">View as:</span>
                    <div className="flex border border-gray-600 rounded">
                      <button
                        onClick={() => handleViewModeChange('grid')}
                        className={`px-3 py-1 text-sm transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:text-white'
                        }`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => handleViewModeChange('list')}
                        className={`px-3 py-1 text-sm transition-colors ${
                          viewMode === 'list'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:text-white'
                        }`}
                      >
                        List
                      </button>
                    </div>
                  </div>

                  {/* Items Per Page */}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={16}>16</option>
                      <option value={24}>24</option>
                      <option value={48}>48</option>
                    </select>
                    <span className="text-gray-400">per page</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <ProductListCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="mt-8 flex items-center justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.ceil(products.length / itemsPerPage))].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 rounded ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(products.length / itemsPerPage)}
                    className="px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}

            {products.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search criteria.</p>
                <button
                  onClick={() => setFilters({
                    brand: [],
                    priceRange: '',
                    displaySize: [],
                    operatingSystem: [],
                    processor: [],
                    ram: [],
                    graphicsCard: [],
                    hardDisk: []
                  })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Card Component for Grid View
const ProductCard = ({ product }) => {
  const discount = calculateDiscount(product.price, product.priceAfterDiscount);
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group border border-gray-700">
      <div className="relative">
        <img
          src={product.image || '/assets/default-product.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
          onError={(e) => { e.target.src = '/assets/default-product.jpg'; }}
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-bold">
            -{discount}%
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
          <span className="text-gray-400 text-sm">({product.reviews || 0} reviews)</span>
        </div>
        
        <div className="flex items-baseline mb-3">
          {product.priceAfterDiscount && product.priceAfterDiscount < product.price ? (
            <>
              <span className="text-xl font-bold text-blue-500">{formatPrice(product.priceAfterDiscount)}</span>
              <span className="text-gray-400 line-through ml-2">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-blue-500">{formatPrice(product.price)}</span>
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
};

// Product List Card Component for List View
const ProductListCard = ({ product }) => {
  const discount = calculateDiscount(product.price, product.priceAfterDiscount);
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-700">
      <div className="flex">
        <div className="flex-shrink-0">
          <img
            src={product.image || '/assets/default-product.jpg'}
            alt={product.name}
            className="w-48 h-48 object-cover"
            onError={(e) => { e.target.src = '/assets/default-product.jpg'; }}
          />
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
                {product.name}
              </h3>
              
              {product.brand && (
                <p className="text-gray-400 text-sm mb-3">{product.brand}</p>
              )}
              
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">({product.reviews || 0} reviews)</span>
              </div>
              
              <div className="flex items-baseline mb-4">
                {product.priceAfterDiscount && product.priceAfterDiscount < product.price ? (
                  <>
                    <span className="text-2xl font-bold text-blue-500">{formatPrice(product.priceAfterDiscount)}</span>
                    <span className="text-gray-400 line-through ml-3">{formatPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-blue-500">{formatPrice(product.price)}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${product.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                <Link
                  to={`/product/${product._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              {discount > 0 && (
                <div className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold">
                  -{discount}% OFF
                </div>
              )}
              {product.isExclusive && (
                <div className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-bold">
                  EXCLUSIVE
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export default ProductsPage; 