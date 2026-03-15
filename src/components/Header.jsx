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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">LA</span>
            </div>
            <div className="flex flex-col">
              <span className="text-primary-900 font-bold text-lg leading-tight">
                La Famille Les Aigles
              </span>
              <span className="text-gray-500 text-xs">
                {currentLang === 'FR' ? 'Aide Sociale Internationale' : 'International Social Aid'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation[currentLang].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Change language"
            >
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{currentLang}</span>
            </button>

            {/* Donate Button - Very visible */}
            <Link
              to="/don"
              className="btn-gold flex items-center space-x-2 animate-pulse hover:animate-none"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              <span className="hidden sm:inline">{donateText[currentLang]}</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              {navigation[currentLang].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
              {/* Language selector for mobile */}
              <button
                onClick={() => {
                  toggleLanguage()
                  setIsMenuOpen(false)
                }}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Globe className="w-5 h-5" />
                <span>{currentLang === 'FR' ? 'English' : 'Français'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
