import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaUserShield } from 'react-icons/fa';
import Modal from '../Modal';
import AddModeratorForm from './forms/AddModeratorForm';
import EditModeratorForm from './forms/EditModeratorForm';

const ModeratorList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://techmarket-lovat.vercel.app/api/user', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }

    try {
      const response = await fetch(`https://techmarket-lovat.vercel.app/api/user/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete moderator');
      }

      // Remove the deleted user from the state
      setUsers(users.filter(user => user._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddSuccess = (newUser) => {
    setUsers([...users, newUser]);
    setShowAddModal(false);
  };

  const handleEditSuccess = (updatedUser) => {
    setUsers(users.map(user => 
      user._id === updatedUser._id ? updatedUser : user
    ));
    setShowEditModal(false);
    setCurrentUser(null);
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
          onClick={fetchUsers}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Users & Moderators</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
        >
          <FaPlus /> Add Moderator
        </button>
      </div>

      {users.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brief</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.logo ? (
                        <img
                          className="h-10 w-10 rounded-full mr-3 object-cover"
                          src={user.logo}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                          <span className="text-red-600 font-bold">{user.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'moderator' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">{user.brief || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.location?.text || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.role !== 'admin' && (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <FaEdit className="inline" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className={`${confirmDelete === user._id ? 'text-red-600 font-bold' : 'text-red-500'} hover:text-red-900`}
                        >
                          <FaTrash className="inline" /> {confirmDelete === user._id ? 'Confirm' : 'Delete'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Moderator Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <AddModeratorForm onSuccess={handleAddSuccess} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Moderator Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        {currentUser && (
          <EditModeratorForm 
            moderator={currentUser} 
            onSuccess={handleEditSuccess} 
            onCancel={() => setShowEditModal(false)} 
          />
        )}
      </Modal>
    </div>
  );
};

export default ModeratorList;