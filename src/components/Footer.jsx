import { Link } from 'react-scroll';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import logo from '../images/logo.webp';

const QUICK_LINKS = [
  { label: 'About', to: 'about' },
  { label: 'Services', to: 'services' },
  { label: 'FAQ', to: 'faq' },
  { label: 'Contact', to: 'contact' },
];

const SERVICE_LINKS = [
  'Recreational Activities', 'Family Counseling', 'Nutritious Meals',
  'Transportation', 'Community Engagement', 'Yoga & Meditation',
];

const SOCIAL_LINKS = [
  { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/uthanseniorcare/' },
  { icon: FaFacebook, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61577295680997' },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: Brand */}
          <div>
            <img src={logo} alt="Uthan Senior Care" className="h-12 w-auto object-contain mb-4" />
            <p className="font-sans text-sm text-white/70 leading-relaxed mb-5">
              Compassionate Social Adult Day Care in Deer Park, Suffolk County, New York.
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="text-white/60 hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-gold mb-4 uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-2" role="list">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} smooth offset={-80} duration={500} tabIndex={0}
                    className="font-sans text-sm text-white/70 hover:text-gold transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-gold mb-4 uppercase tracking-widest">Our Services</h3>
            <ul className="space-y-2" role="list">
              {SERVICE_LINKS.map((name) => (
                <li key={name}>
                  <Link to="services" smooth offset={-80} duration={500} tabIndex={0}
                    className="font-sans text-sm text-white/70 hover:text-gold transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-gold mb-4 uppercase tracking-widest">Contact Us</h3>
            <address className="not-italic font-sans text-sm text-white/70 space-y-3 leading-relaxed">
              <p>1872 Deer Park Avenue<br />Deer Park, New York 11729</p>
              <p><a href="tel:5165100267" className="hover:text-gold transition">(516) 510-0267</a></p>
              <p><a href="mailto:uthancare@uthanseniorcare.com" className="hover:text-gold transition break-all">uthancare@uthanseniorcare.com</a></p>
              <p>Mon – Fri: 10:00 AM – 3:00 PM</p>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="font-sans text-xs text-white/50">
            © {year} Uthan Senior Home Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
