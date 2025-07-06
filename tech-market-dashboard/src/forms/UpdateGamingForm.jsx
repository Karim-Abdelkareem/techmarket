import React, { useState } from 'react';

const subTypeOptions = [
  { value: 'Games', label: 'Games' },
  { value: 'Accounts', label: 'Accounts' },
  { value: 'PlayStation', label: 'PlayStation' },
  { value: 'Controller', label: 'Controller' },
  { value: 'Skin', label: 'Skin' },
];

const typeOptions = [
  { value: 'Primary', label: 'Primary' },
  { value: 'Secondary', label: 'Secondary' },
];

const UpdateGamingForm = ({ product, onClose }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    subType: product?.subType || '',
    type: product?.type || '',
    warranty: product?.warranty || '',
    price: product?.price || '',
    quantity: product?.quantity || '',
    image: product?.image || '',
    description: product?.description || '',
    brand: product?.brand || '',
    productCode: product?.productCode || '',
    discount: product?.discount || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Build payload conditionally
      const payload = {
        ...form,
        category: 'Gaming',
        productType: 'Gaming',

      };
      if (form.subType !== 'Accounts') {
        delete payload.type;
      }
      if (form.subType !== 'PlayStation') {
        delete payload.warranty;
      }
      const res = await fetch(`https://techmarket-lovat.vercel.app/api/product/${product._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update product');
      }
      if (onClose) onClose();
      alert('Gaming product updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Gaming Product</h2>
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold block mb-1">Name<span className="text-red-500">*</span></label>
          <input name="name" value={form.name} onChange={handleChange} required className="input w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Sub Type<span className="text-red-500">*</span></label>
          <select name="subType" value={form.subType} onChange={handleChange} required className="input w-full border rounded px-3 py-2">
            <option value="">Select Sub Type</option>
            {subTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        {form.subType === 'Accounts' && (
          <div>
            <label className="font-semibold block mb-1">Type<span className="text-red-500">*</span></label>
            <select name="type" value={form.type} onChange={handleChange} required className="input w-full border rounded px-3 py-2">
              <option value="">Select Type</option>
              {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        )}
        {form.subType === 'PlayStation' && (
          <div>
            <label className="font-semibold block mb-1">Warranty</label>
            <input name="warranty" value={form.warranty} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
          </div>
        )}
        <div>
          <label className="font-semibold block mb-1">Brand</label>
          <input name="brand" value={form.brand} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Product Code<span className="text-red-500">*</span></label>
          <input name="productCode" value={form.productCode} onChange={handleChange} required className="input w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Price<span className="text-red-500">*</span></label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required className="input w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Discount (%)</label>
          <input name="discount" type="number" value={form.discount} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Quantity<span className="text-red-500">*</span></label>
          <input name="quantity" type="number" value={form.quantity} onChange={handleChange} required className="input w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="font-semibold block mb-1">Image URL</label>
          <input name="image" value={form.image} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="font-semibold block mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-full mt-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={loading}>
        {loading ? 'Updating...' : 'Update Gaming Product'}
      </button>
    </form>
  );
};

export default UpdateGamingForm; 