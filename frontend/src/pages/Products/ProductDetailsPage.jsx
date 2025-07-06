import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProductsByCategory, addToCart } from '../../services/api';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedTab, setSelectedTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProductById(id);
        // Handle different response structures
        const productData = response.data || response;
        if (!productData) {
          setError('Product not found');
        } else {
          setProduct(productData);
          // Fetch related products after main product is loaded
          fetchRelatedProducts(productData);
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        if (error.response) {
          // Handle specific HTTP error codes
          if (error.response.status === 404) {
            setError('Product not found');
          } else if (error.response.status === 401) {
            setError('You need to be logged in to view this product');
          } else {
            setError(`Error: ${error.response.data?.message || 'Failed to load product details'}`);
          }
        } else if (error.request) {
          // Network error
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Function to fetch related products based on the same category
  const fetchRelatedProducts = async (currentProduct) => {
    if (!currentProduct.category) return;
    
    setRelatedProductsLoading(true);
    try {
      const response = await getProductsByCategory(currentProduct.category);
      const products = response.data || response;
      
      // Filter out the current product and limit to 4 related products
      const filteredProducts = products
        .filter(p => p._id !== currentProduct._id)
        .slice(0, 4);
      
      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error('Failed to fetch related products:', error);
      setRelatedProducts([]);
    } finally {
      setRelatedProductsLoading(false);
    }
  };

  // Function to render key specifications based on product type
  const renderKeySpecifications = () => {
    if (!product) return null;

    // Get product type from category or model type
    const productType = product.category || product.__t || 'general';
    
    // Define key specs for each product type
    const keySpecs = {
      'Laptop': [
        { key: 'laptopType', label: 'Type' },
        { key: 'processor', label: 'Processor' },
        { key: 'ram', label: 'RAM' },
        { key: 'hardDisk', label: 'Storage' },
        { key: 'graphicsCard', label: 'Graphics' },
        { key: 'display', label: 'Display' },
        { key: 'operatingSystem', label: 'OS' },
        { key: 'warranty', label: 'Warranty' }
      ],
      'Mobile': [
        { key: 'deviceType', label: 'Device Type' },
        { key: 'screen', label: 'Screen' },
        { key: 'ram', label: 'RAM' },
        { key: 'internalMemory', label: 'Storage' },
        { key: 'rearCamera', label: 'Rear Camera' },
        { key: 'selfieCamera', label: 'Front Camera' },
        { key: 'chipset', label: 'Chipset' },
        { key: 'operatingSystem', label: 'OS' },
        { key: 'battery', label: 'Battery' }
      ],
      'Tablet': [
        { key: 'deviceType', label: 'Device Type' },
        { key: 'screen', label: 'Screen' },
        { key: 'ram', label: 'RAM' },
        { key: 'internalMemory', label: 'Storage' },
        { key: 'rearCamera', label: 'Rear Camera' },
        { key: 'selfieCamera', label: 'Front Camera' },
        { key: 'chipset', label: 'Chipset' },
        { key: 'operatingSystem', label: 'OS' },
        { key: 'battery', label: 'Battery' }
      ],
      'Wearables': [
        { key: 'wearableType', label: 'Type' },
        { key: 'display', label: 'Display' },
        { key: 'connectivity', label: 'Connectivity' },
        { key: 'battery', label: 'Battery' },
        { key: 'features', label: 'Features' },
        { key: 'warranty', label: 'Warranty' }
      ],
      'Audio': [
        { key: 'audioType', label: 'Type' },
        { key: 'connectivity', label: 'Connectivity' },
        { key: 'company', label: 'Company' },
        { key: 'features', label: 'Features' },
        { key: 'warranty', label: 'Warranty' }
      ],
      'Cable': [
        { key: 'from', label: 'From' },
        { key: 'to', label: 'To' },
        { key: 'cableLength', label: 'Length' },
        { key: 'cableType', label: 'Type' },
        { key: 'features', label: 'Features' }
      ],
      'Charger': [
        { key: 'input', label: 'Input' },
        { key: 'power', label: 'Power' },
        { key: 'chargerType', label: 'Type' },
        { key: 'features', label: 'Features' }
      ],
      'CaseCover': [
        { key: 'compatibleWith', label: 'Compatible With' },
        { key: 'material', label: 'Material' }
      ],
      'PowerBank': [
        { key: 'capacity', label: 'Capacity' },
        { key: 'input', label: 'Input' },
        { key: 'output', label: 'Output' },
        { key: 'powerBankType', label: 'Type' },
        { key: 'features', label: 'Features' }
      ],
      'ScreenProtector': [
        { key: 'compatibleWith', label: 'Compatible With' },
        { key: 'material', label: 'Material' }
      ]
    };

    // Get specs for the product type
    const specsToShow = keySpecs[productType] || [];

    // Filter and format the specs
    const formattedSpecs = specsToShow
      .map(spec => {
        const value = product[spec.key];
        if (value === null || value === undefined || value === '') {
          return null;
        }

        let formattedValue;
        if (Array.isArray(value)) {
          if (value.length === 0) return null;
          formattedValue = value.join(', ');
        } else if (typeof value === 'boolean') {
          formattedValue = value ? 'Yes' : 'No';
        } else {
          formattedValue = String(value);
        }

        return {
          ...spec,
          value: formattedValue
        };
      })
      .filter(Boolean);

    // If no specific specs found, fall back to general specs
    if (formattedSpecs.length === 0) {
      return renderGeneralSpecifications();
    }

    return (
      <div className="space-y-3">
        {formattedSpecs.map((spec) => (
          <div key={spec.key} className="flex justify-between py-2 border-b border-gray-700 last:border-b-0">
            <span className="text-gray-400 font-medium">{spec.label}:</span>
            <span className="text-white font-semibold text-right max-w-xs break-words">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Fallback function for general specifications
  const renderGeneralSpecifications = () => {
    if (!product) return null;

    // Get all product keys and filter out common fields that are displayed separately
    const skipFields = [
      '_id', 'id', 'name', 'price', 'priceAfterDiscount', 'discount', 'description', 
      'quantity', 'sold', 'image', 'images', 'category', 'brand', 'ratingsAverage', 
      'ratingsQuantity', 'createdAt', 'updatedAt', '__v', 'rating', 'reviews', 
      'slug', 'views', 'isExclusive', 'productCode', 'referralCode'
    ];

    // Get all product properties and filter out skipped fields and null/undefined values
    const productSpecs = Object.entries(product)
      .filter(([key, value]) => {
        return !skipFields.includes(key) && 
               value !== null && 
               value !== undefined && 
               value !== '' &&
               typeof value !== 'function';
      })
      .map(([key, value]) => {
        // Format the key for display (convert camelCase to Title Case)
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .replace(/([A-Z])/g, (match, p1) => ' ' + p1.toLowerCase())
          .replace(/^./, str => str.toUpperCase());

        // Format the value based on its type
        let formattedValue;
        if (typeof value === 'boolean') {
          formattedValue = value ? 'Yes' : 'No';
        } else if (value instanceof Date) {
          formattedValue = value.toLocaleDateString();
        } else if (Array.isArray(value)) {
          if (value.length === 0) return null;
          formattedValue = value.join(', ');
        } else if (typeof value === 'object' && value !== null) {
          // Handle nested objects (like dealer, company, etc.)
          try {
            if (value.name) {
              formattedValue = value.name;
            } else if (value.path) {
              // Handle dealer path specifically
              formattedValue = value.path;
            } else {
              const objEntries = Object.entries(value);
              if (objEntries.length === 0) return null;
              formattedValue = objEntries.map(([k, v]) => `${k}: ${v}`).join(', ');
            }
          } catch (error) {
            // If there's an error accessing the object, skip this field
            console.warn(`Error processing field ${key}:`, error);
            return null;
          }
        } else {
          formattedValue = String(value);
        }

        return { key, label: formattedKey, value: formattedValue };
      })
      .filter(Boolean); // Remove any null entries

    // If no specs found, show a message
    if (productSpecs.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-400">No specifications available for this product.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {productSpecs.map((spec) => (
          <div key={spec.key} className="flex justify-between py-2 border-b border-gray-700 last:border-b-0">
            <span className="text-gray-400 font-medium">{spec.label}:</span>
            <span className="text-white font-semibold text-right max-w-xs break-words">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Function to handle add to cart with referral code alert
  const handleAddToCart = async () => {
    if (product.quantity > 0) {
      // Show referral code if available
      if (product.referralCode) {
        setShowReferralModal(true);
      } else {
        try {
          await addToCart(product._id, quantity);
          toast.success(`Added ${quantity} item(s) to cart!`);
        } catch (error) {
          console.error('Error adding to cart:', error);
          toast.error('Failed to add to cart');
        }
      }
    }
  };

  // Function to handle modal close and add to cart
  const handleModalClose = async () => {
    setShowReferralModal(false);
    try {
      await addToCart(product._id, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
        <div className="bg-red-900/50 text-white p-6 rounded-lg max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p className="mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Prepare images for display with fallback
  const defaultImage = '/assets/default-product.jpg';
  const mainImage = product.image || defaultImage;
  const additionalImages = product.images || [];
  const productImages = [
    mainImage,
    ...additionalImages
  ].filter(Boolean); // Remove any null/undefined values

  // Calculate savings
  const originalPrice = product.price || 0;
  const discountedPrice = product.priceAfterDiscount || originalPrice;
  const savings = originalPrice - discountedPrice;
  const discountPercentage = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

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
                <Link to="/search" className="ml-1 text-gray-400 hover:text-white md:ml-2 transition-colors">
                  Products
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-gray-300 md:ml-2 truncate max-w-xs">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image Gallery */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <img 
                src={productImages[activeImage] || defaultImage} 
                alt={product.name || 'Product'} 
                className="w-full h-96 lg:h-[500px] object-contain p-4"
                onError={(e) => { e.target.src = defaultImage; }}
              />
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === index 
                        ? 'ring-2 ring-blue-500 border-blue-500' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name || 'Product'} thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = defaultImage; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                {product.isExclusive && (
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    EXCLUSIVE
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discountPercentage}% OFF
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">{product.name}</h1>
              
              {product.brand && (
                <div className="text-gray-400 text-lg mb-4">Brand: <span className="text-white font-semibold">{product.brand}</span></div>
              )}
            </div>
            
            {/* Rating */}
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white text-lg font-semibold mr-2">{product.rating || 'N/A'}</span>
              <span className="text-gray-400">({product.reviews || 0} reviews)</span>
              <span className="text-gray-500 ml-4">• {product.views || 0} views</span>
            </div>
            
            {/* Price Section */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-baseline mb-4">
                {discountedPrice < originalPrice ? (
                  <>
                    <span className="text-3xl font-bold text-blue-500">${discountedPrice}</span>
                    <span className="text-xl text-gray-400 line-through ml-3">${originalPrice}</span>
                    <span className="ml-3 bg-green-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                      Save ${savings}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-blue-500">${originalPrice}</span>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center mb-4">
                <span className="mr-2 text-white font-medium">Availability:</span>
                {product.quantity !== undefined && product.quantity > 0 ? (
                  <span className="text-green-500 font-semibold">✓ In Stock ({product.quantity} available)</span>
                ) : (
                  <span className="text-red-500 font-semibold">✗ Out of Stock</span>
                )}
              </div>

              {/* Quantity Selector */}
              {product.quantity > 0 && (
                <div className="flex items-center mb-4">
                  <span className="text-white font-medium mr-3">Quantity:</span>
                  <div className="flex items-center border border-gray-600 rounded-md">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-white hover:bg-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-white border-x border-gray-600">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="px-3 py-2 text-white hover:bg-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Product Code */}
            {product.productCode && (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <span className="text-gray-400">Product Code: </span>
                <span className="text-white font-mono font-semibold">{product.productCode}</span>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className={`flex-1 py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center ${
                  product.quantity !== undefined && product.quantity > 0 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-gray-500 cursor-not-allowed text-gray-300'
                }`}
                disabled={!product.quantity || product.quantity <= 0}
                onClick={handleAddToCart}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                {product.quantity !== undefined && product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                onClick={() => alert('Added to wishlist!')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Add to Wishlist
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <button className="flex items-center hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Compare
              </button>
              <button className="flex items-center hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setSelectedTab('description')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                selectedTab === 'description'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setSelectedTab('specifications')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                selectedTab === 'specifications'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setSelectedTab('reviews')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                selectedTab === 'reviews'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'description' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Product Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Product Specifications</h3>
                <div className="bg-gray-900 rounded-lg p-6">
                  {renderKeySpecifications()}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews</h3>
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">You May Also Like</h2>
          {relatedProductsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <div className="w-full h-48 bg-gray-700 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded animate-pulse mb-3"></div>
                    <div className="h-6 bg-gray-700 rounded animate-pulse mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct._id} 
                  to={`/product/${relatedProduct._id}`}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group border border-gray-700"
                >
                  <div className="relative">
                    <img 
                      src={relatedProduct.image || '/assets/default-product.jpg'} 
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.target.src = '/assets/default-product.jpg'; }}
                    />
                    {relatedProduct.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-bold">
                        -{relatedProduct.discount}%
                      </div>
                    )}
                    {relatedProduct.isExclusive && (
                      <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-sm font-bold">
                        EXCLUSIVE
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    
                    {relatedProduct.brand && (
                      <p className="text-gray-400 text-sm mb-2">{relatedProduct.brand}</p>
                    )}
                    
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">({relatedProduct.reviews || 0} reviews)</span>
                    </div>
                    
                    <div className="flex items-baseline mb-3">
                      {relatedProduct.priceAfterDiscount && relatedProduct.priceAfterDiscount < relatedProduct.price ? (
                        <>
                          <span className="text-xl font-bold text-blue-500">${relatedProduct.priceAfterDiscount}</span>
                          <span className="text-gray-400 line-through ml-2">${relatedProduct.price}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-blue-500">${relatedProduct.price}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${relatedProduct.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {relatedProduct.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-400">No related products found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Referral Code Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Special Offer!</h3>
              <p className="text-gray-300 mb-4">
                Use this referral code to get special discounts on your purchase:
              </p>
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <span className="text-2xl font-mono font-bold text-blue-400 tracking-wider">
                  {product.referralCode}
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleModalClose}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Continue to Cart
                </button>
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;