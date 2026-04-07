import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const badges = ['Licensed', 'Compassionate Care', 'Suffolk County'];

function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="bg-warm py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left column */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <h2 className="font-serif text-4xl text-navy leading-tight">
              About Uthan Senior Home Care
            </h2>

            <p className="font-sans text-gray-700 leading-relaxed">
              Uthan Senior Home Care is a licensed Social Adult Day Care center nestled in the heart
              of Deer Park, Suffolk County, New York. Our mission is to enrich the lives of seniors
              by providing a safe, nurturing, and engaging environment where they can thrive — and
              where families can find peace of mind.
            </p>

            <p className="font-sans text-gray-700 leading-relaxed">
              We believe every senior deserves dignity, connection, and joy. Our dedicated team of
              caregivers and activity specialists craft daily programs that stimulate the mind, body,
              and spirit — from yoga and meditation to nutritious meals and community outings.
            </p>

            <p className="font-sans text-gray-700 leading-relaxed">
              As the only Social Adult Day Care center of our kind in Suffolk County, we are proud
              to serve over 500 seniors and their families with compassion, professionalism, and
              unwavering commitment to quality care.
            </p>

            {/* Badge pills */}
            <div className="flex flex-wrap gap-3 mt-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="bg-gold/10 text-gold border border-gold/30 font-sans text-sm font-semibold px-4 py-1.5 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right column — image with gold frame */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative">
              {/* Gold decorative offset box */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-gold rounded-lg" />
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                alt="Caregiver warmly assisting a senior at Uthan Senior Home Care"
                className="relative z-10 w-full max-w-md rounded-lg object-cover shadow-lg"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
