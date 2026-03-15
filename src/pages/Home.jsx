import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Globe,
  Heart,
  GraduationCap,
  Users,
  MapPin,
  ArrowRight,
  BookOpen,
  Home as HomeIcon,
  Utensils,
  Calendar,
} from 'lucide-react'
import { getFormations, getArticles, getEvenements } from '../lib/supabaseClient'

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
  }, [])

  const filteredFormations = selectedCountry === 'ALL'
    ? formations
    : formations.filter(f => f.pays_concerne === selectedCountry)

  return (
    <div className="min-h-screen">
      {/* Hero Section - Premium Design with Royal Blue */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-24 md:py-36 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge with better styling */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-white/20">
              <Globe className="w-5 h-5 text-gold-400" />
              <span className="text-sm font-semibold tracking-wide">Aide Sociale Internationale</span>
            </div>

            {/* Hero Title - Enhanced Typography */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
              De la France au Congo,<br />
              <span className="text-gold-400 bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
                et demain vers le monde
              </span>
            </h1>

            {/* Subtitle with better spacing */}
            <p className="text-xl md:text-2xl mb-12 text-gray-100 max-w-3xl mx-auto leading-relaxed font-light">
              L&apos;association La Famille Les Aigles œuvre pour l&apos;éducation, la formation et l&apos;insertion des jeunes en France et en Afrique.
            </p>

            {/* CTA Buttons - Premium styling */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/don" className="btn-gold text-lg group">
                <Heart className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                Faire un Don
              </Link>
              <Link
                to="/missions"
                className="btn-secondary !border-white/30 !text-white hover:!bg-white/10 text-lg group"
              >
                Découvrir nos missions
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Two Poles Section - Premium Card Design */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          {/* Section Header with better spacing */}
          <div className="text-center mb-16">
            <h2 className="heading-section mb-6">
              Nos Deux Pôles d&apos;Action
            </h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              Une présence stratégique en France et au Congo pour maximiser notre impact social
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* France Pole - Enhanced Card */}
            <div className="card-interactive p-10 border-2 border-primary-200 hover:border-primary-400 bg-gradient-to-br from-white to-primary-50/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">France</h3>
                    <p className="text-sm text-gray-500 font-medium">Siège Social - Melun</p>
                  </div>
                </div>
                <span className="badge badge-france text-base px-5 py-2 shadow-md">🇫🇷</span>
              </div>

              <ul className="space-y-4 mt-8">
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">Coordination administrative et gouvernance</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">Programmes de formation pour jeunes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">Collecte de fonds et sensibilisation</span>
                </li>
              </ul>
            </div>

            {/* Congo Pole - Enhanced Card */}
            <div className="card-interactive p-10 border-2 border-green-200 hover:border-green-400 bg-gradient-to-br from-white to-green-50/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Congo</h3>
                    <p className="text-sm text-gray-500 font-medium">Opérations - Kinshasa</p>
                  </div>
                </div>
                <span className="badge badge-congo text-base px-5 py-2 shadow-md">🇨🇬</span>
              </div>

              <ul className="space-y-4 mt-8">
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HomeIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">Gestion de l&apos;orphelinat</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">Direction de l&apos;école primaire</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Utensils className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">Programmes d&apos;insertion et d&apos;aide alimentaire</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Missions Section - Premium Cards with Hover Effects */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-section mb-6">
              Nos Missions au Congo
            </h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              Au cœur de nos actions : l&apos;éducation et la protection des enfants
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Orphanage Card */}
            <div className="card-interactive overflow-hidden group">
              <div className="h-72 bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-green-900/10"></div>
                <HomeIcon className="w-32 h-32 text-white opacity-90 group-hover:scale-110 transition-transform duration-500 relative z-10" />
              </div>
              <div className="p-8">
                <span className="badge badge-congo mb-4 shadow-sm">🇨🇬 Kinshasa, Congo</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">L&apos;Orphelinat</h3>
                <p className="text-body text-gray-600 mb-6 leading-relaxed">
                  Nous accueillons et protégeons les enfants orphelins en leur offrant un foyer sûr,
                  des repas quotidiens, des soins médicaux et un accompagnement psychologique.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Capacité: 50 enfants</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Âges: 3 à 17 ans</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Personnel: 8 éducateurs permanents</span>
                  </li>
                </ul>
                <Link to="/missions/orphelinat" className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center group/link">
                  En savoir plus
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* School Card */}
            <div className="card-interactive overflow-hidden group">
              <div className="h-72 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-900/10"></div>
                <BookOpen className="w-32 h-32 text-white opacity-90 group-hover:scale-110 transition-transform duration-500 relative z-10" />
              </div>
              <div className="p-8">
                <span className="badge badge-congo mb-4 shadow-sm">🇨🇬 Kinshasa, Congo</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">L&apos;École Primaire</h3>
                <p className="text-body text-gray-600 mb-6 leading-relaxed">
                  Notre école primaire offre une éducation de qualité aux enfants du quartier,
                  avec un programme complet incluant français, mathématiques, sciences et arts.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="font-medium">Élèves inscrits: 120 enfants</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="font-medium">Classes: CP à CM2</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="font-medium">Enseignants: 6 professeurs qualifiés</span>
                  </li>
                </ul>
                <Link to="/missions/ecole" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center group/link">
                  En savoir plus
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formations Section - Enhanced with Skeleton Loading */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-section mb-6">
              Formations & Insertion des Jeunes
            </h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              Des programmes adaptés pour préparer l&apos;avenir de notre jeunesse
            </p>
          </div>

          {/* Country Filter - Enhanced Design */}
          <div className="flex justify-center mb-12 flex-wrap gap-3">
            <button
              onClick={() => setSelectedCountry('ALL')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform ${
                selectedCountry === 'ALL'
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md active:scale-95'
              }`}
            >
              Tous les pays
            </button>
            <button
              onClick={() => setSelectedCountry('France')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform ${
                selectedCountry === 'France'
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md active:scale-95'
              }`}
            >
              🇫🇷 France
            </button>
            <button
              onClick={() => setSelectedCountry('Congo')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform ${
                selectedCountry === 'Congo'
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md active:scale-95'
              }`}
            >
              🇨🇬 Congo
            </button>
          </div>

          {/* Formations Grid with Skeleton Loading */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6">
                  <div className="skeleton h-5 w-3/4 mb-4"></div>
                  <div className="skeleton h-4 w-full mb-2"></div>
                  <div className="skeleton h-4 w-5/6 mb-4"></div>
                  <div className="skeleton h-8 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredFormations.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredFormations.slice(0, 6).map((formation) => (
                <div key={formation.id} className="card-interactive p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className={`badge ${formation.pays_concerne === 'France' ? 'badge-france' : 'badge-congo'} shadow-sm`}>
                      {formation.pays_concerne === 'France' ? '🇫🇷' : '🇨🇬'} {formation.pays_concerne}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">{formation.titre}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{formation.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full">
                      Niveau: {formation.niveau}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500 text-lg">Aucune formation disponible pour le moment</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/formations" className="btn-primary text-lg group">
              Voir toutes les formations
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog & Events Section - Premium Cards */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Blog */}
            <div>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Blog & Actualités</h2>
                <Link to="/blog" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center group">
                  Tout voir
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              <div className="space-y-6">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="card p-6">
                      <div className="flex items-start space-x-4">
                        <div className="skeleton w-24 h-24 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="skeleton h-4 w-3/4 mb-2"></div>
                          <div className="skeleton h-3 w-full mb-2"></div>
                          <div className="skeleton h-3 w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : articles.length > 0 ? (
                  articles.map((article) => (
                    <div key={article.id} className="card-interactive p-6">
                      <div className="flex items-start space-x-4">
                        {article.image_url && (
                          <img
                            src={article.image_url}
                            alt={article.titre}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0 shadow-sm"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2 tracking-tight">{article.titre}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{article.contenu}</p>
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(article.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-12">Aucun article disponible</p>
                )}
              </div>
            </div>

            {/* Events */}
            <div>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Événements à venir</h2>
                <Link to="/evenements" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center group">
                  Tout voir
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              <div className="space-y-6">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="card p-6">
                      <div className="flex items-start space-x-4">
                        <div className="skeleton w-20 h-20 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="skeleton h-4 w-3/4 mb-2"></div>
                          <div className="skeleton h-3 w-full mb-2"></div>
                          <div className="skeleton h-3 w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : evenements.length > 0 ? (
                  evenements.map((event) => (
                    <div key={event.id} className="card-interactive p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex flex-col items-center justify-center shadow-sm">
                          <Calendar className="w-7 h-7 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-bold text-gray-900 tracking-tight">{event.titre}</h3>
                            <span className={`badge ${event.pays === 'France' ? 'badge-france' : 'badge-congo'} text-xs shadow-sm`}>
                              {event.pays === 'France' ? '🇫🇷' : '🇨🇬'} {event.lieu}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{event.description}</p>
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-12">Aucun événement à venir</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium Gold Design */}
      <section className="py-20 bg-gradient-to-br from-gold-500 via-gold-600 to-gold-700 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Heart className="w-10 h-10" fill="currentColor" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Votre don change des vies
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Soutenez nos actions en France et au Congo. Choisissez le projet que vous souhaitez financer.
          </p>
          <Link to="/don" className="bg-white text-gold-600 hover:bg-gray-50 font-bold py-5 px-12 rounded-full transition-all duration-300 inline-flex items-center text-lg shadow-2xl hover:shadow-xl hover:scale-105 active:scale-95">
            Faire un Don Maintenant
            <ArrowRight className="w-6 h-6 ml-3" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
