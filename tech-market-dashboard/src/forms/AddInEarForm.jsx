import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddInEarForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: 'Apple AirPods Max',
      productCode: 'N0XZ2LTJE3',
      referralCode: 'K6PE1DGVO5',
      brand: 'Apple',
      color: 'Purple',
      connectivity: '802.11n',
      warranty: '1 year manufacturer warranty',
      description: 'Apple AirPods Max Wireless Over-Ear Headphones, Pro-Level Active Noise Cancellation, Transparency Mode, Personalized Spatial Audio, USB-C Charging, Bluetooth Headphones for iPhone – Purple',
      price: 47424,
      quantity: 200,
      features: 'Pro-Level Active Noise Cancellation, Transparency Mode'
    }
  });
  const [images, setImages] = useState([]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    // Set default values for optional fields
    const finalData = {
      ...data,
      discount: data.discount || 0,
      productType: 'Audio',
      category: 'Audio',
      audioType: 'InEar',
      brand: data.brand || 'N/A',
      color: data.color || 'N/A',
      connectivity: data.connectivity || 'N/A',
      warranty: data.warranty || 'N/A',
      description: data.description || 'N/A',
      productCode: data.productCode || 'N/A'
    };
    
    // Handle features as array
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
      console.log('Submitting in-ear headphones data...');
      const response = await fetch('https://techmarket-lovat.vercel.app/api/product', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', errorData);
        throw new Error(`Failed to add in-ear headphones: ${errorData.message || response.statusText}`);
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
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New In-Ear Headphones</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ['Name*', 'name', 'text', true],
          ['Product Code', 'productCode', 'text', false],
          ['Referral Code*', 'referralCode', 'text', true],
          ['Brand', 'brand', 'text', false],
          ['Color', 'color', 'text', false],
          ['Connectivity', 'connectivity', 'text', false],
          ['Warranty', 'warranty', 'text', false],
          ['Description', 'description', 'textarea', false],
          ['Price*', 'price', 'number', true],
          ['Quantity*', 'quantity', 'number', true],
          ['Discount', 'discount', 'number', false],
        ].map(([label, name, type = 'text', isRequired = false]) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            {type === 'textarea' ? (
              <textarea 
                {...register(name, { required: name !== 'discount' && name !== 'referralCode' })}
                className="mt-1 p-2 border rounded-md" 
              />
            ) : type === 'checkbox' ? (
              <div className="mt-1">
                <input 
                  type="checkbox" 
                  {...register(name)}
                  className="mr-2" 
                />
                <span className="text-sm text-gray-600">Yes</span>
              </div>
            ) : (
              <input 
                type={type} 
                {...register(name, { 
                  required: isRequired,
                  valueAsNumber: type === 'number'
                })}
                className="mt-1 p-2 border rounded-md" 
                placeholder={!isRequired ? "N/A" : ""}
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
          Add In-Ear Headphones
        </button>
      </div>
    </form>
  );
}