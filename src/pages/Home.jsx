import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Services from '../components/Services';
import Stats from '../components/Stats';
import WhyChooseUs from '../components/WhyChooseUs';
import Partners from '../components/Partners';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Gallery />
      <Services />
      <Stats />
      <WhyChooseUs />
      <Partners />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}

export default Home;
