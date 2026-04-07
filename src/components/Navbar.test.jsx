import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Navbar from './Navbar';

// react-scroll Link renders as an anchor-like element; mock it to a simple <a>
vi.mock('react-scroll', () => ({
  Link: ({ children, to, onClick, ...props }) => (
    <a href={`#${to}`} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

describe('Navbar', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the logo text', () => {
    render(<Navbar />);
    expect(screen.getByText('Uthan')).toBeInTheDocument();
    expect(screen.getByText(/Senior Care/i)).toBeInTheDocument();
  });

  it('renders all desktop nav links', () => {
    render(<Navbar />);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Services').length).toBeGreaterThan(0);
    expect(screen.getAllByText('FAQ').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
  });

  it('renders the Get Started CTA button', () => {
    render(<Navbar />);
    const ctaButtons = screen.getAllByText('Get Started');
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('is fixed to the top of the viewport', () => {
    render(<Navbar />);
    const header = screen.getByRole('banner');
    expect(header.className).toMatch(/fixed/);
    expect(header.className).toMatch(/top-0/);
    expect(header.className).toMatch(/z-50/);
  });

  it('starts with transparent background when scrollY < 80', () => {
    window.scrollY = 0;
    render(<Navbar />);
    const header = screen.getByRole('banner');
    expect(header.className).toMatch(/bg-transparent/);
    expect(header.className).not.toMatch(/bg-navy/);
  });

  it('applies navy background and shadow when scrollY >= 80', async () => {
    window.scrollY = 0;
    render(<Navbar />);
    const header = screen.getByRole('banner');

    await act(async () => {
      window.scrollY = 100;
      fireEvent.scroll(window);
    });

    expect(header.className).toMatch(/bg-navy/);
    expect(header.className).toMatch(/shadow/);
  });

  it('shows hamburger button on mobile (aria-label)', () => {
    render(<Navbar />);
    const hamburger = screen.getByRole('button', { name: /open menu/i });
    expect(hamburger).toBeInTheDocument();
  });

  it('opens mobile menu when hamburger is clicked', async () => {
    render(<Navbar />);
    const hamburger = screen.getByRole('button', { name: /open menu/i });

    await act(async () => {
      fireEvent.click(hamburger);
    });

    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
    // Mobile menu should now be visible — check for the mobile menu container
    expect(screen.getByRole('navigation').parentElement.querySelector('#mobile-menu')).toBeInTheDocument();
  });

  it('closes mobile menu when a nav link is clicked', async () => {
    render(<Navbar />);
    const hamburger = screen.getByRole('button', { name: /open menu/i });

    await act(async () => {
      fireEvent.click(hamburger);
    });

    // Click the About link inside the mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    const aboutLink = mobileMenu.querySelector('a[href="#about"]');
    await act(async () => {
      fireEvent.click(aboutLink);
    });

    // Menu should be closed — hamburger button should show "Open menu" again
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('uses semantic header and nav elements', () => {
    render(<Navbar />);
    expect(screen.getByRole('banner')).toBeInTheDocument(); // <header>
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // <nav>
  });

  it('hamburger button is keyboard-navigable (has accessible label)', () => {
    render(<Navbar />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    expect(btn).toHaveAttribute('aria-label');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('hamburger aria-expanded is true when menu is open', async () => {
    render(<Navbar />);
    const hamburger = screen.getByRole('button', { name: /open menu/i });

    await act(async () => {
      fireEvent.click(hamburger);
    });

    const closeBtn = screen.getByRole('button', { name: /close menu/i });
    expect(closeBtn).toHaveAttribute('aria-expanded', 'true');
  });
});
