import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FiChevronDown } from 'react-icons/fi';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Label pill */}
        <motion.span
          variants={itemVariants}
          className="inline-block bg-gold/20 border border-gold text-gold text-sm font-sans font-medium px-4 py-1 rounded-full mb-6 tracking-wide"
        >
          Social Adult Day Care
        </motion.span>

        {/* Primary heading */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
        >
          Compassionate Care for Your Loved Ones
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="font-sans text-lg sm:text-xl text-white/85 mb-10 max-w-xl"
        >
          Providing a safe, engaging, and nurturing environment for seniors in Deer Park, Suffolk County, New York.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="services"
            smooth
            offset={-80}
            duration={600}
            className="cursor-pointer bg-gold hover:bg-gold/90 text-white font-sans font-semibold px-8 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
          >
            Explore Our Services
          </Link>
          <Link
            to="contact"
            smooth
            offset={-80}
            duration={600}
            className="cursor-pointer border-2 border-white text-white hover:bg-white hover:text-navy font-sans font-semibold px-8 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            Contact Us
          </Link>
        </motion.div>
      </motion.div>

      {/* Bouncing scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <FiChevronDown size={32} />
      </motion.div>
    </section>
  );
}

export default Hero;
