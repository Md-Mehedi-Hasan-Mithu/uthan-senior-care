import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaShieldAlt, FaHeart, FaMapMarkerAlt, FaStar } from "react-icons/fa";

const trustCards = [
  {
    icon: FaShieldAlt,
    title: "Licensed & Certified",
    description:
      "We are a fully licensed Social Adult Day Care center, meeting all New York State regulatory standards to ensure the highest quality of care for your loved one.",
  },
  {
    icon: FaHeart,
    title: "Compassionate Team",
    description:
      "Our dedicated caregivers bring warmth, patience, and genuine compassion to every interaction — treating each senior as a valued member of our family.",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Conveniently Located",
    description:
      "Situated in the heart of Deer Park, Suffolk County, we offer accessible transportation services so getting to and from our center is never a barrier.",
  },
  {
    icon: FaStar,
    title: "Proven Track Record",
    description:
      "With over 500 seniors served, our center has built a trusted reputation for excellence in adult day care throughout the Suffolk County community.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const quoteVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.4 } },
};

function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="why-choose-us" className="bg-navy text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-gold">Uthan Senior Care</span>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-base md:text-lg">
            Families across Suffolk County trust us to care for their loved ones. Here's why.
          </p>
        </div>

        {/* Trust Cards Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {trustCards.map(({ icon: Icon, title, description }) => (
            <motion.article
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 flex gap-5 hover:bg-white/10 transition-colors duration-300"
              variants={cardVariants}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Icon className="text-gold text-xl" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-2">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Pull Quote */}
        <motion.div
          className="text-center"
          variants={quoteVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <blockquote className="relative inline-block max-w-2xl mx-auto">
            <span className="absolute -top-6 left-0 text-gold text-6xl font-serif leading-none select-none" aria-hidden="true">
              "
            </span>
            <p className="font-serif text-2xl md:text-3xl italic text-white/90 px-8">
              Every senior deserves dignity, connection, and joy.
            </p>
            <span className="absolute -bottom-8 right-0 text-gold text-6xl font-serif leading-none select-none" aria-hidden="true">
              "
            </span>
            <footer className="mt-6 text-gold text-sm font-sans tracking-widest uppercase">
              — Uthan Senior Home Care
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
