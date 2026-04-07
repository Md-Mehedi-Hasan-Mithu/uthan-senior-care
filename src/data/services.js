import { FaGamepad, FaUsers, FaUtensils, FaBus, FaHandsHelping } from 'react-icons/fa';
import { GiMeditation } from 'react-icons/gi';

const services = [
  {
    id: 'recreational-activities',
    icon: FaGamepad,
    title: 'Recreational Activities',
    description:
      'Engaging games, arts and crafts, music, and social events designed to keep seniors mentally stimulated and joyfully connected every day.',
  },
  {
    id: 'family-counseling',
    icon: FaUsers,
    title: 'Family Counseling',
    description:
      'Supportive guidance and resources for families navigating the caregiving journey, helping loved ones feel informed and at ease.',
  },
  {
    id: 'nutritious-meals',
    icon: FaUtensils,
    title: 'Nutritious Meals',
    description:
      "Freshly prepared, balanced meals and snacks tailored to seniors' dietary needs, served in a warm and welcoming dining environment.",
  },
  {
    id: 'transportation',
    icon: FaBus,
    title: 'Transportation',
    description:
      'Safe, reliable door-to-door transportation to and from the center, ensuring every participant arrives comfortably and on time.',
  },
  {
    id: 'community-engagement',
    icon: FaHandsHelping,
    title: 'Community Engagement',
    description:
      'Organized outings, volunteer opportunities, and local events that foster a sense of belonging and purpose within the broader community.',
  },
  {
    id: 'yoga-meditation',
    icon: GiMeditation,
    title: 'Yoga & Meditation',
    description:
      'Gentle yoga sessions and guided meditation practices that promote physical flexibility, stress relief, and overall mental well-being.',
  },
];

export default services;
