import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddAccessoryForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);
  const accessoryType = watch('type');

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    images.forEach((image) => {
      formData.append('images', image);
    });
    
    try {
      const response = await fetch('/api/accessories', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to add accessory');
      
      // Handle success
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Name</label>
        <input {...register('name', { required: true })} />
        {errors.name && <span>This field is required</span>}
      </div>
      
      <div>
        <label>Type</label>
        <select {...register('type', { required: true })}>
          <option value="">Select Type</option>
          <option value="Cable">Cable</option>
          <option value="Charger">Charger</option>
          <option value="PowerBank">Power Bank</option>
          <option value="CaseCover">Case/Cover</option>
          <option value="ScreenProtector">Screen Protector</option>
        </select>
        {errors.type && <span>This field is required</span>}
      </div>
      
      <div>
        <label>Brand</label>
        <input {...register('brand')} />
      </div>
      
      <div>
        <label>Features</label>
        <textarea {...register('features')} />
      </div>
      
      <div>
        <label>Price</label>
        <input type="number" {...register('price', { required: true })} />
        {errors.price && <span>This field is required</span>}
      </div>
      
      <div>
        <label>Quantity</label>
        <input type="number" {...register('quantity', { required: true })} />
        {errors.quantity && <span>This field is required</span>}
      </div>
      
      {accessoryType === 'Cable' && (
        <>
          <div>
            <label>From</label>
            <input {...register('details.from')} />
          </div>
          <div>
            <label>To</label>
            <input {...register('details.to')} />
          </div>
          <div>
            <label>Cable Length</label>
            <input {...register('details.cableLength')} />
          </div>
          <div>
            <label>Cable Type</label>
            <input {...register('details.cableType')} />
          </div>
        </>
      )}
      
      {accessoryType === 'ScreenProtector' && (
        <>
          <div>
            <label>Compatible With</label>
            <input {...register('details.compatibleWith')} />
          </div>
          <div>
            <label>Color</label>
            <input {...register('details.color')} />
          </div>
          <div>
            <label>Material</label>
            <input {...register('details.material')} />
          </div>
        </>
      )}
      
      <div>
        <label>Main Image</label>
        <input type="file" onChange={handleImageChange} />
      </div>
      
      <button type="submit">Add Accessory</button>
    </form>
  );
}