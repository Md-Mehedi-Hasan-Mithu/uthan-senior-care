import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import services from '../data/services.js';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="services" className="bg-[#FBF8F3] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl text-navy font-bold mb-3">Our Services</h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Comprehensive care programs designed to enrich the lives of seniors every day.
          </p>
        </div>

        {/* Card grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.article
              key={service.id}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-md border-t-4 border-gold p-7 flex flex-col gap-4"
            >
              <div className="text-gold">
                <service.icon size={32} aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{service.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Services;
