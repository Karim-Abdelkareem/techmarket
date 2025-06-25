import { useEffect, useState } from 'react';

const Hero = () => {
  const [gradientPosition, setGradientPosition] = useState(0);
  
  useEffect(() => {
    const animateGradient = () => {
      const interval = setInterval(() => {
        setGradientPosition(prev => (prev + 1) % 200);
      }, 50);
      
      return () => clearInterval(interval);
    };
    
    const animation = animateGradient();
    return () => animation;
  }, []);
  
  const gradientStyle = {
    background: `linear-gradient(135deg, 
      rgba(30, 41, 59, 1) 0%, 
      rgba(17, 24, 39, 1) 25%, 
      rgba(79, 70, 229, 0.3) ${gradientPosition}%, 
      rgba(17, 24, 39, 1) ${gradientPosition + 20}%, 
      rgba(30, 41, 59, 1) 100%)`,
    backgroundSize: '200% 200%',
  };
  
  return (
    <div className="py-20 px-6 text-center relative overflow-hidden" style={gradientStyle}>
      <div className="relative z-10">
        <h1 className="text-5xl font-bold text-white mb-6 animate-fadeIn">Your Ultimate Tech Destination</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-10 animate-fadeIn delay-100">
          Discover the latest electronic devices and accessories at unbeatable prices. 
          From smartphones to laptops, we've got your tech needs covered.
        </p>
        <div className="flex justify-center space-x-4 animate-fadeIn delay-200">
          <a 
            href="#products" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full flex items-center transition-all duration-300 hover:scale-105"
          >
            Shop Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
          <a 
            href="#deals" 
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-md transition-all duration-300 hover:scale-105"
          >
            View deals
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;