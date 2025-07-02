import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Categories = ({ className }) => {
  const categoriesRef = useRef(null);
  const [categories, setCategories] = useState([]);

  // Use default categories directly instead of fetching from API
  useEffect(() => {
    setCategories(defaultCategories);
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
      route: '/products/Mobile'
    },
    {
      _id: 2,
      name: 'Laptops',
      icon: 'laptop',
      route: '/products/Laptop'
    },
    {
      _id: 3,
      name: 'Smartwatches',
      icon: 'watch',
      route: '/products/Wearable'
    },
    {
      _id: 4,
      name: 'Headphones',
      icon: 'headphones',
      route: '/products/Audio'
    },
    {
      _id: 5,
      name: 'Accessories',
      icon: 'accessory',
      route: '/products/Accessory'
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
      case 'accessory':
      case 'accessories':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
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

  return (
    <div className={`py-16 px-6 bg-dark ${className || ''}`} ref={categoriesRef}>
      <h2 className="text-3xl font-bold text-white text-center mb-12 animate-fadeIn">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        {categories.map((category, index) => {
          const categoryName = category.name || 'Category';
          const categoryRoute = category.route || `/products/${categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          
          return (
            <Link
              key={category._id || index}
              to={categoryRoute}
              className={`category-card rounded-lg p-8 flex flex-col items-center  justify-center transition-all duration-300 opacity-0 hover:scale-95 shadow-lg bg-gradient-to-br from-[#0B0D0F] via-[#10172a] to-[#031E49] text-white`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="text-white mb-4 hover:animate-pulse">{getCategoryIcon(category)}</div>
              <h3 className="text-white text-lg font-medium">{categoryName}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;