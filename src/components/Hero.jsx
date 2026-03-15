import { Link } from 'react-router-dom'
import { Heart, ArrowRight, Globe, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  // Delayed floating variants for staggered animations
  const floatingVariantsDelayed2s = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 2,
      },
    },
  }

  const floatingVariantsDelayed4s = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 4,
      },
    },
  }

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Animated Background Elements - Radial gradient and floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] aspect-square bg-gradient-radial from-primary-100/40 via-transparent to-transparent" />
        
        {/* Floating orbs */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-[10%] w-64 h-64 bg-gradient-to-br from-primary-200/30 to-primary-300/20 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatingVariantsDelayed2s}
          animate="animate"
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-gradient-to-br from-gold-200/30 to-gold-300/20 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatingVariantsDelayed4s}
          animate="animate"
          className="absolute top-1/2 right-[20%] w-48 h-48 bg-gradient-to-br from-green-200/30 to-green-300/20 rounded-full blur-3xl"
        />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #1e3a8a 1px, transparent 1px),
                              linear-gradient(to bottom, #1e3a8a 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-20 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-xl px-5 py-2.5 rounded-full border border-gray-100 shadow-soft">
              <Globe className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-semibold text-gray-700 tracking-wide">
                Aide Sociale Internationale
              </span>
              <Sparkles className="w-4 h-4 text-gold-500" />
            </div>
          </motion.div>

          {/* Hero Title - text-7xl with tracking-tight */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tighter text-gray-900"
          >
            De la France au Congo,
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                et demain vers le monde
              </span>
              {/* Underline decoration */}
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
                className="absolute -bottom-2 left-0 w-full h-3"
                viewBox="0 0 300 12"
                fill="none"
              >
                <motion.path
                  d="M2 10C50 4 150 4 298 10"
                  stroke="url(#gold-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gold-gradient" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </motion.h1>

          {/* Subtitle - text-xl with leading-relaxed, grey-blue color */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl mb-12 text-slate-500 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            L&apos;association La Famille Les Aigles œuvre pour l&apos;éducation, 
            la formation et l&apos;insertion des jeunes en France et en Afrique.
          </motion.p>

          {/* CTA Buttons - duration-500 ease-in-out transitions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/don">
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="btn-gold text-lg group px-10 py-4"
              >
                <Heart className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-500" fill="currentColor" />
                Faire un Don
              </motion.button>
            </Link>
            
            <Link to="/missions">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary text-lg group px-10 py-4"
              >
                Découvrir nos missions
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-500" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-16 pt-12 border-t border-gray-100"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <span className="text-2xl">🇫🇷</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">France</p>
                  <p className="text-xs text-slate-400">Siège Social</p>
                </div>
              </div>
              
              <div className="w-px h-10 bg-gray-200 hidden md:block" />
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <span className="text-2xl">🇨🇬</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Congo</p>
                  <p className="text-xs text-slate-400">Opérations</p>
                </div>
              </div>
              
              <div className="w-px h-10 bg-gray-200 hidden md:block" />
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-gold-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">100%</p>
                  <p className="text-xs text-slate-400">Transparence</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 100V60C240 20 480 0 720 10C960 20 1200 50 1440 40V100H0Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </section>
  )
}

export default Hero
