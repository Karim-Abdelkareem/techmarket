import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddAccessoryForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);
  const accessoryType = watch('type');

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    // Set default values for optional fields
    const finalData = {
      ...data,
      brand: data.brand || 'N/A',
      features: data.features || 'N/A',
      'details.from': data.details?.from || 'N/A',
      'details.to': data.details?.to || 'N/A',
      'details.cableLength': data.details?.cableLength || 'N/A',
      'details.cableType': data.details?.cableType || 'N/A',
      'details.compatibleWith': data.details?.compatibleWith || 'N/A',
      'details.color': data.details?.color || 'N/A',
      'details.material': data.details?.material || 'N/A'
    };
    
    Object.entries(finalData).forEach(([key, value]) => {
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
        <label>Name*</label>
        <input {...register('name', { required: true })} />
        {errors.name && <span>This field is required</span>}
      </div>
      
      <div>
        <label>Type</label>
        <select {...register('type')}>
          <option value="">Select Type</option>
          <option value="Cable">Cable</option>
          <option value="Charger">Charger</option>
          <option value="PowerBank">Power Bank</option>
          <option value="CaseCover">Case/Cover</option>
          <option value="ScreenProtector">Screen Protector</option>
        </select>
      </div>
      
      <div>
        <label>Referral Code*</label>
        <input {...register('referralCode', { required: true })} />
        {errors.referralCode && <span>This field is required</span>}
      </div>
      
      <div>
        <label>Brand</label>
        <input {...register('brand')} placeholder="N/A" />
      </div>
      
      <div>
        <label>Features</label>
        <textarea {...register('features')} placeholder="N/A" />
      </div>
      
      <div>
        <label>Price*</label>
        <input type="number" {...register('price', { required: true })} />
        {errors.price && <span>This field is required</span>}
      </div>
      
      <div>
        <label>Quantity*</label>
        <input type="number" {...register('quantity', { required: true })} />
        {errors.quantity && <span>This field is required</span>}
      </div>
      
      {accessoryType === 'Cable' && (
        <>
          <div>
            <label>From</label>
            <input {...register('details.from')} placeholder="N/A" />
          </div>
          <div>
            <label>To</label>
            <input {...register('details.to')} placeholder="N/A" />
          </div>
          <div>
            <label>Cable Length</label>
            <input {...register('details.cableLength')} placeholder="N/A" />
          </div>
          <div>
            <label>Cable Type</label>
            <input {...register('details.cableType')} placeholder="N/A" />
          </div>
        </>
      )}
      
      {accessoryType === 'ScreenProtector' && (
        <>
          <div>
            <label>Compatible With</label>
            <input {...register('details.compatibleWith')} placeholder="N/A" />
          </div>
          <div>
            <label>Color</label>
            <input {...register('details.color')} placeholder="N/A" />
          </div>
          <div>
            <label>Material</label>
            <input {...register('details.material')} placeholder="N/A" />
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