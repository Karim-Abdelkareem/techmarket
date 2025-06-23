import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

export default function UpdateMobileForm({ product, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load product data when component mounts
  useEffect(() => {
    if (product) {
      // Reset form with product data
      reset({
        name: product.name || '',
        category: product.category || '',
        productType: product.productType || '',
        productCode: product.productCode || '',
        referralCode: product.referralCode || '',
        brand: product.brand || '',
        deviceType: product.deviceType || '',
        description: product.description || '',
        color: product.color || '',
        simCard: product.simCard || '',
        screen: product.screen || '',
        ram: product.ram || '',
        internalMemory: product.internalMemory || '',
        rearCamera: product.rearCamera || '',
        selfieCamera: product.selfieCamera || '',
        chipset: product.chipset || '',
        cpu: product.cpu || '',
        cpuSpeedGHz: product.cpuSpeedGHz || '',
        gpu: product.gpu || '',
        operatingSystem: product.operatingSystem || '',
        productWarranty: product.productWarranty || '',
        videoResolutions: product.videoResolutions || '',
        connectivity: product.connectivity || '',
        sensor: product.sensor || '',
        price: product.price || '',
        quantity: product.quantity || '',
        discount: product.discount || 0
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    
    // Set default discount to 0 if not provided
    const finalData = {
      ...data,
      discount: data.discount || 0
    };
    
    // Append all form data
    Object.entries(finalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Handle image files
    if (images.length > 0) {
      // First image as main image
      formData.append('image', images[0]);
      
      // Additional images
      for (let i = 1; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    const token = localStorage.getItem('token'); 

    try {
      console.log('Updating product data...');
      const response = await fetch(`http://127.0.0.1:3000/api/product/${product._id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', errorData);
        throw new Error(`Failed to update mobile: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Product updated successfully:', result);
      alert('Product updated successfully!');
      
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Update Mobile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ['Name', 'name'],
          ['Category', 'category'],
          ['Product Type', 'productType'],
          ['Product Code', 'productCode'],
          ['Referral Code', 'referralCode'],
          ['Brand', 'brand'],
          ['Device Type', 'deviceType'],
          ['Description', 'description', 'textarea'],
          ['Color', 'color'],
          ['SIM Card', 'simCard'],
          ['Screen', 'screen'],
          ['RAM', 'ram'],
          ['Internal Memory', 'internalMemory'],
          ['Rear Camera', 'rearCamera'],
          ['Selfie Camera', 'selfieCamera'],
          ['Chipset', 'chipset'],
          ['CPU', 'cpu'],
          ['CPU Speed (GHz)', 'cpuSpeedGHz'],
          ['GPU', 'gpu'],
          ['Operating System', 'operatingSystem'],
          ['Product Warranty', 'productWarranty'],
          ['Video Resolutions', 'videoResolutions'],
          ['Connectivity', 'connectivity'],
          ['Sensor', 'sensor'],
          ['Price', 'price', 'number'],
          ['Quantity', 'quantity', 'number'],
          ['Discount', 'discount', 'number'],
        ].map(([label, name, type = 'text']) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            {type === 'textarea' ? (
              <textarea 
                {...register(name, { required: true })}
                className="mt-1 p-2 border rounded-md" 
              />
            ) : (
              <input 
                type={type} 
                {...register(name, { 
                  required: name !== 'discount',
                  valueAsNumber: type === 'number'
                })}
                className="mt-1 p-2 border rounded-md" 
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
              onChange={handleImageChange} 
              className="block w-full text-sm text-gray-700 file:bg-gray-100 file:border file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Additional Images</label>
            <input 
              type="file" 
              multiple 
              name="images"
              onChange={handleImageChange} 
              className="block w-full text-sm text-gray-700 file:bg-gray-100 file:border file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer" 
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
                className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
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
                    className="h-20 w-20 object-cover rounded border border-gray-200" 
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
          disabled={loading}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Mobile'}
        </button>
      </div>
    </form>
  );
}