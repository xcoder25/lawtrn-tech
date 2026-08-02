import { useRef, useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

const NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/research', label: 'Research' },
  { to: '/learning', label: 'Learning Hub' },
  { to: '/community', label: 'Community' },
  { to: '/blog', label: 'Blog' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

const SECRET_CLICK_TARGET = 5;
const SECRET_CLICK_WINDOW_MS = 2000;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLogoClick() {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (clickCount.current >= SECRET_CLICK_TARGET) {
      clickCount.current = 0;
      setAdminModalOpen(true);
      return;
    }
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, SECRET_CLICK_WINDOW_MS);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b border-line/80 bg-void/90 backdrop-blur-xl transition-shadow duration-300 ${
          scrolled ? 'shadow-lg shadow-black/20' : ''
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-6">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="group flex select-none items-center gap-2.5 transition-opacity hover:opacity-90"
            aria-label="Lawtronic Technologies home"
          >
            <img
              src="/logo.jpg"
              alt=""
              className="h-9 w-9 rounded-full object-cover shadow-glow-sm transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
              LAW<span className="text-circuit">TRONIC</span>
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-circuit/10 text-circuit'
                      : 'text-ink-dim hover:bg-panel2 hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link to="/contact" className="btn-primary text-sm">
              Start a Collaboration
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line/60 text-ink transition-colors hover:bg-panel2 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer panel */}
      <div
        className={`fixed right-0 top-0 z-40 h-full w-[80vw] max-w-xs border-l border-line bg-void shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-display text-base font-semibold text-ink">
            LAW<span className="text-circuit">TRONIC</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-dim hover:text-ink"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-circuit/10 text-circuit'
                      : 'text-ink-dim hover:bg-panel2 hover:text-ink'
                  }`
                }
              >
                {link.label}
                <ArrowRight size={13} className="opacity-30" />
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Drawer footer CTA */}
        <div className="border-t border-line px-5 py-5">
          <Link
            to="/contact"
            className="btn-primary w-full justify-center text-sm"
            onClick={() => setMobileOpen(false)}
          >
            Start a Collaboration
          </Link>
          <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
            Innovate · Automate · Elevate
          </p>
        </div>
      </div>

      <AdminLoginModal open={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </>
  );
}
