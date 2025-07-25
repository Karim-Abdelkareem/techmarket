import React, { useState } from 'react';

export default function AddLaptopForm() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Laptop',
    productType: 'Laptop',
    productCode: '',
    referralCode: '',
    brand: '',
    price: '',
    description: '',
    color: '',
    warranty: '',
    quantity: '',
    processor: '',
    ram: '',
    hardDisk: '',
    graphicsCard: '',
    display: '',
    connectivity: '',
    speaker: '',
    ioPorts: '',
    operatingSystem: '',
    laptopType: ''
  });
  
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);

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
    const requiredFields = ['name', 'referralCode', 'price', 'quantity'];
    
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

    const submitData = new FormData();
    
    // Set default values for optional fields
    const finalData = {
      ...formData,
      brand: formData.brand || 'N/A',
      productCode: formData.productCode || 'N/A',
      description: formData.description || 'N/A',
      color: formData.color || 'N/A',
      warranty: formData.warranty || 'N/A',
      processor: formData.processor || 'N/A',
      ram: formData.ram || 'N/A',
      hardDisk: formData.hardDisk || 'N/A',
      graphicsCard: formData.graphicsCard || 'N/A',
      display: formData.display || 'N/A',
      connectivity: formData.connectivity || 'N/A',
      speaker: formData.speaker || 'N/A',
      ioPorts: formData.ioPorts || 'N/A',
      operatingSystem: formData.operatingSystem || 'N/A',
      laptopType: formData.laptopType || 'N/A'
    };
    
    // Append all form data
    Object.entries(finalData).forEach(([key, value]) => {
      submitData.append(key, value);
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
      console.log('Submitting laptop data...');
      const response = await fetch('https://techmarket-lovat.vercel.app/api/product', {
        method: 'POST',
        body: submitData,
          headers: {
            Authorization: token,
          },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', errorData);
        throw new Error(`Failed to add laptop: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Laptop created successfully:', result);
      alert('Laptop added successfully!');
      
      // Reset form
      setFormData({
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
        processor: '',
        ram: '',
        hardDisk: '',
        graphicsCard: '',
        display: '',
        connectivity: '',
        speaker: '',
        ioPorts: '',
        operatingSystem: '',
        laptopType: ''
      });
      setImages([]);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
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
    ['Name*', 'name', 'text', true],
    ['Product Code', 'productCode'],
    ['Referral Code*', 'referralCode', 'text', true],
    ['Brand', 'brand'],
    ['Price*', 'price', 'number', true],
    ['Description', 'description', 'textarea'],
    ['Color', 'color'],
    ['Warranty', 'warranty'],
    ['Quantity*', 'quantity', 'number', true],
    ['Processor', 'processor'],
    ['RAM', 'ram'],
    ['Hard Disk', 'hardDisk'],
    ['Graphics Card', 'graphicsCard'],
    ['Display', 'display', 'textarea'],
    ['Connectivity', 'connectivity'],
    ['Speaker', 'speaker'],
    ['I/O Ports', 'ioPorts', 'textarea'],
    ['Operating System', 'operatingSystem'],
    ['Laptop Type', 'laptopType'],
  ];

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Laptop</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map(([label, name, type = 'text', isRequired = false]) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            {type === 'textarea' ? (
              <textarea 
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                rows="3"
                placeholder="N/A"
              />
            ) : (
              <input 
                type={type} 
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="N/A"
              />
            )}
            {errors[name] && <span className="text-sm text-red-500 mt-1">This field is required</span>}
          </div>
        ))}
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
      <div className="pt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 shadow-md"
        >
          Add Laptop
        </button>
      </div>
    </div>
  );
}