import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { categoryConfig } from "../../config/categoryConfig";
import { FaTrash } from "react-icons/fa";
import AddLaptopForm from '../../forms/AddLaptopForm';
import AddMobileForm from '../../forms/AddMobileForm';
import AddAccessoryForm from '../../forms/AddAccessoryForm';
import AddCableForm from '../../forms/AddCableForm';
import AddChargerForm from '../../forms/AddChargerForm';
import AddPowerBankForm from '../../forms/AddPowerBankForm';
import AddCaseCoverForm from '../../forms/AddCaseCoverForm';
import AddScreenProtectorForm from '../../forms/AddScreenProtectorForm';
import AddAudioForm from '../../forms/AddAudioForm';
import AddOverEarForm from '../../forms/AddOverEarForm';
import AddInEarForm from '../../forms/AddInEarForm';
import AddWirelessForm from '../../forms/AddWirelessForm';
import AddWearableForm from '../../forms/AddWearableForm';
import Modal from '../Modal';

const CategoryPage = () => {
    const { main, sub } = useParams();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const buildQueryParams = (main, sub) => {
        const params = new URLSearchParams();
        
        switch (main) {
            case 'mobile-tablets':
                params.append('productType', 'MobileTablet');
                break;
            case 'accessories':
                params.append('category', 'accessories');
                if (sub) {
                    switch (sub) {
                        case 'cables':
                            params.append('productType', 'Cable');
                            break;
                        case 'chargers':
                            params.append('productType', 'Charger');
                            break;
                        case 'power-bank':
                            params.append('productType', 'PowerBank');
                            break;
                        case 'cases':
                            params.append('productType', 'CaseCover');
                            break;
                        case 'screen-protector':
                            params.append('productType', 'ScreenProtector');
                            break;
                    }
                }
                break;
            case 'wearables':
                params.append('productType', 'Wearable');
                break;
            case 'audio':
                params.append('productType', 'Audio');
                break;
            case 'laptops':
                params.append('productType', 'Laptop');
                break;
        }
        
        return params.toString();
    };

    const renderForm = () => {
        switch (main) {
            case 'laptops':
                return <AddLaptopForm />;
            case 'mobile-tablets':
                return <AddMobileForm />;
            case 'wearables':
                return <AddWearableForm />;
            case 'audio':
                switch (sub) {
                    case 'over-ear':
                        return <AddOverEarForm />;
                    case 'in-ear':
                        return <AddInEarForm />;
                    case 'wireless':
                        return <AddWirelessForm />;
                    default:
                        return <AddAudioForm />;
                }
            case 'accessories':
                // Handle accessories subcategories
                switch (sub) {
                    case 'cables':
                        return <AddCableForm />;
                    case 'chargers':
                        return <AddChargerForm />;
                    case 'power-bank':
                        return <AddPowerBankForm />;
                    case 'cases':
                        return <AddCaseCoverForm />;
                    case 'screen-protector':
                        return <AddScreenProtectorForm />;
                    default:
                        return <AddAccessoryForm />;
                }
            default:
                return <p>No form available for this category.</p>;
        }
    };

    const handleAddProductClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:3000/api/product/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: token,
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 404) {
                throw new Error('Product not found');
            }
            throw new Error(errorData.message || 'Failed to delete product');
        }
        
        // Remove the deleted product from the state
        setProducts(products.filter(product => product._id !== productId));
        
        // No need to parse response body for 204 status
        alert('Product deleted successfully');
    } catch (error) {
        console.error('Error deleting product:', error);
        alert(`Error: ${error.message}`);
    }
};
    const config = categoryConfig[main];
    const subConfig = sub && config?.children ? config.children[sub] : config;
    const pageTitle = location.state?.title || (subConfig?.title || config?.title);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                
                // Build query parameters for API call
                const queryParams = buildQueryParams(main, sub);
                const apiUrl = `http://127.0.0.1:3000/api/product${queryParams ? `?${queryParams}` : ''}`;
                
                console.log('Fetching from:', apiUrl); // For debugging
                
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const result = await response.json();
                
                // No need for client-side filtering anymore - API handles it
                setProducts(result.data || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [main, sub]);

    if (!config || (sub && !subConfig)) {
        return <h1 className="text-xl font-bold">404 - Category Not Found</h1>;
    }

    if (loading) {
        return <div className="text-center py-4">Loading products...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">Error: {error}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">
                    {pageTitle}
                </h1>
                <button
                    onClick={handleAddProductClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Product
                </button>
            </div>
            <div className="p-4 bg-gray-100 rounded mb-4">
                <p>Main category: {main}</p>
                {sub && <p>Subcategory: {sub}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(product => (
                    <div key={product._id} className="border rounded-lg p-4 shadow-sm relative">
                        <button 
                            onClick={() => handleDeleteProduct(product._id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition"
                            title="Delete Product"
                        >
                            <FaTrash size={14} />
                        </button>
                        <img 
                            src={product.image || 'https://via.placeholder.com/300'} 
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-md mb-2"
                        />
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">{product.brand}</p>
                        <p className="text-green-600 font-bold mt-2">${product.price}</p>
                        {product.discount > 0 && (
                            <p className="text-red-500">
                                Sale: {product.discount}% off
                            </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">Type: {product.productType}</p>
                        <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                    </div>
                ))}
            </div>
            
            {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No products found in this category.
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {renderForm()}
            </Modal>
        </div>
    );
};

export default CategoryPage;