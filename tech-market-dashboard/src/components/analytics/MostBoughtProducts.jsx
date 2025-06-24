import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';
import ProductTable from './ProductTable';
import { FaShoppingCart } from 'react-icons/fa';

const MostBoughtProducts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['mostBoughtProducts'],
    queryFn: analyticsService.getMostBoughtProducts,
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
        <span className="block sm:inline"> {error.message || 'Failed to load most bought products'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaShoppingCart className="mr-2 text-green-500" /> Most Purchased Products
        </h1>
        <p className="text-gray-600">Top 10 products with the highest purchase counts</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <ProductTable products={data?.products || []} viewField="purchases" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Insights</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            The most purchased products represent your best-selling items. These products are driving revenue 
            and have proven market demand.
          </p>
          <p className="text-gray-700">
            Consider these insights:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Ensure adequate inventory for these high-demand products</li>
            <li>Consider creating bundles with these popular products</li>
            <li>Analyze what makes these products successful (price point, features, marketing)</li>
            <li>Look for opportunities to upsell or cross-sell related items</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MostBoughtProducts;