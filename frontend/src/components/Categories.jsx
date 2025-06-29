import { useRef, useEffect } from 'react';

const Categories = ({ className }) => {
  const categoriesRef = useRef(null);

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
  }, []);

  const categories = [
    {
      id: 1,
      name: 'Mobile & tablets',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 2,
      name: 'Laptops',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 3,
      name: 'Smartwatches',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 4,
      name: 'Headphones',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`py-16 px-6 bg-dark ${className || ''}`} ref={categoriesRef}>
      <h2 className="text-3xl font-bold text-white text-center mb-12 animate-fadeIn">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {categories.map((category, index) => (
          <a
            key={category.id}
            href={`#${category.name.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
            className={`category-card bg-gray-800 hover:bg-gray-700 rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-300 opacity-0`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="text-white mb-4 hover:animate-pulse">{category.icon}</div>
            <h3 className="text-white text-lg font-medium">{category.name}</h3>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Categories;