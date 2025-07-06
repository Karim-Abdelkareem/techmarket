import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

export default function UpdateCableForm({ product, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load product data when component mounts
  useEffect(() => {
    if (product) {
      // Reset form with product data
      reset({
        name: product.name || '',
        productCode: product.productCode || '',
        referralCode: product.referralCode || '',
        brand: product.brand || '',
        from: product.from || '',
        to: product.to || '',
        cableLength: product.cableLength || '',
        cableType: product.cableType || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        features: product.features ? product.features.join(', ') : ''
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    
    // Only include the specific fields required
    const finalData = {
      name: data.name,
      category: 'Accessories',
      productType: 'Cable',
      productCode: data.productCode,
      referralCode: data.referralCode,
      price: data.price,
      description: data.description,
      quantity: data.quantity,
      brand: data.brand,
      from: data.from,
      to: data.to,
      cableLength: data.cableLength,
      cableType: data.cableType
    };
    
    // Handle features as array
    if (data.features) {
      const featuresArray = data.features.split(',').map(item => item.trim());
      featuresArray.forEach((feature, index) => {
        formData.append(`features[${index}]`, feature);
      });
    }
    
    // Append all form data
    Object.entries(finalData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
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
      console.log('Updating cable data...');
      const response = await fetch(`https://techmarket-lovat.vercel.app/api/product/${product._id}`, {
        method: 'PATCH',
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', errorData);
        throw new Error(`Failed to update cable: ${errorData.message || response.statusText}`);
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
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Update Cable</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ['Name', 'name'],
          ['Product Code', 'productCode'],
          ['Referral Code', 'referralCode'],
          ['Brand', 'brand'],
          ['From', 'from'],
          ['To', 'to'],
          ['Cable Length', 'cableLength'],
          ['Cable Type', 'cableType'],
          ['Description', 'description', 'textarea'],
          ['Price', 'price', 'number'],
          ['Quantity', 'quantity', 'number'],
        ].map(([label, name, type = 'text']) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            {type === 'textarea' ? (
              <textarea 
                {...register(name, { required: name !== 'discount' && name !== 'referralCode' })}
                className="mt-1 p-2 border rounded-md" 
              />
            ) : (
              <input 
                type={type} 
                {...register(name, { 
                  required: name !== 'discount' && name !== 'referralCode',
                  valueAsNumber: type === 'number'
                })}
                className="mt-1 p-2 border rounded-md" 
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
          {...register('features')}
          placeholder="Enter features separated by commas"
          className="mt-1 p-2 border rounded-md w-full"
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
          {loading ? 'Updating...' : 'Update Cable'}
        </button>
      </div>
    </form>
  );
}