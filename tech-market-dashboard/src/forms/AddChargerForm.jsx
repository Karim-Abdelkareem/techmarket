import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddChargerForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);
  const [features, setFeatures] = useState(['']); // Start with one empty feature field

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    // Prepare the product data
    const productData = {
      name: data.name,
      category: 'Accessories',
      productType: 'Charger',
      productCode: data.productCode || 'N/A',
      referralCode: data.referralCode,
      price: data.price,
      description: data.description || 'N/A',
      quantity: data.quantity,
      brand: data.brand || 'N/A',
      input: data.input || 'N/A',
      power: data.power || 'N/A',
      color: data.color || 'N/A',
      chargerType: data.chargerType || 'N/A',
      discount: data.discount || 0
    };

    // Append the main product data
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Handle features from user input (filter out empty strings)
    const userFeatures = features.filter(f => f.trim() !== '');
    userFeatures.forEach((feature, index) => {
      formData.append(`features[${index}]`, feature);
    });

    // Handle image files
    if (images.length > 0) {
      formData.append('image', images[0]);
      for (let i = 1; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    const token = localStorage.getItem('token'); 

    try {
      const response = await fetch('https://techmarket-lovat.vercel.app/api/product', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to add charger: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      alert('Charger added successfully!');
    } catch (error) {
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

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeatureField = () => {
    setFeatures([...features, '']);
  };

  const removeFeatureField = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Charger</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ['Name*', 'name', 'text', true, "Anker 45W USB-C Fast Charger"],
          ['Product Code', 'productCode', 'text', false, "ANK-45W-USBC"],
          ['Referral Code*', 'referralCode', 'text', true, "REF-ANK-CHGR"],
          ['Brand', 'brand', 'text', false, "Anker"],
          ['Charger Type', 'chargerType', 'text', false, "USB-C Power Delivery"],
          ['Input', 'input', 'text', false, "100-240V~50/60Hz 1.2A"],
          ['Power (W)', 'power', 'text', false, "45W"],
          ['Color', 'color', 'text', false, "White"],
          ['Description', 'description', 'textarea', false, "Anker 45W USB-C wall charger with Power Delivery 3.0 for fast charging smartphones and tablets."],
          ['Price*', 'price', 'number', true, "29.99"],
          ['Quantity*', 'quantity', 'number', true, "80"],
          ['Discount', 'discount', 'number', false, "0"],
        ].map(([label, name, type = 'text', isRequired, defaultValue]) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              {label}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            {type === 'textarea' ? (
              <textarea 
                {...register(name, { required: isRequired })}
                className="mt-1 p-2 border rounded-md" 
                defaultValue={defaultValue}
              />
            ) : (
              <input 
                type={type} 
                {...register(name, { 
                  required: isRequired,
                  valueAsNumber: type === 'number'
                })}
                className="mt-1 p-2 border rounded-md" 
                defaultValue={defaultValue}
              />
            )}
            {errors[name] && <span className="text-sm text-red-500 mt-1">This field is required</span>}
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">Features</label>
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="flex-1 mt-1 p-2 border rounded-md"
              placeholder={`Feature ${index + 1}`}
            />
            {features.length > 1 && (
              <button
                type="button"
                onClick={() => removeFeatureField(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addFeatureField}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Another Feature
        </button>
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
          Add Charger
        </button>
      </div>
    </form>
  );
}