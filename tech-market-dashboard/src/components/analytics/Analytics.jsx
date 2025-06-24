import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';
import { FaUsers, FaBoxOpen, FaChartLine, FaEye, FaShoppingCart, FaStar } from 'react-icons/fa';

// Components
import OverviewCard from './OverviewCard';
import ProductStatsChart from './ProductStatsChart';
import UserStatsChart from './UserStatsChart';
import ProductTable from './ProductTable';

const Analytics = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardAnalytics'],
    queryFn: analyticsService.getDashboardAnalytics,
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
        <span className="block sm:inline"> {error.message || 'Failed to load analytics data'}</span>
      </div>
    );
  }

  const data = dashboardData?.data || {};

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewCard 
          title="Total Users" 
          value={data.totalUsers || 0} 
          icon={<FaUsers className="h-6 w-6 text-blue-500" />} 
          bgColor="bg-blue-50"
        />
        <OverviewCard 
          title="Total Products" 
          value={data.totalProducts || 0} 
          icon={<FaBoxOpen className="h-6 w-6 text-green-500" />} 
          bgColor="bg-green-50"
        />
        {/* Add more cards as needed */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Stats by Category */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Product Distribution by Category</h2>
          <ProductStatsChart data={data.productStats || []} />
        </div>
        
        {/* User Signups Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">User Signups (Last 12 Months)</h2>
          <UserStatsChart data={data.userSignupTrends || []} />
        </div>
      </div>

      {/* Product Tables Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Most Viewed Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaEye className="mr-2 text-blue-500" /> Most Viewed Products
          </h2>
          <ProductTable products={data.mostViewedProducts || []} viewField="views" />
        </div>
        
        {/* Most Bought Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaShoppingCart className="mr-2 text-green-500" /> Most Purchased Products
          </h2>
          <ProductTable products={data.mostBoughtProducts || []} viewField="purchases" />
        </div>
        
        {/* Top Exclusive Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaStar className="mr-2 text-yellow-500" /> Top Exclusive Products
          </h2>
          <ProductTable products={data.topExclusiveProducts || []} viewField="views" />
        </div>
      </div>
    </div>
  );
};

export default Analytics;