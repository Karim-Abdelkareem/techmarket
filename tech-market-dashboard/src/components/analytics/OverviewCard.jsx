import React from 'react';

const OverviewCard = ({ title, value, icon, bgColor = 'bg-blue-50' }) => {
  return (
    <div className={`${bgColor} rounded-lg shadow p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
        </div>
        <div className="rounded-full p-3 bg-white shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;