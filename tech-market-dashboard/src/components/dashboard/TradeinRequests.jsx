import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCheck, FaTimes, FaEye, FaEdit } from 'react-icons/fa';

const TradeinRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);
  const { token } = useAuth();

  const fetchTradeInRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://techmarket-lovat.vercel.app/api/tradein', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trade-in requests');
      }

      const data = await response.json();
      setRequests(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradeInRequests();
  }, [token]);

  const handleApproveRequest = async (status) => {
    if (!selectedRequest) return;

    try {
      setApprovalLoading(true);
      const response = await fetch('https://techmarket-lovat.vercel.app/api/tradein/approve', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          tradeInId: selectedRequest._id,
          status,
          adminNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update request');
      }

      const result = await response.json();
      
      // Update the local state
      setRequests(prev => 
        prev.map(req => 
          req._id === selectedRequest._id 
            ? { ...req, status, adminNotes, reviewedBy: result.data.reviewedBy, reviewedAt: result.data.reviewedAt }
            : req
        )
      );

      setShowModal(false);
      setSelectedRequest(null);
      setAdminNotes('');
    } catch (err) {
      setError(err.message);
    } finally {
      setApprovalLoading(false);
    }
  };

  const formatSpecs = (specs) => {
    if (!specs || typeof specs !== 'object') return <div>No specifications</div>;
    
    return Object.entries(specs).map(([key, value]) => (
      <div key={key} className="text-left">
        <span className="font-medium text-gray-700">{key}:</span> {value}
      </div>
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <p>Error: {error}</p>
        <button 
          onClick={fetchTradeInRequests}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-2xl font-bold text-white text-center">Trade-in Requests</h2>
        </div>
        
        {requests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No trade-in requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Replacement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{req.user?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{req.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{req.store?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {req.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{req.productType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 space-y-1">
                        {formatSpecs(req.specs)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{req.replacement?.title || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(req.status)}`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(req.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setShowModal(true);
                              }}
                              className="flex items-center px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                            >
                              <FaCheck className="mr-1" /> Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setShowModal(true);
                              }}
                              className="flex items-center px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                            >
                              <FaTimes className="mr-1" /> Reject
                            </button>
                          </>
                        )}
                        {req.status !== 'pending' && (
                          <span className="text-xs text-gray-500">
                            {req.reviewedAt ? `Reviewed on ${formatDate(req.reviewedAt)}` : 'N/A'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedRequest.status === 'pending' ? 'Review Trade-in Request' : 'Request Details'}
            </h3>
            
            <div className="mb-4">
              <p><strong>User:</strong> {selectedRequest.user?.name}</p>
              <p><strong>Category:</strong> {selectedRequest.category}</p>
              <p><strong>Product Type:</strong> {selectedRequest.productType}</p>
              <p><strong>Replacement:</strong> {selectedRequest.replacement?.title}</p>
            </div>

            {selectedRequest.status === 'pending' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Add notes about your decision..."
                />
              </div>
            )}

            {selectedRequest.adminNotes && (
              <div className="mb-4">
                <p><strong>Admin Notes:</strong></p>
                <p className="text-sm text-gray-600">{selectedRequest.adminNotes}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRequest(null);
                  setAdminNotes('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={approvalLoading}
              >
                Cancel
              </button>
              
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApproveRequest('approved')}
                    disabled={approvalLoading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <FaCheck className="mr-2" />
                    {approvalLoading ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleApproveRequest('rejected')}
                    disabled={approvalLoading}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    <FaTimes className="mr-2" />
                    {approvalLoading ? 'Rejecting...' : 'Reject'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeinRequests; 