import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTradeIn, getProducts } from '../../services/api';
import toast from 'react-hot-toast';

const TradeInPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    productType: '',
    specs: {},
    replacement: ''
  });

  const categories = [
    { id: 'MobileTablet', name: 'Mobile & Tablets', icon: '📱' },
    { id: 'Laptop', name: 'Laptops', icon: '💻' },
    { id: 'Accessories', name: 'Accessories', icon: '🔧' },
    { id: 'Wearables', name: 'Wearables', icon: '⌚' },
    { id: 'Audio', name: 'Audio', icon: '🎧' },
    { id: 'Gaming', name: 'Gaming', icon: '🎮' }
  ];

  const productTypes = {
    MobileTablet: ['Mobile', 'Tablet'],
    Laptop: ['Laptop'],
    Accessories: ['Cable', 'Charger', 'PowerBank', 'CaseCover', 'ScreenProtector'],
    Wearables: ['Apple Watch', 'Samsung Galaxy Watch', 'Fitbit', 'Garmin', 'Xiaomi Band'],
    Audio: ['AirPods', 'Samsung Buds', 'Sony', 'Bose', 'JBL', 'Beats'],
    Gaming: ['PlayStation', 'Xbox', 'Nintendo', 'Gaming PC', 'Gaming Accessories']
  };

  // Dynamic specs based on productType - using actual model schemas
  const getSpecsFields = (productType) => {
    const specsMap = {
      // Mobile & Tablet specs based on MobileTabletModel
      Mobile: [
        { name: 'name', label: 'Device Name', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'simCard', label: 'SIM Card Type', type: 'text', required: false },
        { name: 'screen', label: 'Screen Size & Type', type: 'text', required: false },
        { name: 'ram', label: 'RAM', type: 'text', required: true },
        { name: 'internalMemory', label: 'Internal Memory', type: 'text', required: true },
        { name: 'rearCamera', label: 'Rear Camera', type: 'text', required: false },
        { name: 'selfieCamera', label: 'Selfie Camera', type: 'text', required: false },
        { name: 'chipset', label: 'Chipset', type: 'text', required: false },
        { name: 'cpu', label: 'CPU', type: 'text', required: false },
        { name: 'cpuSpeedGHz', label: 'CPU Speed (GHz)', type: 'number', required: false },
        { name: 'gpu', label: 'GPU', type: 'text', required: false },
        { name: 'operatingSystem', label: 'Operating System', type: 'text', required: false },
        { name: 'productWarranty', label: 'Warranty', type: 'text', required: false },
        { name: 'videoResolutions', label: 'Video Resolution', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'sensor', label: 'Sensors', type: 'text', required: false }
      ],
      Tablet: [
        { name: 'name', label: 'Device Name', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'simCard', label: 'SIM Card Type', type: 'text', required: false },
        { name: 'screen', label: 'Screen Size & Type', type: 'text', required: true },
        { name: 'ram', label: 'RAM', type: 'text', required: true },
        { name: 'internalMemory', label: 'Internal Memory', type: 'text', required: true },
        { name: 'rearCamera', label: 'Rear Camera', type: 'text', required: false },
        { name: 'selfieCamera', label: 'Selfie Camera', type: 'text', required: false },
        { name: 'chipset', label: 'Chipset', type: 'text', required: false },
        { name: 'cpu', label: 'CPU', type: 'text', required: false },
        { name: 'cpuSpeedGHz', label: 'CPU Speed (GHz)', type: 'number', required: false },
        { name: 'gpu', label: 'GPU', type: 'text', required: false },
        { name: 'operatingSystem', label: 'Operating System', type: 'text', required: false },
        { name: 'productWarranty', label: 'Warranty', type: 'text', required: false },
        { name: 'videoResolutions', label: 'Video Resolution', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'sensor', label: 'Sensors', type: 'text', required: false }
      ],
      // Laptop specs based on LaptopModel
      Laptop: [
        { name: 'name', label: 'Device Name', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'processor', label: 'Processor', type: 'text', required: true },
        { name: 'ram', label: 'RAM', type: 'text', required: true },
        { name: 'hardDisk', label: 'Hard Disk/SSD', type: 'text', required: true },
        { name: 'graphicsCard', label: 'Graphics Card', type: 'text', required: false },
        { name: 'display', label: 'Display', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'speaker', label: 'Speaker', type: 'text', required: false },
        { name: 'ioPorts', label: 'I/O Ports', type: 'text', required: false },
        { name: 'operatingSystem', label: 'Operating System', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      // Accessories specs based on their respective models
      Cable: [
        { name: 'name', label: 'Cable Name', type: 'text', required: true },
        { name: 'from', label: 'From (Port)', type: 'text', required: false },
        { name: 'to', label: 'To (Port)', type: 'text', required: false },
        { name: 'cableLength', label: 'Cable Length', type: 'text', required: false },
        { name: 'cableType', label: 'Cable Type', type: 'text', required: true },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false }
      ],
      Charger: [
        { name: 'name', label: 'Charger Name', type: 'text', required: true },
        { name: 'input', label: 'Input', type: 'text', required: false },
        { name: 'power', label: 'Power', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'chargerType', label: 'Charger Type', type: 'text', required: true },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false }
      ],
      PowerBank: [
        { name: 'name', label: 'Power Bank Name', type: 'text', required: true },
        { name: 'capacity', label: 'Capacity', type: 'text', required: true },
        { name: 'input', label: 'Input', type: 'text', required: false },
        { name: 'output', label: 'Output', type: 'text', required: false },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'powerBankType', label: 'Power Bank Type', type: 'text', required: true },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false }
      ],
      CaseCover: [
        { name: 'name', label: 'Case Name', type: 'text', required: true },
        { name: 'compatibleWith', label: 'Compatible With', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'material', label: 'Material', type: 'text', required: true }
      ],
      ScreenProtector: [
        { name: 'name', label: 'Screen Protector Name', type: 'text', required: true },
        { name: 'compatibleWith', label: 'Compatible With', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'material', label: 'Material', type: 'text', required: true }
      ],
      // Wearables specs based on WearableSchema
      'Apple Watch': [
        { name: 'name', label: 'Watch Name', type: 'text', required: true },
        { name: 'display', label: 'Display', type: 'text', required: false },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false },
        { name: 'battery', label: 'Battery', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      'Samsung Galaxy Watch': [
        { name: 'name', label: 'Watch Name', type: 'text', required: true },
        { name: 'display', label: 'Display', type: 'text', required: false },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false },
        { name: 'battery', label: 'Battery', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      Fitbit: [
        { name: 'name', label: 'Device Name', type: 'text', required: true },
        { name: 'display', label: 'Display', type: 'text', required: false },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false },
        { name: 'battery', label: 'Battery', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      Garmin: [
        { name: 'name', label: 'Device Name', type: 'text', required: true },
        { name: 'display', label: 'Display', type: 'text', required: false },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false },
        { name: 'battery', label: 'Battery', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      'Xiaomi Band': [
        { name: 'name', label: 'Band Name', type: 'text', required: true },
        { name: 'display', label: 'Display', type: 'text', required: false },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false },
        { name: 'battery', label: 'Battery', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      // Audio specs based on AudioModel
      AirPods: [
        { name: 'name', label: 'AirPods Name', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'company', label: 'Company', type: 'text', required: false },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      'Samsung Buds': [
        { name: 'name', label: 'Buds Name', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'company', label: 'Company', type: 'text', required: false },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      Sony: [
        { name: 'name', label: 'Device Name', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'company', label: 'Company', type: 'text', required: false },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      Bose: [
        { name: 'name', label: 'Device Name', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'company', label: 'Company', type: 'text', required: false },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      JBL: [
        { name: 'name', label: 'Device Name', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'company', label: 'Company', type: 'text', required: false },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      Beats: [
        { name: 'name', label: 'Device Name', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false },
        { name: 'connectivity', label: 'Connectivity', type: 'text', required: false },
        { name: 'company', label: 'Company', type: 'text', required: false },
        { name: 'features', label: 'Features (comma separated)', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      // Gaming specs based on GamingModel
      PlayStation: [
        { name: 'name', label: 'Console Name', type: 'text', required: true },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      Xbox: [
        { name: 'name', label: 'Console Name', type: 'text', required: true },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      Nintendo: [
        { name: 'name', label: 'Console Name', type: 'text', required: true },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      'Gaming PC': [
        { name: 'name', label: 'PC Name', type: 'text', required: true },
        { name: 'processor', label: 'Processor', type: 'text', required: true },
        { name: 'ram', label: 'RAM', type: 'text', required: true },
        { name: 'hardDisk', label: 'Hard Disk/SSD', type: 'text', required: true },
        { name: 'graphicsCard', label: 'Graphics Card', type: 'text', required: false },
        { name: 'display', label: 'Display', type: 'text', required: false },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ],
      'Gaming Accessories': [
        { name: 'name', label: 'Accessory Name', type: 'text', required: true },
        { name: 'type', label: 'Type', type: 'text', required: true },
        { name: 'warranty', label: 'Warranty', type: 'text', required: false }
      ]
    };

    return specsMap[productType] || [];
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      console.log('Fetched products:', response.data);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'category') {
      setFormData({
        ...formData,
        category: value,
        productType: '',
        specs: {}
      });
    } else if (field === 'productType') {
      setFormData({
        ...formData,
        productType: value,
        specs: {}
      });
    } else if (field.startsWith('specs.')) {
      const specField = field.split('.')[1];
      setFormData({
        ...formData,
        specs: {
          ...formData.specs,
          [specField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.productType || !formData.replacement) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate specs
    const requiredSpecs = getSpecsFields(formData.productType).filter(spec => spec.required);
    const missingSpecs = requiredSpecs.filter(spec => !formData.specs[spec.name]);
    
    if (missingSpecs.length > 0) {
      toast.error(`Please fill in: ${missingSpecs.map(spec => spec.label).join(', ')}`);
      return;
    }

    try {
      setLoading(true);
      
      // Format the data according to the new structure
      const tradeInData = {
        category: formData.category,
        productType: formData.productType,
        specs: formData.specs,
        replacement: formData.replacement
      };

      await createTradeIn(tradeInData);
      toast.success('Trade-in request submitted successfully!');
      navigate('/user-account');
    } catch (error) {
      console.error('Error submitting trade-in:', error);
      toast.error('Failed to submit trade-in request');
    } finally {
      setLoading(false);
    }
  };

  const renderSpecField = (spec) => {
    return (
      <input
        type={spec.type}
        value={formData.specs[spec.name] || ''}
        onChange={(e) => handleInputChange(`specs.${spec.name}`, e.target.value)}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={spec.label}
        required={spec.required}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Trade-In Your Device</h1>
            <p className="text-gray-300 text-lg">Get value for your old device and upgrade to something new!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-200 mb-4">Device Category *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleInputChange('category', category.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                      formData.category === category.id
                        ? 'border-blue-500 bg-blue-600 text-white shadow-lg'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <div className="text-sm font-medium">{category.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Type Selection */}
            {formData.category && (
              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-4">Product Type *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {productTypes[formData.category]?.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('productType', type)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        formData.productType === type
                          ? 'border-blue-500 bg-blue-600 text-white shadow-lg'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Device Specifications */}
            {formData.category && formData.productType && (
              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-4">Device Specifications *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getSpecsFields(formData.productType).map((spec) => (
                    <div key={spec.name}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {spec.label} {spec.required && <span className="text-red-400">*</span>}
                      </label>
                      {renderSpecField(spec)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Replacement Product Selection */}
            {formData.category && (
              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-4">Choose Replacement Product *</label>
                {(() => {
                  const filteredProducts = products.filter(product => {
                    // Map form categories to actual product categories
                    if (formData.category === 'MobileTablet') {
                      return product.category === 'Mobile' || product.category === 'Tablet';
                    }
                    return product.category === formData.category;
                  });

                  if (filteredProducts.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <p className="text-gray-300 text-lg">No replacement products available</p>
                        <p className="text-gray-400 text-sm">Please try a different category or check back later</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.slice(0, 6).map((product) => (
                        <div
                          key={product._id}
                          onClick={() => handleInputChange('replacement', product._id)}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                            formData.replacement === product._id
                              ? 'border-blue-500 bg-blue-600'
                              : 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600'
                          }`}
                        >
                          <img
                            src={product.image || '/assets/default-product.jpg'}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                            onError={(e) => { e.target.src = '/assets/default-product.jpg'; }}
                          />
                          <h3 className="font-semibold text-white mb-2 text-lg">{product.name}</h3>
                          <p className="text-gray-300 text-sm mb-3">{product.brand}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-blue-400 font-bold text-lg">
                              ${product.priceAfterDiscount || product.price}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-red-400 text-sm font-medium">-{product.discount}%</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-8 border-t border-gray-600">
              <button
                type="submit"
                disabled={loading || !formData.category || !formData.productType || !formData.replacement}
                className="bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg font-semibold hover:scale-105"
              >
                {loading ? 'Submitting...' : 'Submit Trade-In Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TradeInPage; 