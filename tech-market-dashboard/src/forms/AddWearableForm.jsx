import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddWearableForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    const finalData = {
      ...data,
      discount: data.discount || 0,
      category: 'Wearables',
      productType: 'Wearable', 
      wearableType: data.wearableType,
      price: data.price.toString().replace(/,/g, '') 
    };
    
    if (finalData.features) {
      const featuresArray = finalData.features.split(',').map(item => item.trim());
      delete finalData.features;
      featuresArray.forEach((feature, index) => {
        formData.append(`features[${index}]`, feature);
      });
    }
    
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
      console.log('Submitting wearable data...');
      const response = await fetch('http://127.0.0.1:3000/api/product', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', errorData);
        throw new Error(`Failed to add wearable: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Product created successfully:', result);
      alert('Product added successfully!');
      // Reset form or redirect
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Wearable</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ['Name', 'name', { required: true }, 'text'],
          ['Product Code', 'productCode', { required: true }, 'text'],
          ['Referral Code', 'referralCode', {}, 'text'],
          ['Brand', 'brand', { required: true }, 'text'],
          ['Wearable Type', 'wearableType', { required: true }, 'select', [
            ['Smart Bands', 'SmartBand'],
            ['Smart Watch', 'SmartWatch']
          ]],
          ['Description', 'description', { required: true }, 'textarea'],
          ['Display', 'display', { required: true }, 'text'],
          ['Color', 'color', { required: true }, 'text'],
          ['Connectivity', 'connectivity', { required: true }, 'text'],
          ['Battery', 'battery', { required: true }, 'text'],
          ['Warranty', 'warranty', { required: true }, 'text'],
          ['Price', 'price', { required: true, pattern: /^[0-9,]+$/ }, 'text'],
          ['Quantity', 'quantity', { required: true, valueAsNumber: true }, 'number'],
          ['Discount', 'discount', { valueAsNumber: true }, 'number'],
        ].map(([label, name, validation, type, options]) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            {type === 'textarea' ? (
              <textarea 
                {...register(name, validation)}
                className="mt-1 p-2 border rounded-md" 
              />
            ) : type === 'select' ? (
              <select 
                {...register(name, validation)}
                className="mt-1 p-2 border rounded-md"
              >
                <option value="">Select {label}</option>
                {options.map(([optionLabel, optionValue]) => (
                  <option key={optionValue} value={optionValue}>{optionLabel}</option>
                ))}
              </select>
            ) : (
              <input 
                type={type} 
                {...register(name, validation)}
                className="mt-1 p-2 border rounded-md" 
              />
            )}
            {errors[name]?.type === 'required' && <span className="text-sm text-red-500 mt-1">This field is required</span>}
            {errors[name]?.type === 'pattern' && <span className="text-sm text-red-500 mt-1">Please enter a valid price</span>}
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
              required
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
      <div className="pt-4">
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition"
        >
          Add Wearable
        </button>
      </div>
    </form>
  );
}