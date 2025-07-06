import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AddDealerForm from './forms/AddDealerForm';
import EditDealerForm from './forms/EditDealerForm';

const DealerList = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const { token } = useAuth();

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://techmarket-lovat.vercel.app/api/dealer', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dealers');
      }

      const data = await response.json();
      setDealers(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, [token]);

  const handleAddDealer = (newDealer) => {
    setDealers([...dealers, newDealer]);
    setShowAddModal(false);
  };

  const handleEditDealer = (updatedDealer) => {
    setDealers(
      dealers.map((dealer) =>
        dealer._id === updatedDealer._id ? updatedDealer : dealer
      )
    );
    setShowEditModal(false);
    setSelectedDealer(null);
  };

  const handleDeleteClick = (dealer) => {
    setDeleteConfirmation(dealer);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation) return;

    try {
      const response = await fetch(
        `https://techmarket-lovat.vercel.app/api/dealer/${deleteConfirmation._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete dealer');
      }

      setDealers(dealers.filter((d) => d._id !== deleteConfirmation._id));
      setDeleteConfirmation(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (dealer) => {
    setSelectedDealer(dealer);
    setShowEditModal(true);
  };

  if (loading && dealers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dealers</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <FaPlus className="mr-2" /> Add Dealer
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {dealers.length === 0 && !loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No dealers found. Add your first dealer!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brief
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dealers.map((dealer) => (
                <tr key={dealer._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dealer.logo ? (
                      <img
                        src={`https://techmarket-lovat.vercel.app/${dealer.logo}`}
                        alt={dealer.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">{dealer.name.charAt(0)}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dealer.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">{dealer.brief || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {dealer.location?.text ? (
                      <div className="text-sm text-gray-500">
                        {dealer.location.link ? (
                          <a
                            href={dealer.location.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:underline"
                          >
                            {dealer.location.text}
                          </a>
                        ) : (
                          dealer.location.text
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(dealer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(dealer)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Dealer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <AddDealerForm
              onSuccess={handleAddDealer}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Dealer Modal */}
      {showEditModal && selectedDealer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <EditDealerForm
              dealer={selectedDealer}
              onSuccess={handleEditDealer}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedDealer(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Dealer
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete {deleteConfirmation.name}? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerList;