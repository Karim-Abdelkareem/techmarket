import { Link, useNavigate } from 'react-router-dom';
import { FiTag, FiRefreshCw } from 'react-icons/fi';

const CATEGORIES = [
  { id: 'Mobile', name: 'Mobile Phones & Tablets', icon: '📱' },
  { id: 'Laptop', name: 'Laptops', icon: '💻' },
  { id: 'Accessories', name: 'Accessories', icon: '🔧' },
  { id: 'Wearables', name: 'Wearables', icon: '⌚' },
  { id: 'Audio', name: 'Audio', icon: '🎧' },
  { id: 'Gaming', name: 'Gaming', icon: '🎮' },
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    navigate(`/category/${cat.id}`);
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Shop by Category</h2>
          <p className="text-gray-400 text-lg">Explore our wide range of tech products</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors cursor-pointer transform hover:scale-105"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-white font-semibold text-sm">{category.name}</h3>
            </div>
          ))}
        </div>

       
      </div>
    </section>
  );
};

export default Categories;