import { Link } from "react-router-dom";
import { HiSparkles } from "react-icons/hi2";
import { ROUTES } from "../../utils/constants.js";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ],
  Platform: [
    { label: "AI Interview", href: ROUTES.REGISTER },
    { label: "ATS Analyzer", href: ROUTES.REGISTER },
    { label: "Coding Practice", href: ROUTES.REGISTER },
  ],
  Account: [
    { label: "Sign Up", href: ROUTES.REGISTER },
    { label: "Login", href: ROUTES.LOGIN },
  ],
};

const FooterSection = () => {
  return (
    <footer
      className="py-16 px-4"
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                <HiSparkles className="text-white text-sm" />
              </div>
              <span className="font-bold text-gradient">AceInterviewAI</span>
            </Link>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              AI-powered interview practice platform for software engineers.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p
                className="text-sm font-semibold mb-4"
                style={{ color: "var(--color-text-primary)" }}
              >
                {group}
              </p>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = "var(--color-primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = "var(--color-text-muted)")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} AceInterviewAI. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Built with ❤️ for developers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
