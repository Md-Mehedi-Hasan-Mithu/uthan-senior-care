import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import services from '../data/services.js';
import serviceImage from '../images/services.webp';

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
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center mb-14">
          <div className="space-y-6">
            <span className="inline-block bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full">
              Our Services
            </span>
            <div>
              <h2 className="font-serif text-4xl text-navy font-bold mb-3">
                Care, connection, and daily support made simple.
              </h2>
              <p className="text-gray-600 text-lg max-w-xl">
                Comprehensive care programs designed to enrich the lives of seniors every day with structured activities, nutritious meals, transportation support, and compassionate guidance.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Daily activities', 'Nutritious meals', 'Reliable transport'].map((item) => (
                <div key={item} className="rounded-3xl bg-white/90 border border-gray-200 p-4 text-sm text-gray-600 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border border-white">
            <img
              src={serviceImage}
              alt="Seniors receiving care in a welcoming community center"
              className="w-full h-full min-h-[320px] object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-navy/75 p-5">
              <p className="text-gold text-xs uppercase tracking-[0.25em] mb-2">Trusted care in action</p>
              <h3 className="text-white text-xl font-semibold">A welcoming environment for every visit</h3>
            </div>
          </div>
        </div>

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
