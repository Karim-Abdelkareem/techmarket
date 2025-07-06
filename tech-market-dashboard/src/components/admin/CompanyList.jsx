import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AddCompanyForm from './forms/AddCompanyForm';
import EditCompanyForm from './forms/EditCompanyForm';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const { token } = useAuth();

const fetchCompanies = async () => {
  try {
    setLoading(true);
    const response = await fetch('https://techmarket-lovat.vercel.app/api/dealer', {
      
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }

    const data = await response.json();
    // Make sure data.data.dealers is an array, otherwise default to empty array
    setCompanies(Array.isArray(data.data?.dealers) ? data.data.dealers : []);
  } catch (err) {
    setError(err.message);
    setCompanies([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCompanies();
  }, [token]);

  const handleAddCompany = (newCompany) => {
    setCompanies([...companies, newCompany.dealer]);
    setShowAddModal(false);
  };

  const handleEditCompany = (updatedCompany) => {
    setCompanies(
      companies.map((company) =>
        company._id === updatedCompany.dealer._id ? updatedCompany.dealer : company
      )
    );
    setShowEditModal(false);
    setSelectedCompany(null);
  };

  const handleDeleteClick = (company) => {
    setDeleteConfirmation(company);
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
        throw new Error('Failed to delete company');
      }

      setCompanies(companies.filter((c) => c._id !== deleteConfirmation._id));
      setDeleteConfirmation(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setShowEditModal(true);
  };

  if (loading && companies.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Companies</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <FaPlus className="mr-2" /> Add Company
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {companies.length === 0 && !loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No companies found. Add your first company!</p>
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
              {companies.map((company) => (
                <tr key={company._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.logo ? (
                      <img
                        src={`https://techmarket-lovat.vercel.app/${company.logo}`}
                        alt={company.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">{company.name.charAt(0)}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{company.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">{company.brief || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {company.location?.text ? (
                      <div className="text-sm text-gray-500">
                        {company.location.link ? (
                          <a
                            href={company.location.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:underline"
                          >
                            {company.location.text}
                          </a>
                        ) : (
                          company.location.text
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(company)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(company)}
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

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <AddCompanyForm
              onSuccess={handleAddCompany}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <EditCompanyForm
              company={selectedCompany}
              onSuccess={handleEditCompany}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedCompany(null);
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
              Delete Company
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

export default CompanyList;