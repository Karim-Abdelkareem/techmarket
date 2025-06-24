import { useState, useEffect, useRef } from 'react';

const Brands = () => {
  const brands = [
    { id: 1, name: 'Lenovo', type: 'text' },
    { id: 2, name: 'Dell', type: 'icon', icon: 'circle' },
    { id: 3, name: 'HP', type: 'icon', icon: 'square' },
    { id: 4, name: 'SAMSUNG', type: 'text' },
    { id: 5, name: 'SONY', type: 'text' },
    { id: 6, name: 'Apple', type: 'text' },
    { id: 7, name: 'Microsoft', type: 'icon', icon: 'circle' },
    { id: 8, name: 'Asus', type: 'icon', icon: 'square' },
  ];

  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollSpeed = 1; // pixels per frame

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clone the first few items and append them to the end for seamless looping
    const scrollInterval = setInterval(() => {
      if (container.scrollWidth > 0) {
        setScrollPosition((prevPos) => {
          const newPos = prevPos + scrollSpeed;
          // Reset position when we've scrolled through all original items
          if (newPos >= container.scrollWidth / 2) {
            return 0;
          }
          return newPos;
        });
      }
    }, 30); // Update every 30ms for smooth animation

    return () => clearInterval(scrollInterval);
  }, []);

  // Render brand item based on type
  const renderBrandItem = (brand) => {
    if (brand.type === 'text') {
      return (
        <div key={brand.id} className=" px-4 py-2 rounded transform hover:scale-105 transition-transform duration-300">
          <span className="text-gray-300 font-medium">{brand.name}</span>
        </div>
      );
    } else if (brand.type === 'icon') {
      if (brand.icon === 'circle') {
        return (
          <div key={brand.id} className="transform hover:scale-105 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
            </svg>
          </div>
        );
      } else {
        return (
          <div key={brand.id} className="transform hover:scale-105 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="py-16 px-6  overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12 animate-fadeIn">Providing top notch brands</h2>
        
        <div className="relative">
          {/* Auto-scrolling container */}
          <div 
            ref={containerRef}
            className="flex items-center py-4 whitespace-nowrap overflow-hidden"
          >
            {/* First set of brands */}
            <div 
              className="flex items-center gap-8 md:gap-16 animate-slide"
              style={{ transform: `translateX(-${scrollPosition}px)` }}
            >
              {brands.map(brand => renderBrandItem(brand))}
            </div>
            
            {/* Duplicated set for seamless looping */}
            <div 
              className="flex items-center gap-8 md:gap-16 animate-slide"
              style={{ transform: `translateX(-${scrollPosition}px)` }}
            >
              {brands.map(brand => renderBrandItem({ ...brand, id: `${brand.id}-dup` }))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;