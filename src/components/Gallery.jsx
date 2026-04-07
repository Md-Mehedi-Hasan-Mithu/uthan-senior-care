import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// Real photos from the center
import img1 from '../images/rs6(1).webp';
import img2 from '../images/rs6 (2).webp';
import img3 from '../images/rs6 (3).webp';
import img4 from '../images/rs6 (4).webp';
import img5 from '../images/rs6 (5).webp';
import img6 from '../images/rs6 (6).webp';

const photos = [
  { src: img1, caption: 'Our welcoming center at 1872 Deer Park Avenue' },
  { src: img2, caption: 'Seniors enjoying daily activities together' },
  { src: img3, caption: 'Therapeutic sessions with our caring staff' },
  { src: img4, caption: 'Community gathering and group discussions' },
  { src: img5, caption: 'Engaging programs every day of the week' },
  { src: img6, caption: 'A place where seniors thrive and connect' },
];

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState(null); // lightbox index

  // Auto-advance lightbox
  useEffect(() => {
    if (active === null) return;
    const t = setTimeout(() => setActive(null), 8000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section className="bg-warm py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Life at Uthan
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-navy font-bold">
            See Our Community in Action
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
            Real moments from our center — seniors connecting, learning, and thriving every day.
          </p>
        </motion.div>

        {/* Masonry-style animated grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl shadow-md ${
                i === 0 ? 'md:row-span-2' : ''
              }`}
              style={{ aspectRatio: i === 0 ? '3/4' : '4/3' }}
              onClick={() => setActive(i)}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-all duration-300 flex items-end">
                <p className="text-white text-xs font-medium px-4 py-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {photo.caption}
                </p>
              </div>
              {/* Green corner accent */}
              <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center px-4"
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative max-w-3xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={photos[active].src}
                  alt={photos[active].caption}
                  className="w-full rounded-2xl shadow-2xl object-cover max-h-[80vh]"
                />
                <p className="text-white/80 text-sm text-center mt-3">{photos[active].caption}</p>

                {/* Prev / Next */}
                <button
                  onClick={() => setActive((active - 1 + photos.length) % photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition"
                  aria-label="Previous photo"
                >‹</button>
                <button
                  onClick={() => setActive((active + 1) % photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition"
                  aria-label="Next photo"
                >›</button>

                {/* Close */}
                <button
                  onClick={() => setActive(null)}
                  className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-gold text-white flex items-center justify-center hover:bg-green-dark transition text-lg"
                  aria-label="Close"
                >×</button>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-gold w-5' : 'bg-white/40'}`}
                      aria-label={`Go to photo ${i + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
