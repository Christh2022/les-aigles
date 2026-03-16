import { useEffect, useState, useRef } from 'react'
import { Users, Heart, Globe2, Handshake } from 'lucide-react'
import { motion, useInView, animate } from 'framer-motion'

const DONATION_URL = 'https://www.paypal.me/Lafamillelesaigles?locale.x=fr_FR'

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', duration = 2.5 }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: duration,
        ease: 'easeOut',
        onUpdate: (v) => setDisplayValue(Math.round(v)),
      })
      return controls.stop
    }
  }, [isInView, value, duration])

  return (
    <span ref={ref} className="font-black text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700">
      {displayValue.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}

const ImpactStats = () => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const stats = [
    {
      icon: Users,
      value: 2,
      suffix: '',
      label: 'Enfants accueillis',
      description: 'À l\'orphelinat',
      color: 'blue-1',
      gridClass: 'col-span-1',
    },
    {
      icon: Heart,
      value: 100,
      suffix: '%',
      label: 'Des dons',
      description: 'Utilisés sur le terrain',
      color: 'blue-3',
      gridClass: 'col-span-1',
    },
    {
      icon: Globe2,
      value: 2,
      suffix: '',
      label: 'Pays d\'action',
      description: 'France & Congo',
      color: 'blue-4',
      gridClass: 'col-span-1',
    },
    {
      icon: Handshake,
      value: 0,
      suffix: '',
      label: 'Partenaires engagés',
      description: 'À nos côtés',
      color: 'blue-2',
      gridClass: 'col-span-1',
    },
  ]

  const colorClasses = {
    'blue-1': {
      bg: 'bg-blue-50',
      icon: 'text-primary-600',
      iconBg: 'bg-primary-100',
      gradient: 'from-primary-500 to-primary-700',
    },
    'blue-2': {
      bg: 'bg-blue-50',
      icon: 'text-primary-600',
      iconBg: 'bg-primary-100',
      gradient: 'from-primary-600 to-primary-800',
    },
    'gold-1': {
      bg: 'bg-blue-50',
      icon: 'text-primary-600',
      iconBg: 'bg-primary-100',
      gradient: 'from-primary-600 to-primary-800',
    },
    'blue-3': {
      bg: 'bg-blue-50',
      icon: 'text-primary-600',
      iconBg: 'bg-primary-100',
      gradient: 'from-primary-500 to-primary-700',
    },
    'gold-2': {
      bg: 'bg-blue-50',
      icon: 'text-primary-600',
      iconBg: 'bg-primary-100',
      gradient: 'from-primary-600 to-primary-700',
    },
    'blue-4': {
      bg: 'bg-blue-50',
      icon: 'text-primary-600',
      iconBg: 'bg-primary-100',
      gradient: 'from-primary-600 to-primary-800',
    },
  }

  return (
    <section className="py-32 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Premium background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="container-custom relative z-10" ref={containerRef}>
        {/* Premium Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center space-x-3 bg-white/50 backdrop-blur-xl border border-white/20 shadow-lg px-6 py-3 rounded-full mb-8 hover:bg-white/60 transition-all"
          >
            <span className="text-sm">🇨🇬</span>
            <span className="font-semibold text-xs bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-600">Notre Impact au Congo</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl font-black mb-6 text-gray-900 leading-tight"
          >
            Des chiffres qui <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700">changent des vies</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed mb-2"
          >
            Grâce à votre générosité, chaque jour nous créons un impact réel et mesurable à Kinshasa. De l'aide alimentaire à l'éducation, chaque action compte pour transformer les vies.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs text-gray-500 max-w-2xl mx-auto"
          >
            Soutenez notre mission humanitaire auprès des enfants et familles en difficulté
          </motion.p>
        </motion.div>

        {/* Modern Bento Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 w-full mb-12"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            const colors = colorClasses[stat.color]
            
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ 
                  y: -12, 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
                whileTap={{ scale: 0.98 }}
                className={`${stat.gridClass} relative group cursor-pointer`}
              >
                {/* Glassmorphism Card */}
                <div className="h-full bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon with glow */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 relative`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`} />
                    <Icon className={`w-8 h-8 ${colors.icon} relative z-10`} />
                  </motion.div>

                  {/* Counter with gradient */}
                  <div className="mb-4">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2.5} />
                  </div>

                  {/* Label */}
                  <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                    {stat.label}
                  </h3>

                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Animated bottom accent */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-1.5 bg-gradient-to-r ${colors.gradient} rounded-full w-full group-hover:h-2 transition-all duration-300 origin-left`}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Premium CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-24 pt-12 border-t border-white/30 backdrop-blur-sm"
        >
          <motion.p
            className="text-lg text-gray-700 mb-8 font-medium"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">Chaque don compte</span>
            <br />
            pour faire grandir ces chiffres et transformer des vies
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.a
              href={DONATION_URL}
              target="_blank"
              rel="noreferrer"
              whileHover={{ 
                scale: 1.05, 
                y: -4,
                boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Heart className="w-6 h-6 fill-current relative z-10" />
              <span className="relative z-10">Contribuer à notre mission</span>
              <motion.span
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10"
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ImpactStats
