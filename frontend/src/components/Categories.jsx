import { useRef, useEffect, useState } from 'react';
import { getCategories } from '../services/api';

const Categories = ({ className }) => {
  const categoriesRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        if (response && response.data && response.data.categories) {
          setCategories(response.data.categories);
        } else {
          // Fallback to default categories if API doesn't return expected format
          setCategories(defaultCategories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        // Use default categories as fallback
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Animation for category cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryCards = entry.target.querySelectorAll('.category-card');
            categoryCards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-slideIn');
                card.style.opacity = 1;
              }, index * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (categoriesRef.current) {
      observer.observe(categoriesRef.current);
    }

    return () => {
      if (categoriesRef.current) {
        observer.unobserve(categoriesRef.current);
      }
    };
  }, [categories]);

  // Default categories as fallback
  const defaultCategories = [
    {
      _id: 1,
      name: 'Mobile & tablets',
      icon: 'mobile',
    },
    {
      _id: 2,
      name: 'Laptops',
      icon: 'laptop',
    },
    {
      _id: 3,
      name: 'Smartwatches',
      icon: 'watch',
    },
    {
      _id: 4,
      name: 'Headphones',
      icon: 'headphones',
    },
  ];

  // Get icon based on category name or icon property
  const getCategoryIcon = (category) => {
    const iconType = category.icon || category.name.toLowerCase();
    
    switch (iconType) {
      case 'mobile':
      case 'mobile & tablets':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'laptop':
      case 'laptops':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'watch':
      case 'smartwatch':
      case 'smartwatches':
      case 'wearable':
      case 'wearables':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'headphone':
      case 'headphones':
      case 'audio':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
    }
  };

  // Generate gradient colors for each category
  const getGradientStyle = (index) => {
    const gradients = [
      'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',  // Blue-purple
      'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',  // Green-blue
      'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',  // Yellow-red
      'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',  // Purple-pink
    ];
    
    return {
      background: gradients[index % gradients.length],
    };
  };

  if (loading) {
    return (
      <div className={`py-16 px-6 bg-dark ${className || ''}`}>
        <h2 className="text-3xl font-bold text-white text-center mb-12 animate-fadeIn">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-8 animate-pulse h-40"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error(error);
  }

  return (
    <div className={`py-16 px-6 bg-dark ${className || ''}`} ref={categoriesRef}>
      <h2 className="text-3xl font-bold text-white text-center mb-12 animate-fadeIn">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {categories.map((category, index) => {
          const categoryName = category.name || 'Category';
          return (
            <a
              key={category._id || index}
              href={`#${categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className={`category-card rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-300 opacity-0 hover:scale-105 shadow-lg`}
              style={{
                ...getGradientStyle(index),
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="text-white mb-4 hover:animate-pulse">{getCategoryIcon(category)}</div>
              <h3 className="text-white text-lg font-medium">{categoryName}</h3>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;