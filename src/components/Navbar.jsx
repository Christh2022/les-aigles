import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Heart, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/logo.png'
import { supabase } from '../lib/supabaseClient'

const DONATION_URL = 'https://www.paypal.me/Lafamillelesaigles?locale.x=fr_FR'
const ADMIN_PATH = '/acces-prive-lfae-7mQ2x9Kp4Vn8Rt3Yh6Zs1Jd5Wc0bL2t9/admin'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hasAdminAccess, setHasAdminAccess] = useState(false)
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

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession()
      setHasAdminAccess(Boolean(data.session))
    }

    initSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setHasAdminAccess(Boolean(nextSession))
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Nos Missions', href: '/missions' },
    { name: 'Formations', href: '/formations' },
    { name: 'Événements', href: '/evenements' },
    { name: 'Blog', href: '/blog' },
    ...(hasAdminAccess ? [{ name: 'Admin', href: ADMIN_PATH }] : []),
    { name: 'Contact', href: '/contact' },
  ]

  const donateText = 'Faire un Don'

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
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-lg shadow-primary-500/20 ring-1 ring-primary-100"
              >
                <img
                  src={logo}
                  alt="Logo La Famille Les Aigles"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-primary-900 font-bold text-lg leading-tight tracking-tight">
                  La Famille Les Aigles
                </span>
                <span className="text-slate-400 text-xs font-medium tracking-wide">
                  Aide Sociale Internationale
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
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

            <div className="flex items-center space-x-3">
              <a href={DONATION_URL} target="_blank" rel="noreferrer">
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-gold hidden sm:flex items-center space-x-1.5 !px-5 !py-2.5 text-xs"
                >
                  <Heart className="w-4 h-4" fill="currentColor" />
                  <span>{donateText}</span>
                </motion.div>
              </a>

              <a href={DONATION_URL} target="_blank" rel="noreferrer" className="sm:hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-gold w-12 h-12 !p-0"
                  aria-label="Donate"
                >
                  <Heart className="w-5 h-5" fill="currentColor" />
                </motion.div>
              </a>

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
              <nav className="flex-1 flex flex-col justify-center space-y-2">
                {navigation.map((item, i) => (
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
              </nav>

              <motion.div
                custom={navigation.length + 1}
                variants={menuItemVariants}
                initial="closed"
                animate="open"
                className="mt-8"
              >
                <a
                  href={DONATION_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-gold w-full text-base py-4 justify-center"
                >
                  <Heart className="w-5 h-5 mr-2" fill="currentColor" />
                  {donateText}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
