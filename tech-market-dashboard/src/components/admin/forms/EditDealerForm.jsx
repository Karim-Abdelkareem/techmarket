import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';

const EditDealerForm = ({ dealer, onSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(dealer.logo ? `https://techmarket-lovat.vercel.app/${dealer.logo}` : null);
  const { token } = useAuth();

  useEffect(() => {
    // Pre-fill the form with dealer data
    reset({
      name: dealer.name,
      brief: dealer.brief || '',
      locationText: dealer.location?.text || '',
      locationLink: dealer.location?.link || '',
    });
  }, [dealer, reset]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('brief', data.brief || '');
      formData.append('locationText', data.locationText || '');
      formData.append('locationLink', data.locationLink || '');
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch(`https://techmarket-lovat.vercel.app/api/dealer/${dealer._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update dealer');
      }

      const result = await response.json();
      onSuccess(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Edit Dealer</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dealer Name *</label>
          <input
            type="text"
            {...register('name', { required: 'Dealer name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {logoPreview && (
            <div className="mt-2">
              <img src={logoPreview} alt="Logo Preview" className="h-20 w-20 object-cover rounded-md" />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description</label>
          <textarea
            {...register('brief')}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location Text</label>
          <input
            type="text"
            {...register('locationText')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location Link</label>
          <input
            type="text"
            {...register('locationLink')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Dealer'}
        </button>
      </div>
    </form>
  );
};

export default EditDealerForm;