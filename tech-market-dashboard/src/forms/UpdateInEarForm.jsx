import React, { useState, useEffect } from 'react';

export default function UpdateInEarForm({ product, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    productType: '',
    productCode: '',
    referralCode: '',
    brand: '',
    price: '',
    description: '',
    color: '',
    warranty: '',
    quantity: '',
    connectivity: '',
    discount: '',
    features: '',
    audioType: 'InEar'
  });
  
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load product data when component mounts
  useEffect(() => {
    if (product) {
      // Convert features array to comma-separated string if it exists
      const featuresString = product.features && Array.isArray(product.features)
        ? product.features.join(', ')
        : '';

      setFormData({
        name: product.name || '',
        category: product.category || '',
        productType: product.productType || '',
        productCode: product.productCode || '',
        referralCode: product.referralCode || '',
        brand: product.brand || '',
        price: product.price || '',
        description: product.description || '',
        color: product.color || '',
        warranty: product.warranty || '',
        quantity: product.quantity || '',
        connectivity: product.connectivity || '',
        discount: product.discount || '',
        features: featuresString,
        audioType: 'InEar'
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'category', 'productType', 'productCode', 'brand', 'price', 'description', 'color', 'warranty', 'quantity', 'connectivity'];
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = true;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const submitData = new FormData();
    
    // Handle features as array
    if (formData.features) {
      const featuresArray = formData.features.split(',').map(item => item.trim());
      featuresArray.forEach((feature, index) => {
        submitData.append(`features[${index}]`, feature);
      });
    }

    // Append all other form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'features') { // Skip features as we've already handled it
        submitData.append(key, value);
      }
    });
    
    // Handle image files
    if (images.length > 0) {
      // First image as main image
      submitData.append('image', images[0]);
      
      // Additional images
      for (let i = 1; i < images.length; i++) {
        submitData.append('images', images[i]);
      }
    }
    const token = localStorage.getItem('token'); 

    try {
      console.log('Updating in-ear headphones data...');
      const response = await fetch(`http://127.0.0.1:3000/api/product/${product._id}`, {
        method: 'PATCH',
        body: submitData,
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', errorData);
        throw new Error(`Failed to update in-ear headphones: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('In-ear headphones updated successfully:', result);
      alert('In-ear headphones updated successfully!');
      
      // Close the modal
      onClose();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...files]);
  };
  
  const clearImages = () => {
    setImages([]);
  };

  const formFields = [
    ['Name', 'name'],
    ['Category', 'category'],
    ['Product Type', 'productType'],
    ['Product Code', 'productCode'],
    ['Referral Code', 'referralCode'],
    ['Brand', 'brand'],
    ['Price', 'price', 'number'],
    ['Description', 'description', 'textarea'],
    ['Color', 'color'],
    ['Warranty', 'warranty'],
    ['Quantity', 'quantity', 'number'],
    ['Connectivity', 'connectivity'],
    ['Discount', 'discount', 'number'],
  ];

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Update In-Ear Headphones</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map(([label, name, type = 'text']) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            {type === 'textarea' ? (
              <textarea 
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                rows="3"
              />
            ) : (
              <input 
                type={type} 
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            )}
            {errors[name] && <span className="text-sm text-red-500 mt-1">This field is required</span>}
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="col-span-2">
        <label className="text-sm font-medium text-gray-600">Features (comma separated)</label>
        <textarea
          name="features"
          value={formData.features}
          onChange={handleInputChange}
          placeholder="Enter features separated by commas"
          className="mt-1 p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Images Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Main Image</label>
            <input 
              type="file" 
              name="image"
              accept="image/*"
              onChange={handleImageChange} 
              className="block w-full text-sm text-gray-700 file:bg-gray-100 file:border file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-gray-200" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Additional Images</label>
            <input 
              type="file" 
              multiple 
              name="images"
              accept="image/*"
              onChange={handleImageChange} 
              className="block w-full text-sm text-gray-700 file:bg-gray-100 file:border file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-gray-200" 
            />
          </div>
        </div>
        
        {/* Current Image Preview */}
        {product?.image && images.length === 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Current Image</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="relative group">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-40 w-auto object-cover rounded border border-gray-200 shadow-sm" 
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Selected Images Preview */}
        {images.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">Selected Images ({images.length})</h3>
              <button 
                type="button" 
                onClick={clearImages}
                className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={`Preview ${index}`} 
                    className="h-20 w-20 object-cover rounded border border-gray-200 shadow-sm" 
                  />
                  {index === 0 && (
                    <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors duration-200 shadow-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update In-Ear Headphones'}
        </button>
      </div>
    </div>
  );
}