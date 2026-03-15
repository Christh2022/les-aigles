import { useEffect, useState, useRef } from 'react'
import { Users, GraduationCap, Home, Heart, Utensils, Globe2 } from 'lucide-react'
import { motion, useInView, animate } from 'framer-motion'

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', duration = 2 }) => {
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
    <span ref={ref} className="stat-number">
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
      value: 50,
      suffix: '',
      label: 'Enfants accueillis',
      description: 'À l\'orphelinat',
      color: 'primary',
      gridClass: 'col-span-1',
    },
    {
      icon: GraduationCap,
      value: 120,
      suffix: '',
      label: 'Élèves inscrits',
      description: 'École primaire',
      color: 'green',
      gridClass: 'col-span-1',
    },
    {
      icon: Home,
      value: 2,
      suffix: '',
      label: 'Structures gérées',
      description: 'Orphelinat & École',
      color: 'gold',
      gridClass: 'col-span-1 md:col-span-2 lg:col-span-1',
    },
    {
      icon: Heart,
      value: 100,
      suffix: '%',
      label: 'Des dons',
      description: 'Utilisés sur le terrain',
      color: 'rose',
      gridClass: 'col-span-1',
    },
    {
      icon: Utensils,
      value: 500,
      suffix: '+',
      label: 'Repas servis',
      description: 'Chaque mois',
      color: 'amber',
      gridClass: 'col-span-1',
    },
    {
      icon: Globe2,
      value: 2,
      suffix: '',
      label: 'Pays d\'action',
      description: 'France & Congo',
      color: 'indigo',
      gridClass: 'col-span-1',
    },
  ]

  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      iconBg: 'bg-primary-100',
      gradient: 'from-primary-500 to-primary-700',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      iconBg: 'bg-green-100',
      gradient: 'from-green-500 to-green-700',
    },
    gold: {
      bg: 'bg-gold-50',
      icon: 'text-gold-600',
      iconBg: 'bg-gold-100',
      gradient: 'from-gold-500 to-gold-700',
    },
    rose: {
      bg: 'bg-rose-50',
      icon: 'text-rose-600',
      iconBg: 'bg-rose-100',
      gradient: 'from-rose-500 to-rose-700',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      iconBg: 'bg-amber-100',
      gradient: 'from-amber-500 to-amber-700',
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
      gradient: 'from-indigo-500 to-indigo-700',
    },
  }

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-100/30 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10" ref={containerRef}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span>🇨🇬</span>
            <span>Notre Impact au Congo</span>
          </span>
          <h2 className="heading-section mb-6">
            Des chiffres qui parlent
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Grâce à votre générosité, nous changeons des vies chaque jour à Kinshasa
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const colors = colorClasses[stat.color]
            
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`${stat.gridClass} impact-card group cursor-pointer`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                </div>

                {/* Animated Number */}
                <div className="mb-3">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <h3 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500">
                  {stat.description}
                </p>

                {/* Hover gradient line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`} />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Featured Stats - Large Bento Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto"
        >
          {/* Orphanage Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="bento-card p-8 bg-gradient-to-br from-green-50 to-green-100/50 border border-green-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">L&apos;Orphelinat</h3>
                    <p className="text-sm text-green-600 font-medium">Kinshasa, Congo</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Hébergement sécurisé 24h/24</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>3 repas nutritifs par jour</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Suivi médical régulier</span>
                  </li>
                </ul>
              </div>
              <span className="text-6xl font-extrabold text-green-200/60">50</span>
            </div>
          </motion.div>

          {/* School Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="bento-card p-8 bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">L&apos;École Primaire</h3>
                    <p className="text-sm text-primary-600 font-medium">CP à CM2</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 text-gray-700">
                    <span className="w-2 h-2 bg-primary-500 rounded-full" />
                    <span>Programme éducatif complet</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-700">
                    <span className="w-2 h-2 bg-primary-500 rounded-full" />
                    <span>6 enseignants qualifiés</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-700">
                    <span className="w-2 h-2 bg-primary-500 rounded-full" />
                    <span>Fournitures scolaires fournies</span>
                  </li>
                </ul>
              </div>
              <span className="text-6xl font-extrabold text-primary-200/60">120</span>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-slate-500 mb-6">
            Chaque don compte pour faire grandir ces chiffres
          </p>
          <motion.a
            href="/don"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn-gold inline-flex items-center text-lg"
          >
            <Heart className="w-5 h-5 mr-2" fill="currentColor" />
            Contribuer à notre mission
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default ImpactStats
