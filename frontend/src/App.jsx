import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import FeaturedProducts from './components/FeaturedProducts'
import AllProducts from './components/AllProducts'
import Brands from './components/Brands'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    // Function to handle scroll animations
    const handleScrollAnimation = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate-fadeIn');
        }
      });
    };

    // Add event listener for scroll
    window.addEventListener('scroll', handleScrollAnimation);
    // Run once on initial load
    handleScrollAnimation();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScrollAnimation);
    };
  }, []);

  return (
    <div className="bg-dark">
      <Navbar className="animate-slideInDown" />
      <main>
        <Hero className="animate-fadeIn" />
        <Categories className="animate-on-scroll" />
        <FeaturedProducts className="animate-on-scroll" />
        <AllProducts className="animate-on-scroll" />
        <Brands className="animate-on-scroll" />
        <Testimonials className="animate-on-scroll" />
      </main>
      <Footer className="animate-on-scroll" />
    </div>
  )
}

export default App
