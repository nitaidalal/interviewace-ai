import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";
import useTheme from "../../hooks/useTheme.js";
import Button from "../ui/Button.jsx";
import { ROUTES, NAV_LINKS } from "../../utils/constants.js";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

const PublicNavbar = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? "color-mix(in srgb, var(--color-surface) 95%, transparent)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-border)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-gradient">
              <HiSparkles className="text-white text-sm" />
            </div>
            <span className="font-bold text-lg text-gradient">
              AceInterviewAI
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium transition-colors duration-200 cursor-pointer"
                style={{ color: "var(--color-text-secondary)" }}
                onMouseEnter={(e) =>
                  (e.target.style.color = "var(--color-text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "var(--color-text-secondary)")
                }
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-lg transition-colors duration-200 cursor-pointer"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {isDark ? (
                <MdOutlineLightMode size={18} />
              ) : (
                <MdOutlineDarkMode size={18} />
              )}
            </button>

            {isAuthenticated ? (
              <Button onClick={() => navigate(ROUTES.DASHBOARD)} size="sm">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg cursor-pointer"
            style={{ color: "var(--color-text-primary)" }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden"
            style={{
              backgroundColor: "var(--color-surface)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-left py-2 cursor-pointer"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {link.label}
                </button>
              ))}
              <div
                className="flex flex-col gap-2 pt-2 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                {isAuthenticated ? (
                  <Button
                    onClick={() => {
                      navigate(ROUTES.DASHBOARD);
                      setMenuOpen(false);
                    }}
                    fullWidth
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => {
                        navigate(ROUTES.LOGIN);
                        setMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => {
                        navigate(ROUTES.REGISTER);
                        setMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.header>
  );
};

export default PublicNavbar;
