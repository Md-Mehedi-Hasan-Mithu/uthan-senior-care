# Implementation Plan: Uthan Senior Home Care Website

## Overview

Build the complete React + Vite + Tailwind CSS SPA from the existing scaffold. Tasks proceed in dependency order: configuration → data → utilities → shell → sections → tests → build verification.

## Tasks

- [x] 1. Install dependencies and configure the project
  - Run `npm install framer-motion react-router-dom react-icons @emailjs/browser react-scroll` to add all runtime dependencies
  - Run `npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event fast-check jsdom` to add test dependencies
  - Create `tailwind.config.js` extending the default theme with brand color tokens (`gold: '#C8972B'`, `navy: '#1A2B4A'`, `warm: '#F9F6F0'`, `cream: '#FBF8F3'`) and font families (`serif: ['Playfair Display', 'Georgia', 'serif']`, `sans: ['DM Sans', 'system-ui', 'sans-serif']`)
  - Replace `src/index.css` with Tailwind directives (`@tailwind base/components/utilities`) and Google Fonts `@import` for Playfair Display and DM Sans
  - Update `vite.config.js` to add the Vitest `test` block (`environment: 'jsdom'`, `setupFiles: ['./src/test/setup.js']`, `globals: true`)
  - Create `src/test/setup.js` importing `@testing-library/jest-dom`
  - Create `public/.htaccess` with Apache rewrite rules that redirect all non-asset requests to `index.html`
  - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [x] 2. Update `index.html` with SEO meta tags and font preconnects
  - Set `<title>` to "Uthan Senior Home Care | Social Adult Day Care – Deer Park, NY"
  - Add `<meta name="description">` describing the center's services and location
  - Add `<meta name="keywords">` covering adult day care, senior care, Deer Park, Suffolk County, New York
  - Add Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`
  - Add Google Fonts `<link rel="preconnect">` tags and the stylesheet import for Playfair Display and DM Sans
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 3. Create data modules
  - [x] 3.1 Create `src/data/services.js` exporting an array of exactly six service objects (`id`, `icon` as a React Icons component reference, `title`, `description`) for: Recreational Activities, Family Counseling, Nutritious Meals, Transportation, Community Engagement, Yoga & Meditation
    - _Requirements: 7.1, 7.2_
  - [x] 3.2 Create `src/data/faqs.js` exporting an array of exactly six FAQ objects (`id`, `question`, `answer`) covering eligibility, hours, transportation, meals, activities, and enrollment
    - _Requirements: 10.1, 10.2_

- [ ] 4. Implement utility components
  - [x] 4.1 Create `src/components/ScrollToTop.jsx` — uses `useLocation` from react-router-dom; `useEffect` calls `window.scrollTo(0, 0)` on every `pathname` change; renders `null`
    - _Requirements: 14.1, 14.2_
  - [x] 4.2 Create `src/components/FloatingCTA.jsx` — fixed bottom-right gold phone button (`<a href="tel:5165100267">`), visible only on mobile (`block md:hidden`), with a continuous pulse animation via Framer Motion
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ] 5. Build the App shell and Home page
  - [x] 5.1 Rewrite `src/App.jsx` — wraps everything in `BrowserRouter`; renders `<ScrollToTop />` and `<FloatingCTA />` globally; defines a `<Route path="/" element={<Home />} />` inside `<Routes>`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 5.2 Create `src/pages/Home.jsx` — renders all nine section components in order inside a `<main>` element: Navbar, Hero, About, Services, Stats, WhyChooseUs, FAQ, Contact, Footer
    - _Requirements: 3.5_

- [x] 6. Implement Navbar
  - Create `src/components/Navbar.jsx`
  - Track `scrolled` state with a `useEffect` scroll listener (threshold: 80px); apply `bg-navy shadow` when scrolled, transparent otherwise
  - Track `menuOpen` state for the mobile hamburger toggle
  - Render logo on the left; desktop nav links (About, Services, FAQ, Contact) using react-scroll `<Link>` with `smooth={true}` and `offset={-80}`; gold "Get Started" CTA button scrolling to Contact
  - Render hamburger icon on mobile; animate the dropdown menu with Framer Motion `AnimatePresence`; close the menu when any link is clicked
  - Use semantic `<header>` and `<nav>` elements; all interactive elements must be keyboard-navigable
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 15.1, 15.3_

- [x] 7. Implement Hero section
  - Create `src/components/Hero.jsx`
  - Full-viewport height (`min-h-screen`); background image from Unsplash photo-1529156069898-49953e39b3ac with `bg-black/50` overlay
  - Render label pill, primary `<h1>` heading, and subheadline centered in the viewport
  - Render two react-scroll CTA buttons: primary gold "Explore Our Services" (→ `#services`) and secondary outlined "Contact Us" (→ `#contact`)
  - Render a bouncing scroll indicator arrow at the bottom
  - Animate all content with Framer Motion `staggerChildren` on the container variant
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 15.1, 15.2_

