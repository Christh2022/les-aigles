import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Globe, Menu, X, Heart } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('FR')

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const toggleLanguage = () => {
    setCurrentLang(currentLang === 'FR' ? 'EN' : 'FR')
    // TODO: Implémenter la logique de changement de langue avec i18n
  }

  const navigation = {
    FR: [
      { name: 'Accueil', href: '/' },
      { name: 'Nos Missions', href: '/missions' },
      { name: 'Formations', href: '/formations' },
      { name: 'Événements', href: '/evenements' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
    EN: [
      { name: 'Home', href: '/' },
      { name: 'Our Missions', href: '/missions' },
      { name: 'Training', href: '/formations' },
      { name: 'Events', href: '/evenements' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
  }

  const donateText = {
    FR: 'Faire un Don',
    EN: 'Donate',
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 shadow-sm border-b border-gray-100 transition-all duration-300">
      <nav className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Enhanced with better spacing */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">LA</span>
            </div>
            <div className="flex flex-col">
              <span className="text-primary-900 font-bold text-lg leading-tight tracking-tight">
                La Famille Les Aigles
              </span>
              <span className="text-gray-500 text-xs font-medium">
                {currentLang === 'FR' ? 'Aide Sociale Internationale' : 'International Social Aid'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Premium hover effects */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation[currentLang].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side buttons - Enhanced styling */}
          <div className="flex items-center space-x-3">
            {/* Language Selector - Cleaner design */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 focus-custom"
              aria-label="Change language"
            >
              <Globe className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-semibold text-gray-700">{currentLang}</span>
            </button>

            {/* Donate Button - Premium CTA with Gold styling */}
            <Link
              to="/don"
              className="btn-gold hidden sm:flex space-x-2 group"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
              <span>{donateText[currentLang]}</span>
            </Link>

            {/* Mobile Donate Button (Icon Only) */}
            <Link
              to="/don"
              className="sm:hidden btn-gold w-12 h-12 !p-0"
              aria-label="Donate"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
            </Link>

            {/* Mobile menu button - Improved animation */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 focus-custom"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced with smooth animations */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-gray-100 space-y-1">
            {navigation[currentLang].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-all duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}

            {/* Language selector for mobile - Better styling */}
            <button
              onClick={() => {
                toggleLanguage()
                setIsMenuOpen(false)
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
            >
              <Globe className="w-5 h-5 text-primary-600" />
              <span>{currentLang === 'FR' ? 'Switch to English' : 'Passer en Français'}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
