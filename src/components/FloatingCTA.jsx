import { motion } from 'framer-motion';
import { FaPhone } from 'react-icons/fa';

function FloatingCTA() {
  return (
    <div className="block md:hidden">
      <motion.a
        href="tel:5165100267"
        aria-label="Call Uthan Senior Home Care"
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg"
        style={{ backgroundColor: '#C8972B' }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [1, 0.85, 1],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <FaPhone className="text-white text-xl" />
      </motion.a>
    </div>
  );
}

export default FloatingCTA;
