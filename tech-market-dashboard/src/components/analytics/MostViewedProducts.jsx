import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';
import ProductTable from './ProductTable';
import { FaEye } from 'react-icons/fa';

const MostViewedProducts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['mostViewedProducts'],
    queryFn: analyticsService.getMostViewedProducts,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error.message || 'Failed to load most viewed products'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaEye className="mr-2 text-blue-500" /> Most Viewed Products
        </h1>
        <p className="text-gray-600">Top 10 products with the highest view counts</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <ProductTable products={data?.products || []} viewField="views" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Insights</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            The most viewed products represent items that are attracting the most attention from users. 
            High view counts may indicate strong interest, effective marketing, or prominent placement on your platform.
          </p>
          <p className="text-gray-700">
            Consider these insights:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Products with high views but low purchases may need pricing adjustments or better product descriptions</li>
            <li>Products with consistently high views are good candidates for featured promotions</li>
            <li>Analyze what makes your most-viewed products attractive to apply those lessons to other products</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MostViewedProducts;