import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';
import ProductTable from './ProductTable';
import { FaStar } from 'react-icons/fa';

const TopExclusiveProducts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['topExclusiveProducts'],
    queryFn: analyticsService.getTopExclusiveProducts,
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
        <span className="block sm:inline"> {error.message || 'Failed to load top exclusive products'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaStar className="mr-2 text-yellow-500" /> Top Exclusive Products
        </h1>
        <p className="text-gray-600">Top 10 exclusive products with the highest view counts</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <ProductTable products={data?.products || []} viewField="views" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Insights</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            Exclusive products are unique items that can only be found on your platform. These products 
            help differentiate your store and can drive customer loyalty.
          </p>
          <p className="text-gray-700">
            Consider these insights:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Highlight the exclusivity of these products in your marketing</li>
            <li>Consider expanding your exclusive product line based on popular categories</li>
            <li>Analyze the conversion rate of exclusive products compared to non-exclusive ones</li>
            <li>Use exclusive products as a competitive advantage in your market positioning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopExclusiveProducts;