import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Users,
  MapPin,
  ArrowRight,
  Home as HomeIcon,
  Utensils,
  Calendar,
  Heart,
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { getFormations, getArticles, getEvenements } from '../lib/supabaseClient'
import { supabase } from '../lib/supabaseClient'
import Hero from '../components/Hero'
import ImpactStats from '../components/ImpactStats'

const DONATION_URL = 'https://www.paypal.me/Lafamillelesaigles?locale.x=fr_FR'

const Home = () => {
  const [formations, setFormations] = useState([])
  const [articles, setArticles] = useState([])
  const [evenements, setEvenements] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('ALL')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [formationsData, articlesData, evenementsData] = await Promise.all([
          getFormations(),
          getArticles('FR'),
          getEvenements(),
        ])
        setFormations(formationsData || [])
        setArticles(articlesData?.slice(0, 3) || [])
        setEvenements(evenementsData?.slice(0, 3) || [])
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const articlesChannel = supabase
      .channel('home-articles-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        () => {
          fetchData()
        }
      )
      .subscribe()

    const eventsChannel = supabase
      .channel('home-evenements-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'evenements' },
        () => {
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(articlesChannel)
      supabase.removeChannel(eventsChannel)
    }
  }, [])

  const filteredFormations = selectedCountry === 'ALL'
    ? formations
    : formations.filter(f => f.pays_concerne === selectedCountry)

  const isVideoUrl = (url = '') => /\.(mp4|webm|mov)(\?.*)?$/i.test(url)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - New Aero-Modern Component */}
      <Hero />

      {/* Impact Stats Section */}
      <ImpactStats />

      {/* Two Poles Section - Aero-Modern Bento Design */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-50/50 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-green-50/50 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-section mb-6">
              Nos Deux Pôles d&apos;Action
            </h2>
            <p className="text-subtitle max-w-2xl mx-auto">
              Une présence stratégique en France et au Congo pour maximiser notre impact social
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {/* France Pole - Bento Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bento-card p-10 bg-gradient-to-br from-white to-primary-50/30 border border-primary-100 group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-500">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">France</h3>
                    <p className="text-sm text-slate-400 font-medium">Siège Social - Melun</p>
                  </div>
                </div>
                <span className="text-3xl">🇫🇷</span>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">Coordination administrative et gouvernance</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">Programmes de formation pour jeunes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">Collecte de fonds et sensibilisation</span>
                </li>
              </ul>
            </motion.div>

            {/* Congo Pole - Bento Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bento-card p-10 bg-gradient-to-br from-white to-green-50/30 border border-green-100 group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-500">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Congo</h3>
                    <p className="text-sm text-slate-400 font-medium">Opérations - Kinshasa</p>
                  </div>
                </div>
                <span className="text-3xl">🇨🇬</span>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HomeIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">Gestion de l&apos;orphelinat</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Utensils className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">Programmes d&apos;insertion et d&apos;aide alimentaire</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Formations Section - Bento Grid Design */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-radial-gradient" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <GraduationCap className="w-4 h-4" />
              <span>Insertion Professionnelle</span>
            </span>
            <h2 className="heading-section mb-6">
              Formations &amp; Insertion des Jeunes
            </h2>
            <p className="text-subtitle max-w-2xl mx-auto">
              Des programmes adaptés pour préparer l&apos;avenir de notre jeunesse
            </p>
          </motion.div>

          {/* Country Filter - Pill Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12 flex-wrap gap-3"
          >
            {['ALL', 'France', 'Congo'].map((country) => (
              <motion.button
                key={country}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCountry(country)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-500 ${
                  selectedCountry === country
                    ? country === 'Congo'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                      : 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-soft'
                }`}
              >
                {country === 'ALL' ? 'Tous les pays' : country === 'France' ? '🇫🇷 France' : '🇨🇬 Congo'}
              </motion.button>
            ))}
          </motion.div>

          {/* Formations Bento Grid */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bento-card p-8">
                  <div className="skeleton h-12 w-12 rounded-2xl mb-6"></div>
                  <div className="skeleton h-6 w-3/4 mb-4"></div>
                  <div className="skeleton h-4 w-full mb-2"></div>
                  <div className="skeleton h-4 w-5/6 mb-6"></div>
                  <div className="skeleton h-8 w-1/2 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : filteredFormations.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredFormations.slice(0, 6).map((formation, index) => (
                <motion.div
                  key={formation.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className={`bento-card p-8 group ${
                    index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                      formation.pays_concerne === 'France'
                        ? 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary-500/20'
                        : 'bg-gradient-to-br from-green-500 to-green-700 shadow-green-500/20'
                    } group-hover:scale-110 transition-transform duration-500`}>
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <span className={`badge ${formation.pays_concerne === 'France' ? 'badge-france' : 'badge-congo'}`}>
                      {formation.pays_concerne === 'France' ? '🇫🇷' : '🇨🇬'} {formation.pays_concerne}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{formation.titre}</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed line-clamp-2">{formation.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                      Niveau: {formation.niveau}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-slate-500 text-lg">Aucune formation disponible pour le moment</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link to="/formations">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-lg group"
              >
                Voir toutes les formations
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-500" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Blog & Events Section - Bento Layout */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Blog */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Blog &amp; Actualités</h2>
                <Link to="/blog" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center group">
                  Tout voir
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-500" />
                </Link>
              </div>

              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="bento-card p-6">
                      <div className="flex items-start space-x-4">
                        <div className="skeleton w-24 h-24 rounded-2xl flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="skeleton h-5 w-3/4 mb-3"></div>
                          <div className="skeleton h-4 w-full mb-2"></div>
                          <div className="skeleton h-4 w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : articles.length > 0 ? (
                  articles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="bento-card p-6 group cursor-pointer"
                    >
                      <div className="flex items-start space-x-4">
                        {article.image_url && (
                          isVideoUrl(article.image_url) ? (
                            <video
                              src={article.image_url}
                              controls
                              playsInline
                              preload="metadata"
                              className="w-24 h-24 object-contain rounded-2xl flex-shrink-0 bg-black/5"
                            />
                          ) : (
                            <img
                              src={article.image_url}
                              alt={article.titre}
                              className="w-24 h-24 object-contain rounded-2xl flex-shrink-0 bg-black/5"
                            />
                          )
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2 tracking-tight group-hover:text-primary-600 transition-colors duration-300">{article.titre}</h3>
                          <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">{article.contenu}</p>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(article.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-12">Aucun article disponible</p>
                )}
              </div>
            </motion.div>

            {/* Events */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Événements à venir</h2>
                <Link to="/evenements" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center group">
                  Tout voir
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-500" />
                </Link>
              </div>

              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="bento-card p-6">
                      <div className="flex items-start space-x-4">
                        <div className="skeleton w-20 h-20 rounded-2xl flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="skeleton h-5 w-3/4 mb-3"></div>
                          <div className="skeleton h-4 w-full mb-2"></div>
                          <div className="skeleton h-4 w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : evenements.length > 0 ? (
                  evenements.map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="bento-card p-6 group cursor-pointer"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-500">
                          <Calendar className="w-8 h-8 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-bold text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors duration-300">{event.titre}</h3>
                            <span className={`badge ${event.pays === 'France' ? 'badge-france' : 'badge-congo'} text-xs`}>
                              {event.pays === 'France' ? '🇫🇷' : '🇨🇬'} {event.lieu}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">{event.description}</p>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-12">Aucun événement à venir</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Premium Blue Design with Glassmorphism */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container-custom text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Votre don change des vies
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
            Soutenez nos actions en France et au Congo. Choisissez le projet que vous souhaitez financer.
          </p>
          <a href={DONATION_URL} target="_blank" rel="noreferrer">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-primary-600 hover:bg-gray-50 font-bold py-5 px-12 rounded-full transition-all duration-500 inline-flex items-center text-lg shadow-2xl"
            >
              Faire un Don Maintenant
              <ArrowRight className="w-6 h-6 ml-3" />
            </motion.button>
          </a>
          <p className="mt-6 text-sm md:text-base max-w-3xl mx-auto opacity-85">
            Chaque contribution finance des actions concretes : accompagnement social, aide alimentaire,
            formations de jeunes et projets communautaires sur le terrain.
          </p>
        </motion.div>
      </section>
    </div>
  )
}

export default Home
