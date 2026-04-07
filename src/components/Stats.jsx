import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

const stats = [
  { value: 500, suffix: '+', label: 'Seniors Served' },
  { value: 10,  suffix: '+', label: 'Trusted Partners' },
  { value: 5,   suffix: '',  label: 'Days a Week' },
  { value: 1,   suffix: '',  label: 'Only Center in Suffolk' },
];

function StatItem({ value, suffix, label, animate }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate) return;

    const duration = 1500; // ms
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCount(Math.round(progress * value));
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [animate, value]);

  return (
    <div className="flex flex-col items-center gap-2 py-10 px-4">
      <span className="font-serif text-5xl font-bold text-white">
        {count}{suffix}
      </span>
      <span className="font-sans text-white/90 text-base text-center">
        {label}
      </span>
    </div>
  );
}

function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="stats" ref={ref} className="bg-gold">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            animate={isInView}
          />
        ))}
      </div>
    </section>
  );
}

export default Stats;
