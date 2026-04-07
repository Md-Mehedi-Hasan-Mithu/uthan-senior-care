import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiCheckCircle, FiClock, FiMapPin, FiHeart } from 'react-icons/fi';

const highlights = [
  {
    icon: FiMapPin,
    title: "Suffolk County's Only Center",
    desc: "The only Social Adult Day Care of our kind serving the diverse communities of Suffolk County, Long Island.",
  },
  {
    icon: FiHeart,
    title: 'Culturally Inclusive Care',
    desc: 'We provide culturally appropriate services so every senior feels seen, respected, and at home.',
  },
  {
    icon: FiClock,
    title: 'Mon – Fri, 10 AM – 3 PM',
    desc: 'Five days a week of structured, enriching programming — breakfast, lunch, healthy snacks included.',
  },
  {
    icon: FiCheckCircle,
    title: 'Licensed & Certified',
    desc: 'Fully licensed by New York State and certified by the Department of Health, Office for the Aging, and OMIG.',
  },
];

const dailyItems = [
  'Breakfast, lunch & healthy snacks',
  'Gentle exercise & yoga',
  'Meditation & mindfulness',
  'Engaging games & activities',
  'Educational opportunities',
  'Community & social connection',
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="about" className="bg-white">

      {/* ════════════════════════════════════════
          BLOCK 1 — Mission + Highlight cards
          White background, standard padding
      ════════════════════════════════════════ */}
      <div className="py-24 px-4">
        <div className="max-w-6xl mx-auto" ref={ref}>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              Who We Are
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-navy font-bold leading-tight max-w-3xl mx-auto">
              Suffolk County's Social Adult Day Care — Built for Your Family
            </h2>
          </motion.div>

          {/* Mission text (left) + Highlight cards (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              <p className="text-gray-600 text-lg leading-relaxed">
                At <strong className="text-navy">Uthan Senior Home Care</strong>, we provide a{' '}
                <strong className="text-gold">Social Adult Day Care Program</strong> for seniors who
                benefit from companionship, stimulation, and structured activities — all in a warm,
                welcoming environment on Deer Park Avenue.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Each day includes <strong className="text-navy">breakfast, lunch, healthy snacks,
                gentle exercise, yoga and meditation, engaging games, activities, and educational
                opportunities</strong> — all carefully designed to enhance well-being.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We welcome participants <strong className="text-navy">Monday through Friday,
                10:00 AM – 3:00 PM</strong>.
              </p>
              <div className="bg-warm rounded-2xl p-6">
                <p className="text-sm font-semibold text-navy uppercase tracking-widest mb-4">Each Day Includes</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dailyItems.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {highlights.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                  className="bg-warm rounded-2xl p-5 flex flex-col gap-3 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <h3 className="font-semibold text-navy text-sm leading-snug">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          BLOCK 2 — "Who We Are" text + Portrait promo video
          Warm background, text left / video right
          Portrait video looks great in a phone-like frame
      ════════════════════════════════════════ */}
      <div className="bg-warm py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left — "Who We Are" copy */}
            <div className="flex flex-col gap-6 order-2 lg:order-1">
              <div className="flex items-center gap-3">
                <span className="w-8 h-0.5 bg-gold" />
                <p className="text-gold text-xs font-semibold uppercase tracking-widest">Our Story</p>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-navy font-bold leading-snug">
                Bridging the Gap for Suffolk County Seniors
              </h3>
              <p className="text-gray-600 leading-relaxed">
                In Suffolk County, senior communities are growing rapidly — yet often face barriers to
                care. At Uthan Senior Home Care, we are dedicated to ensuring they have the{' '}
                <strong className="text-navy">resources, support, and culturally appropriate services</strong>{' '}
                needed to thrive and age with dignity.
              </p>
              <p className="text-gray-600 leading-relaxed">
                As the <strong className="text-navy">only adult care center in Suffolk County</strong>{' '}
                serving these communities, we actively collaborate with local leaders, universities, and
                healthcare partners to create lasting impact for seniors and their families.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {['Licensed', 'Compassionate Care', 'Suffolk County', 'Culturally Inclusive'].map((tag) => (
                  <span key={tag} className="bg-gold/10 text-gold border border-gold/20 text-xs font-semibold px-4 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Portrait promo video in a styled phone-like frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <div className="relative w-full max-w-[480px]">
                {/* Decorative green offset shadow */}
                <div className="absolute -bottom-3 -right-3 w-full h-full rounded-3xl bg-gold/20" />
                {/* Video card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <div className="bg-navy px-4 py-2.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-white text-xs font-semibold">Uthan Senior Home Care</span>
                  </div>
                  {/* Portrait ratio: 74.07% ≈ 9:12 */}
                  <div className="relative w-full" style={{ paddingTop: '74.07%' }}>
                    <iframe
                      src="https://player.vimeo.com/video/1118787181?h=a3f8907e0e&badge=0&autopause=0&player_id=0&app_id=58479"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="absolute inset-0 w-full h-full border-0"
                      title="Uthan Senior Home Care — Center Overview"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          BLOCK 3 — Landscape activity video, full-width cinematic
          Dark navy background for maximum impact
      ════════════════════════════════════════ */}
      <div className="bg-navy py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-8">
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">See It for Yourself</p>
              <h3 className="font-serif text-2xl md:text-3xl text-white font-bold">
                A Day in the Life at Uthan
              </h3>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src="https://player.vimeo.com/video/1116313218?h=8b3fa88b66&badge=0&autopause=0&player_id=0&app_id=58479"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 w-full h-full border-0"
                  title="Uthan Senior Home Care — Daily Activities"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          BLOCK 4 — Compassion / Trust / Care CTA strip
      ════════════════════════════════════════ */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="bg-gold/5 border border-gold/20 rounded-3xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
          >
            <div>
              <p className="text-gold text-xs uppercase tracking-widest mb-1 font-semibold">Our Promise</p>
              <h3 className="font-serif text-2xl md:text-3xl text-navy font-bold">
                Compassion. Trust. Care.
              </h3>
            </div>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed">
              A trusted family plan for your loved ones — where every senior is treated with the
              dignity and warmth they deserve, every single day.
            </p>
            <a
              href="tel:5165100267"
              className="flex-shrink-0 inline-block px-7 py-3 bg-gold text-white font-semibold text-sm rounded-full hover:bg-green-dark transition shadow-md"
            >
              Call (516) 510-0267
            </a>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