- [x] 8. Implement About section
  - Create `src/components/About.jsx`
  - `bg-warm` background; two-column desktop grid (`grid-cols-1 md:grid-cols-2`), stacked on mobile
  - Left column: section heading, mission text, badge pills (Licensed, Compassionate Care, Suffolk County)
  - Right column: Unsplash image photo-1576765608535-5f04d1e3f289 with a decorative gold frame treatment; non-empty `alt` attribute
  - Animate content with Framer Motion `useInView` scroll-triggered variants
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 15.1, 15.2_

- [x] 9. Implement Services section
  - Create `src/components/Services.jsx`
  - Import the services array from `src/data/services.js`
  - Three-column card grid on desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), single column on mobile
  - Each card: gold top border, icon, title, description
  - Animate cards with Framer Motion `staggerChildren` triggered by `useInView`
  - Section must have `id="services"` for react-scroll targeting
  - _Requirements: 7.3, 7.4, 7.5, 7.6, 15.1_

- [x] 10. Implement Stats section
  - Create `src/components/Stats.jsx`
  - `bg-gold` background; four stats in a `grid-cols-2 md:grid-cols-4` grid
  - Stats: "500+ Seniors Served", "10+ Trusted Partners", "5 Days a Week", "1 Only Center in Suffolk"
  - Count-up animation using `useEffect` + `setInterval` triggered by `useInView`
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 15.1_

- [x] 11. Implement WhyChooseUs section
  - Create `src/components/WhyChooseUs.jsx`
  - `bg-navy text-white` background; four trust cards in a `grid-cols-1 md:grid-cols-2` grid
  - Each card: icon, title, supporting description
  - Decorative pull quote `<blockquote>` reinforcing the center's mission
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 15.1_

- [x] 12. Implement FAQ section
  - Create `src/components/FAQ.jsx`
  - Import the faqs array from `src/data/faqs.js`
  - `bg-warm` background; `activeIndex` state (number | null)
  - Clicking an item sets `activeIndex` to that item's index; clicking the active item sets it to `null`; opening a new item automatically closes the previous one
  - Open item displays answer with a gold left border
  - Animate open/close transitions with Framer Motion `AnimatePresence`
  - Section must have `id="faq"` for react-scroll targeting
  - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 15.1_

- [x] 13. Implement Contact section
  - Create `src/components/Contact.jsx`
  - Two-column desktop layout (`grid-cols-1 md:grid-cols-2`), stacked on mobile
  - Left panel (`bg-navy`): address (1872 Deer Park Avenue, Deer Park, New York 11729), phone ((516) 510-0267), email (uthancare@uthanseniorcare.com), hours (Monday–Friday, 10:00 AM – 3:00 PM)
  - Right panel: form with fields for name, email, phone, message; form state and validation errors state as described in the design
  - On submit: validate all required fields are non-empty (trimmed) and email matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`; display per-field error messages on failure without calling EmailJS
  - On valid submit: call `emailjs.sendForm()` with the correct service/template IDs; set `status = 'success'` on resolve; set `status = 'error'` on reject and display the fallback error banner with phone/email
  - Section must have `id="contact"` for react-scroll targeting
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 15.1, 15.3_

- [x] 14. Implement Footer
  - Create `src/components/Footer.jsx`
  - `bg-navy` dark background with light text; four-column grid on desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`), stacked on mobile
  - Column 1: brand logo and tagline; Column 2: quick links (react-scroll); Column 3: services links (react-scroll); Column 4: contact info
  - Social media icon links using React Icons
  - Copyright notice using `new Date().getFullYear()` dynamically
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 15.1_

