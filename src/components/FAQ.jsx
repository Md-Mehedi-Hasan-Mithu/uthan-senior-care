import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import faqs from '../data/faqs';

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="bg-warm py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-navy text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full flex items-center justify-between px-6 py-5 text-left text-navy font-sans font-medium text-base md:text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span>{faq.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 flex-shrink-0 text-gold text-2xl leading-none"
                    aria-hidden="true"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={faq.id}
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-l-4 border-gold mx-6 mb-5 pl-4">
                        <p className="text-gray-600 font-sans text-sm md:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
