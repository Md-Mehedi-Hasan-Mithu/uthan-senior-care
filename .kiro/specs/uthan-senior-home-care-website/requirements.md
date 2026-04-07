# Requirements Document

## Introduction

Uthan Senior Home Care is a Social Adult Day Care center located in Deer Park, Suffolk County, New York. The existing website at uthanseniorcare.com is built on GoDaddy Website Builder and must be replaced with a custom, production-grade React + Vite + Tailwind CSS application. The new site must convey warmth, trust, and professionalism — consistent with a premium healthcare brand — while remaining fully accessible and mobile-first. It must present the center's services, build family confidence, and drive contact inquiries.

## Glossary

- **Website**: The complete React + Vite single-page application deployed to uthanseniorcare.com
- **Navbar**: The fixed top navigation bar component
- **Hero**: The full-viewport introductory section at the top of the page
- **About**: The section describing the center's mission and background
- **Services**: The section listing the six care programs offered
- **Stats**: The animated statistics section highlighting key numbers
- **WhyChooseUs**: The trust-building section with key differentiators
- **FAQ**: The frequently asked questions accordion section
- **Contact**: The section containing business info and the inquiry form
- **Footer**: The bottom site-wide navigation and info component
- **FloatingCTA**: The mobile-only fixed call-to-action button
- **ScrollToTop**: The utility component that resets scroll position on route change
- **EmailJS**: The third-party email delivery service used for contact form submissions
- **Framer_Motion**: The animation library used for entrance and interactive animations
- **React_Scroll**: The library used for smooth anchor-based in-page navigation
- **Tailwind**: The utility-first CSS framework used for all styling
- **Brand_Colors**: The defined palette — gold (#C8972B), navy (#1A2B4A), warm (#F9F6F0), cream (#FBF8F3)
- **Visitor**: Any person browsing the Website
- **Prospective_Family**: A Visitor researching care options for a senior family member

---

## Requirements

### Requirement 1: Project Setup and Tech Stack

**User Story:** As a developer, I want a properly configured React + Vite project with all required dependencies, so that the Website can be built, developed, and deployed consistently.

#### Acceptance Criteria

1. THE Website SHALL be built with React 18 and Vite as the build tool.
2. THE Website SHALL use Tailwind CSS for all styling, configured with the Brand_Colors palette and Playfair Display / DM Sans font families.
3. THE Website SHALL include Framer_Motion, React Router DOM v6, React Icons, EmailJS browser client, and React_Scroll as runtime dependencies.
4. THE Website SHALL include a `tailwind.config.js` that extends the default theme with the gold, navy, warm, and cream color tokens and the custom font families.
5. THE Website SHALL include a `public/.htaccess` file that redirects all non-asset requests to `index.html` to support SPA client-side routing on GoDaddy cPanel hosting.
6. WHEN `npm run build` is executed, THE Website SHALL produce a `dist/` directory containing all static assets ready for upload to a cPanel `public_html` directory.

---

### Requirement 2: SEO and Document Head

**User Story:** As a business owner, I want the site to be discoverable by search engines and share correctly on social media, so that prospective families can find Uthan Senior Home Care online.

#### Acceptance Criteria

1. THE Website's `index.html` SHALL include a `<title>` tag with the value "Uthan Senior Home Care | Social Adult Day Care – Deer Park, NY".
2. THE Website's `index.html` SHALL include a `<meta name="description">` tag describing the center's services and location.
3. THE Website's `index.html` SHALL include `<meta name="keywords">` covering relevant terms such as adult day care, senior care, Deer Park, Suffolk County, and New York.
4. THE Website's `index.html` SHALL include Open Graph meta tags (`og:title`, `og:description`, `og:image`, `og:url`) for social media sharing.
5. THE Website's `index.html` SHALL include Google Fonts preconnect links and stylesheet imports for Playfair Display and DM Sans.

---

### Requirement 3: Application Shell and Routing

**User Story:** As a developer, I want a clean application shell with routing and global utilities, so that the site structure is maintainable and scroll behavior is correct.

#### Acceptance Criteria

1. THE Website's `App.jsx` SHALL wrap all content in a `BrowserRouter` from React Router DOM.
2. THE Website's `App.jsx` SHALL render the `ScrollToTop` component so that navigation between routes resets the scroll position to the top.
3. THE Website's `App.jsx` SHALL render the `FloatingCTA` component globally so that it appears on all pages.
4. THE Website SHALL define a `/` route that renders the `Home` page component.
5. THE `Home` page SHALL render all section components in the following order: Navbar, Hero, About, Services, Stats, WhyChooseUs, FAQ, Contact, Footer.

---

### Requirement 4: Navbar

**User Story:** As a Visitor, I want a clear and accessible navigation bar, so that I can quickly jump to any section of the page from any scroll position.

#### Acceptance Criteria

1. THE Navbar SHALL be fixed to the top of the viewport at all times.
2. WHEN the page scroll position is less than 80px from the top, THE Navbar SHALL display with a transparent background.
3. WHEN the page scroll position is 80px or more from the top, THE Navbar SHALL display with the navy background color and a drop shadow.
4. THE Navbar SHALL display the site logo on the left side.
5. THE Navbar SHALL display navigation links on the right side that use React_Scroll to smoothly scroll to the About, Services, FAQ, and Contact sections.
6. THE Navbar SHALL display a gold-colored CTA button labeled "Get Started" that scrolls to the Contact section.
7. WHEN the viewport width is below the mobile breakpoint, THE Navbar SHALL display a hamburger menu icon in place of the navigation links.
8. WHEN the hamburger icon is activated, THE Navbar SHALL display a dropdown menu containing all navigation links, animated with Framer_Motion.
9. WHEN a navigation link in the mobile dropdown is selected, THE Navbar SHALL close the dropdown menu.

---

### Requirement 5: Hero Section

**User Story:** As a Prospective_Family, I want an emotionally compelling introduction to the center, so that I immediately understand the value and feel confident exploring further.

#### Acceptance Criteria

1. THE Hero SHALL occupy the full viewport height.
2. THE Hero SHALL display a background image sourced from Unsplash (photo-1529156069898-49953e39b3ac) with a dark overlay to ensure text legibility.
3. THE Hero SHALL display a label pill, a primary heading, and a subheadline centered in the viewport.
4. THE Hero SHALL display two CTA buttons: a primary gold button labeled "Explore Our Services" that scrolls to the Services section, and a secondary outlined button labeled "Contact Us" that scrolls to the Contact section.
5. THE Hero SHALL display a bouncing scroll indicator arrow at the bottom of the viewport.
6. WHEN the Hero section enters the viewport, THE Hero SHALL animate its content into view using Framer_Motion entrance animations.

---

### Requirement 6: About Section

**User Story:** As a Prospective_Family, I want to learn about the center's mission and background, so that I can assess whether it is the right fit for my family member.

#### Acceptance Criteria

1. THE About section SHALL use the warm background color.
2. THE About section SHALL display content in a two-column layout on desktop: text on the left and an image on the right.
3. THE About section SHALL display the image sourced from Unsplash (photo-1576765608535-5f04d1e3f289) with a decorative gold frame treatment.
4. THE About section SHALL display badge pills highlighting key attributes of the center (e.g., Licensed, Compassionate Care, Suffolk County).
5. WHEN the About section enters the viewport, THE About section SHALL animate its content using Framer_Motion scroll-triggered animations.
6. WHEN the viewport width is below the mobile breakpoint, THE About section SHALL stack its columns vertically.

---

### Requirement 7: Services Data and Section

**User Story:** As a Prospective_Family, I want to see a clear list of all programs offered, so that I can determine whether the center meets my family member's needs.

#### Acceptance Criteria

1. THE Website SHALL define a `src/data/services.js` module that exports an array of exactly six service objects, each containing an icon reference, title, and description.
2. THE six services SHALL be: Recreational Activities, Family Counseling, Nutritious Meals, Transportation, Community Engagement, and Yoga & Meditation.
3. THE Services section SHALL display all six services in a three-column card grid on desktop.
4. EACH service card SHALL display a gold top border, an icon, a title, and a description.
5. WHEN the Services section enters the viewport, THE Services section SHALL animate each card into view with a staggered Framer_Motion animation.
6. WHEN the viewport width is below the mobile breakpoint, THE Services section SHALL display cards in a single-column layout.

---

### Requirement 8: Stats Section

**User Story:** As a Prospective_Family, I want to see quantified evidence of the center's reach and reliability, so that I feel confident in its track record.

#### Acceptance Criteria

1. THE Stats section SHALL use the gold background color.
2. THE Stats section SHALL display exactly four statistics: "500+ Seniors Served", "10+ Trusted Partners", "5 Days a Week", and "1 Only Center in Suffolk".
3. WHEN the Stats section enters the viewport, THE Stats section SHALL animate each statistic number using a count-up animation.
4. WHEN the viewport width is below the mobile breakpoint, THE Stats section SHALL display statistics in a two-column grid.

---

### Requirement 9: Why Choose Us Section

**User Story:** As a Prospective_Family, I want to understand the center's key differentiators, so that I can compare it confidently against other options.

#### Acceptance Criteria

1. THE WhyChooseUs section SHALL use the navy background color with light text.
2. THE WhyChooseUs section SHALL display four trust cards arranged in a 2×2 grid on desktop.
3. EACH trust card SHALL display an icon, a title, and a supporting description.
4. THE WhyChooseUs section SHALL display a decorative pull quote that reinforces the center's mission.
5. WHEN the viewport width is below the mobile breakpoint, THE WhyChooseUs section SHALL stack trust cards in a single-column layout.

---

### Requirement 10: FAQ Data and Section

**User Story:** As a Prospective_Family, I want answers to common questions about the program, so that I can make an informed decision without needing to call.

#### Acceptance Criteria

1. THE Website SHALL define a `src/data/faqs.js` module that exports an array of exactly six FAQ objects, each containing a question and an answer string.
2. THE six FAQs SHALL cover topics relevant to the Social Adult Day Care program, including eligibility, hours, transportation, meals, activities, and enrollment.
3. THE FAQ section SHALL use the warm background color.
4. THE FAQ section SHALL display all six questions as an accordion, with only one item open at a time.
5. WHEN a FAQ item is opened, THE FAQ section SHALL display the answer with a gold left border on the open item.
6. WHEN a FAQ item is toggled, THE FAQ section SHALL animate the open and close transitions using Framer_Motion AnimatePresence.
7. WHEN a second FAQ item is opened, THE FAQ section SHALL close the previously open item.

---

### Requirement 11: Contact Section and Form

**User Story:** As a Prospective_Family, I want to easily reach the center with a question or inquiry, so that I can get the information I need to enroll my family member.

#### Acceptance Criteria

1. THE Contact section SHALL display in a two-column layout on desktop: a left info panel with navy background and a right contact form.
2. THE left info panel SHALL display the center's address (1872 Deer Park Avenue, Deer Park, New York 11729), phone number ((516) 510-0267), email (uthancare@uthanseniorcare.com), and operating hours (Monday–Friday, 10:00 AM – 3:00 PM).
3. THE Contact form SHALL include fields for the Visitor's name, email address, phone number, and message.
4. WHEN the Contact form is submitted with any required field empty, THE Contact section SHALL display a validation error message for each empty required field without submitting the form.
5. WHEN the Contact form is submitted with an invalid email format, THE Contact section SHALL display a validation error message for the email field without submitting the form.
6. WHEN the Contact form is submitted with all fields valid, THE Contact section SHALL send the form data via EmailJS and display a success confirmation message to the Visitor.
7. IF the EmailJS submission fails, THEN THE Contact section SHALL display an error message informing the Visitor that the submission failed and suggesting they call or email directly.
8. WHEN the viewport width is below the mobile breakpoint, THE Contact section SHALL stack its columns vertically with the info panel above the form.

---

### Requirement 12: Footer

**User Story:** As a Visitor, I want a comprehensive footer with quick links and contact info, so that I can navigate or reach the center from the bottom of the page.

#### Acceptance Criteria

1. THE Footer SHALL use the navy dark background color with light text.
2. THE Footer SHALL display content in a four-column grid on desktop: brand/tagline, quick links, services links, and contact info.
3. THE Footer's quick links and services links SHALL use React_Scroll to smoothly scroll to the corresponding page sections.
4. THE Footer SHALL display social media icons linking to the center's social profiles.
5. THE Footer SHALL display a copyright notice with the current year and the business name.
6. WHEN the viewport width is below the mobile breakpoint, THE Footer SHALL stack its columns vertically.

---

### Requirement 13: Floating CTA Button

**User Story:** As a Visitor on a mobile device, I want a persistent call-to-action button, so that I can call the center at any time without scrolling to find the phone number.

#### Acceptance Criteria

1. THE FloatingCTA SHALL be visible only on mobile viewport widths.
2. THE FloatingCTA SHALL be fixed to the bottom-right corner of the viewport.
3. THE FloatingCTA SHALL display a gold phone icon button that initiates a call to tel:5165100267 when activated.
4. THE FloatingCTA SHALL display a continuous pulse animation to draw attention to the button.

---

### Requirement 14: Scroll To Top Utility

**User Story:** As a Visitor, I want the page to scroll to the top when navigating to a new route, so that I always start at the top of the page content.

#### Acceptance Criteria

1. THE ScrollToTop component SHALL listen for route changes using the React Router DOM `useLocation` hook.
2. WHEN the current route changes, THE ScrollToTop component SHALL scroll the window to position (0, 0).

---

### Requirement 15: Accessibility and Responsive Design

**User Story:** As a Visitor using any device or assistive technology, I want the site to be usable and readable, so that I can access all information regardless of my device or ability.

#### Acceptance Criteria

1. THE Website SHALL use semantic HTML elements (header, nav, main, section, footer, h1–h3) throughout all components.
2. THE Website SHALL provide descriptive `alt` attributes on all meaningful images.
3. THE Website SHALL ensure all interactive elements (buttons, links, form inputs) are keyboard-navigable and have visible focus indicators.
4. THE Website SHALL maintain a color contrast ratio sufficient for body text and headings against their respective backgrounds.
5. THE Website SHALL be fully functional and visually correct at viewport widths of 375px, 768px, and 1280px.
6. THE Website SHALL use a mobile-first CSS approach, with responsive breakpoints applied via Tailwind's `sm`, `md`, and `lg` prefixes.
