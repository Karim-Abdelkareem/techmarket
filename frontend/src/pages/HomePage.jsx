import Hero from '../components/Hero'
import Categories from '../components/Categories'
import FeaturedProducts from '../components/FeaturedProducts'
import AllProducts from '../components/AllProducts'
import Brands from '../components/Brands'
import Testimonials from '../components/Testimonials'

function HomePage() {
  return (
    <main>
      <Hero className="animate-fadeIn" />
      <Categories className="animate-on-scroll" />
      <FeaturedProducts className="animate-on-scroll" />
      <AllProducts className="animate-on-scroll" />
      <Brands className="animate-on-scroll" />
      <Testimonials className="animate-on-scroll" />
    </main>
  )
}

export default HomePage