import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin } from 'lucide-react';

// ============================================
// COMPONENT
// ============================================

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">TU</span>
              </div>
              <span className="text-xl font-bold text-white">
                Treat<span className="text-primary-400">U</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-6 text-sm leading-relaxed">
              Il tuo benessere, a casa tua. Connetti professionisti del wellness
              con chi cerca trattamenti di qualità senza vincoli di spazio.
            </p>
            <div className="flex gap-3">
              <SocialLink href="#" icon={<Instagram className="w-4 h-4" />} label="Instagram" />
              <SocialLink href="#" icon={<Facebook className="w-4 h-4" />} label="Facebook" />
              <SocialLink href="#" icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" />
            </div>
          </div>

          {/* Per i Clienti */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Per i Clienti</h3>
            <ul className="space-y-3">
              <FooterLink to="/search">Trova Professionista</FooterLink>
              <FooterLink to="/register">Registrati</FooterLink>
              <FooterLink to="#">Come Funziona</FooterLink>
              <FooterLink to="#">Garanzia Qualità</FooterLink>
            </ul>
          </div>

          {/* Per i Professionisti */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Per i Professionisti</h3>
            <ul className="space-y-3">
              <FooterLink to="/pro/register">Diventa Partner</FooterLink>
              <FooterLink to="#">Vantaggi</FooterLink>
              <FooterLink to="#">Tariffe</FooterLink>
              <FooterLink to="#">Centro Assistenza</FooterLink>
            </ul>
          </div>

          {/* Azienda */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">TreatU</h3>
            <ul className="space-y-3">
              <FooterLink to="#">Chi Siamo</FooterLink>
              <FooterLink to="#">Blog</FooterLink>
              <FooterLink to="#">Lavora con Noi</FooterLink>
              <FooterLink to="#">Contatti</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} TreatU. Tutti i diritti riservati.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <Link to="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                Termini di Servizio
              </Link>
              <Link to="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