- [x] 15. Checkpoint — wire everything together and verify the dev build
  - Ensure all components are imported and rendered correctly in `Home.jsx`
  - Verify all react-scroll `to` targets match the `id` attributes on each section
  - Ensure all images have non-empty `alt` attributes
  - Ensure all interactive elements have visible focus indicators
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Write property-based tests
  - [ ]* 16.1 Write property test for Property 1 — Services data completeness
    - Use `fc.integer({ min: 0, max: 5 })` to index into the services array; assert `icon != null`, `title.length > 0`, `description.length > 0`; assert `services.length === 6`
    - **Property 1: Services data completeness**
    - **Validates: Requirements 7.1, 7.4**
  - [ ]* 16.2 Write property test for Property 2 — Service card renders all required elements
    - Use `fc.constantFrom(...services)` to pick any service; render the card; assert gold border element, icon, title, and description are present in the output
    - **Property 2: Service card renders all required elements**
    - **Validates: Requirements 7.4**
  - [ ]* 16.3 Write property test for Property 3 — FAQ data completeness
    - Use `fc.integer({ min: 0, max: 5 })` to index into the faqs array; assert `question.length > 0` and `answer.length > 0`; assert `faqs.length === 6`
    - **Property 3: FAQ data completeness**
    - **Validates: Requirements 10.1**
  - [ ]* 16.4 Write property test for Property 4 — FAQ accordion mutual exclusion
    - Use two distinct integer arbitraries (0–5) for indices i and j; render the FAQ component; open item i then open item j; assert only item j's answer panel is visible
    - **Property 4: FAQ accordion mutual exclusion**
    - **Validates: Requirements 10.4, 10.7**
  - [ ]* 16.5 Write property test for Property 5 — Contact form rejects empty required fields
    - Use `fc.record` with `fc.oneof(fc.constant(''), fc.string())` for each field, filtered so at least one field is empty; render Contact; fill fields and submit; assert EmailJS mock was not called and at least one error message is visible
    - **Property 5: Contact form rejects empty required fields**
    - **Validates: Requirements 11.4**
  - [ ]* 16.6 Write property test for Property 6 — Contact form rejects invalid email formats
    - Use `fc.string().filter(s => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))` for the email field; fill all other fields with valid non-empty values; submit; assert email error is shown and EmailJS mock was not called
    - **Property 6: Contact form rejects invalid email formats**
    - **Validates: Requirements 11.5**
  - [ ]* 16.7 Write property test for Property 7 — ScrollToTop fires on every route change
    - Use `fc.string()` for two distinct pathnames; wrap ScrollToTop in a MemoryRouter; spy on `window.scrollTo`; navigate between paths; assert `window.scrollTo(0, 0)` was called exactly once per navigation
    - **Property 7: ScrollToTop fires on every route change**
    - **Validates: Requirements 14.2**
  - [ ]* 16.8 Write property test for Property 8 — All rendered images have non-empty alt attributes
    - Render each component individually; query all `<img>` elements; assert every element has a non-empty `alt` attribute
    - **Property 8: All rendered images have non-empty alt attributes**
    - **Validates: Requirements 15.2**
  - [ ]* 16.9 Write property test for Property 9 — Footer copyright year is current
    - Use `fc.integer({ min: 2020, max: 2100 })` for the year; mock `Date.prototype.getFullYear` to return that year; render Footer; assert the copyright text contains the mocked year as a string
    - **Property 9: Footer copyright year is current**
    - **Validates: Requirements 12.5**

- [x] 17. Final checkpoint — build verification
  - Run `npm run build` and confirm the `dist/` directory is produced without errors
  - Confirm `dist/.htaccess` is present (copied from `public/`)
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties defined in the design document
- Unit tests and integration tests are complementary to property tests and can be added as additional optional sub-tasks
