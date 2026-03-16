import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, FileText } from 'lucide-react'

const DONATION_URL = 'https://www.paypal.me/Lafamillelesaigles?locale.x=fr_FR'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">La Famille Les Aigles</h3>
            <p className="text-sm mb-4">
              Association d&apos;aide sociale internationale, œuvrant de la France à la RDC et bientôt dans le monde entier.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/missions" className="hover:text-primary-400 transition-colors">
                  Nos Missions
                </Link>
              </li>
              <li>
                <Link to="/formations" className="hover:text-primary-400 transition-colors">
                  Formations
                </Link>
              </li>
              <li>
                <Link to="/evenements" className="hover:text-primary-400 transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <a href={DONATION_URL} target="_blank" rel="noreferrer" className="hover:text-primary-400 transition-colors">
                  Faire un Don
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Siège Social: Melun, France</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Opérations: Kinshasa, RDC</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:contact@les-aigles.org" className="hover:text-primary-400 transition-colors">
                  contact@les-aigles.org
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="tel:+33000000000" className="hover:text-primary-400 transition-colors">
                  +33 (0)0 00 00 00 00
                </a>
              </li>
            </ul>
          </div>

          {/* Transparence & Gouvernance */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary-400" />
              <span>Transparence & Gouvernance</span>
            </h3>
            <div className="text-sm space-y-2">
              <p>
                Association enregistrée en France
              </p>
              <p className="font-semibold text-white">
                SIREN: 939 491 122
              </p>
              <p className="text-xs mt-3 text-gray-400">
                Nous nous engageons à une totale transparence dans la gestion de vos dons et de nos actions internationales.
              </p>
              <Link
                to="/transparence"
                className="inline-block mt-2 text-primary-400 hover:text-primary-300 transition-colors"
              >
                En savoir plus →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>
              © {currentYear} La Famille Les Aigles. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/mentions-legales" className="hover:text-primary-400 transition-colors">
                Mentions Légales
              </Link>
              <Link to="/politique-confidentialite" className="hover:text-primary-400 transition-colors">
                Politique de Confidentialité
              </Link>
              <Link to="/cgv" className="hover:text-primary-400 transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
