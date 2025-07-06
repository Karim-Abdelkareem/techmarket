import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddScreenProtectorForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    // Set default values for optional fields
    const finalData = {
      ...data,
      discount: data.discount || 0,
      category: data.category || 'Accessories',
      productType: data.productType || 'ScreenProtector',
      productCode: data.productCode || 'N/A',
      brand: data.brand || 'N/A',
      compatibleWith: data.compatibleWith || 'N/A',
      color: data.color || 'N/A',
      material: data.material || 'N/A',
      description: data.description || 'N/A'
    };
    
    // Append all form data
    Object.entries(finalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Handle image files
    if (images.length > 0) {
      formData.append('image', images[0]); // First image as main image
      for (let i = 1; i < images.length; i++) {
        formData.append('images', images[i]); // Additional images
      }
    }

    const token = localStorage.getItem('token'); 

    try {
      console.log('Submitting screen protector data...', finalData);
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
        throw new Error(`Failed to add screen protector: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Product created successfully:', result);
      alert('Screen protector added successfully!');
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
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Screen Protector</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ['Category', 'category', 'text', false],
          ['Product Type', 'productType', 'text', false],
          ['Name*', 'name', 'text', true],
          ['Product Code', 'productCode', 'text', false],
          ['Referral Code*', 'referralCode', 'text', true],
          ['Brand', 'brand', 'text', false],
          ['Compatible With', 'compatibleWith', 'text', false],
          ['Color', 'color', 'text', false],
          ['Material', 'material', 'text', false],
          ['Description', 'description', 'textarea', false],
          ['Price*', 'price', 'number', true],
          ['Quantity*', 'quantity', 'number', true],
          ['Discount', 'discount', 'number', false],
        ].map(([label, name, type = 'text', isRequired]) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              {label}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            {type === 'textarea' ? (
              <textarea 
                {...register(name, { required: isRequired })}
                className="mt-1 p-2 border rounded-md" 
                placeholder={!isRequired ? "N/A" : ""}
              />
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

      {/* Images Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Main Image
            </label>
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

      <div className="pt-4">
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition"
        >
          Add Screen Protector
        </button>
      </div>
    </form>
  );
}