import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Globe, Menu, X, Heart, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('FR')
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const toggleLanguage = () => {
    setCurrentLang(currentLang === 'FR' ? 'EN' : 'FR')
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

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const menuItemVariants = {
    closed: {
      opacity: 0,
      y: 20,
    },
    open: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  }

  const isActive = (href) => location.pathname === href

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-soft border-b border-gray-100/50'
            : 'bg-white/60 backdrop-blur-md'
        }`}
      >
        <nav className="container-custom">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Enhanced with gradient and hover effects */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20"
              >
                <span className="text-white font-extrabold text-xl">LA</span>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-primary-900 font-bold text-lg leading-tight tracking-tight">
                  La Famille Les Aigles
                </span>
                <span className="text-slate-400 text-xs font-medium tracking-wide">
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
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right side buttons - Enhanced styling */}
            <div className="flex items-center space-x-3">
              {/* Language Selector - Cleaner design */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="hidden md:flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 focus-custom"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-gray-700">{currentLang}</span>
              </motion.button>

              {/* Donate Button - Premium CTA with shimmer effect */}
              <Link to="/don">
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-gold hidden sm:flex space-x-2"
                >
                  <Heart className="w-5 h-5" fill="currentColor" />
                  <span>{donateText[currentLang]}</span>
                </motion.div>
              </Link>

              {/* Mobile Donate Button (Icon Only) */}
              <Link to="/don" className="sm:hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-gold w-12 h-12 !p-0"
                  aria-label="Donate"
                >
                  <Heart className="w-5 h-5" fill="currentColor" />
                </motion.div>
              </Link>

              {/* Mobile menu button - Improved animation */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className="lg:hidden p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 focus-custom"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6 text-gray-700" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6 text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>
      </header>

      {/* Full-screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col h-full pt-24 pb-8 px-6">
              {/* Navigation Links */}
              <nav className="flex-1 flex flex-col justify-center space-y-2">
                {navigation[currentLang].map((item, i) => (
                  <motion.div
                    key={item.name}
                    custom={i}
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between px-6 py-5 rounded-2xl text-2xl font-semibold transition-all duration-300 ${
                        isActive(item.href)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className={`w-6 h-6 transition-colors ${
                        isActive(item.href) ? 'text-primary-600' : 'text-gray-300'
                      }`} />
                    </Link>
                  </motion.div>
                ))}

                {/* Language switcher in mobile */}
                <motion.div
                  custom={navigation[currentLang].length}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                >
                  <button
                    onClick={() => {
                      toggleLanguage()
                    }}
                    className="w-full flex items-center justify-between px-6 py-5 rounded-2xl text-xl font-medium text-gray-600 hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <Globe className="w-6 h-6 text-primary-600" />
                      <span>{currentLang === 'FR' ? 'Switch to English' : 'Passer en Français'}</span>
                    </div>
                    <span className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                      {currentLang}
                    </span>
                  </button>
                </motion.div>
              </nav>

              {/* Bottom CTA */}
              <motion.div
                custom={navigation[currentLang].length + 1}
                variants={menuItemVariants}
                initial="closed"
                animate="open"
                className="mt-8"
              >
                <Link
                  to="/don"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-gold w-full text-lg py-5 justify-center"
                >
                  <Heart className="w-6 h-6 mr-3" fill="currentColor" />
                  {donateText[currentLang]}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
