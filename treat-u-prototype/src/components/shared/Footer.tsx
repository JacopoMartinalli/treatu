import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Mail } from 'lucide-react';

// ============================================
// COMPONENT
// ============================================

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TU</span>
              </div>
              <span className="text-xl font-bold text-white">
                Treat<span className="text-primary-400">U</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-6">
              La piattaforma che connette i migliori massaggiatori professionisti
              con chi cerca benessere a domicilio. Servizi di qualita, a casa tua.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Mail className="w-5 h-5" />} />
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Per i Clienti</h3>
            <ul className="space-y-2">
              <FooterLink to="/search">Trova un Professionista</FooterLink>
              <FooterLink to="/register">Registrati</FooterLink>
              <FooterLink to="#">Come Funziona</FooterLink>
              <FooterLink to="#">FAQ</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Per i Professionisti</h3>
            <ul className="space-y-2">
              <FooterLink to="/pro/register">Diventa Partner</FooterLink>
              <FooterLink to="#">Piani e Prezzi</FooterLink>
              <FooterLink to="#">Centro Assistenza</FooterLink>
              <FooterLink to="#">Risorse</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} TreatU. Tutti i diritti riservati.
            </p>
            <div className="flex gap-6 text-sm">
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

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
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
        className="text-gray-400 hover:text-white transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
