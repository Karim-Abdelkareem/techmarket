import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';
import { FaUsers, FaBoxOpen, FaMoneyBillWave } from 'react-icons/fa';
import OverviewCard from './OverviewCard';

const Overview = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['overview'],
    queryFn: analyticsService.getOverview,
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
        <span className="block sm:inline"> {error.message || 'Failed to load overview data'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
      <p className="text-gray-600">Key metrics for your platform</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewCard 
          title="Total Users" 
          value={data?.totalUsers || 0} 
          icon={<FaUsers className="h-6 w-6 text-blue-500" />} 
          bgColor="bg-blue-50"
        />
        <OverviewCard 
          title="Total Products" 
          value={data?.totalProducts || 0} 
          icon={<FaBoxOpen className="h-6 w-6 text-green-500" />} 
          bgColor="bg-green-50"
        />
        {/* Uncomment when sales data is available */}
        {/* <OverviewCard 
          title="Total Sales" 
          value={data?.totalSales || 0} 
          icon={<FaMoneyBillWave className="h-6 w-6 text-yellow-500" />} 
          bgColor="bg-yellow-50"
        /> */}
      </div>
    </div>
  );
};

export default Overview;