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
      {/* Hero Section - Vision Globale */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Globe className="w-5 h-5 text-gold-400" />
              <span className="text-sm font-medium">Aide Sociale Internationale</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              De la France au Congo,<br />
              <span className="text-gold-400">et demain vers le monde</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              L&apos;association La Famille Les Aigles œuvre pour l&apos;éducation, la formation et l&apos;insertion des jeunes en France et en Afrique.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/don" className="btn-gold">
                <Heart className="w-5 h-5 mr-2" fill="currentColor" />
                Faire un Don
              </Link>
              <Link
                to="/missions"
                className="bg-white text-primary-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 inline-flex items-center"
              >
                Découvrir nos missions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section - Deux pôles d'activité */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Deux Pôles d&apos;Action
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une présence stratégique en France et au Congo pour maximiser notre impact social
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pôle France */}
            <div className="card p-8 border-2 border-primary-200 hover:border-primary-400 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">France</h3>
                    <p className="text-sm text-gray-500">Siège Social - Melun</p>
                  </div>
                </div>
                <span className="badge badge-france text-lg px-4 py-2">🇫🇷</span>
              </div>

              <ul className="space-y-3 mt-6">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-gray-700">Coordination administrative et gouvernance</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-gray-700">Programmes de formation pour jeunes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-gray-700">Collecte de fonds et sensibilisation</span>
                </li>
              </ul>
            </div>

            {/* Pôle Congo */}
            <div className="card p-8 border-2 border-green-200 hover:border-green-400 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Congo</h3>
                    <p className="text-sm text-gray-500">Opérations - Kinshasa</p>
                  </div>
                </div>
                <span className="badge badge-congo text-lg px-4 py-2">🇨🇬</span>
              </div>

              <ul className="space-y-3 mt-6">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HomeIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Gestion de l&apos;orphelinat</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Direction de l&apos;école primaire</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Utensils className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Programmes d&apos;insertion et d&apos;aide alimentaire</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Missions Section - Focus Orphelinat & École */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Missions au Congo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Au cœur de nos actions : l&apos;éducation et la protection des enfants
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Orphelinat */}
            <div className="card overflow-hidden group">
              <div className="h-64 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <HomeIcon className="w-24 h-24 text-white opacity-80 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <span className="badge badge-congo mb-3">🇨🇬 Kinshasa, Congo</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">L&apos;Orphelinat</h3>
                <p className="text-gray-600 mb-4">
                  Nous accueillons et protégeons les enfants orphelins en leur offrant un foyer sûr,
                  des repas quotidiens, des soins médicaux et un accompagnement psychologique.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Capacité: 50 enfants</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Âges: 3 à 17 ans</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Personnel: 8 éducateurs permanents</span>
                  </li>
                </ul>
                <Link to="/missions/orphelinat" className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center">
                  En savoir plus
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* École */}
            <div className="card overflow-hidden group">
              <div className="h-64 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-white opacity-80 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <span className="badge badge-congo mb-3">🇨🇬 Kinshasa, Congo</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">L&apos;École Primaire</h3>
                <p className="text-gray-600 mb-4">
                  Notre école primaire offre une éducation de qualité aux enfants du quartier,
                  avec un programme complet incluant français, mathématiques, sciences et arts.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Élèves inscrits: 120 enfants</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Classes: CP à CM2</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Enseignants: 6 professeurs qualifiés</span>
                  </li>
                </ul>
                <Link to="/missions/ecole" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center">
                  En savoir plus
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Espace Formations & Jeunes */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Formations & Insertion des Jeunes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des programmes adaptés pour préparer l&apos;avenir de notre jeunesse
            </p>
          </div>

          {/* Country Filter */}
          <div className="flex justify-center mb-8 flex-wrap gap-3">
            <button
              onClick={() => setSelectedCountry('ALL')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCountry === 'ALL'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tous les pays
            </button>
            <button
              onClick={() => setSelectedCountry('France')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCountry === 'France'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🇫🇷 France
            </button>
            <button
              onClick={() => setSelectedCountry('Congo')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCountry === 'Congo'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🇨🇬 Congo
            </button>
          </div>

          {/* Formations Grid */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : filteredFormations.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredFormations.slice(0, 6).map((formation) => (
                <div key={formation.id} className="card p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <GraduationCap className="w-8 h-8 text-primary-600" />
                    <span className={`badge ${formation.pays_concerne === 'France' ? 'badge-france' : 'badge-congo'}`}>
                      {formation.pays_concerne === 'France' ? '🇫🇷' : '🇨🇬'} {formation.pays_concerne}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{formation.titre}</h3>
                  <p className="text-sm text-gray-600 mb-3">{formation.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Niveau: {formation.niveau}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune formation disponible pour le moment</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/formations" className="btn-primary inline-flex items-center">
              Voir toutes les formations
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog & Événements Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Blog */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Blog & Actualités</h2>
                <Link to="/blog" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                  Tout voir
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="space-y-6">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="card p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))
                ) : articles.length > 0 ? (
                  articles.map((article) => (
                    <div key={article.id} className="card p-4 hover:scale-102 transition-transform duration-200">
                      <div className="flex items-start space-x-4">
                        {article.image_url && (
                          <img
                            src={article.image_url}
                            alt={article.titre}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{article.titre}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.contenu}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(article.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucun article disponible</p>
                )}
              </div>
            </div>

            {/* Événements */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Événements à venir</h2>
                <Link to="/evenements" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                  Tout voir
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="space-y-6">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="card p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))
                ) : evenements.length > 0 ? (
                  evenements.map((event) => (
                    <div key={event.id} className="card p-4 hover:scale-102 transition-transform duration-200">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-lg flex flex-col items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-gray-900">{event.titre}</h3>
                            <span className={`badge ${event.pays === 'France' ? 'badge-france' : 'badge-congo'}`}>
                              {event.pays === 'France' ? '🇫🇷' : '🇨🇬'} {event.lieu}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucun événement à venir</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Donation */}
      <section className="py-16 bg-gradient-to-r from-gold-500 to-gold-600 text-white">
        <div className="container-custom text-center">
          <Heart className="w-16 h-16 mx-auto mb-6" fill="currentColor" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Votre don change des vies
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Soutenez nos actions en France et au Congo. Choisissez le projet que vous souhaitez financer.
          </p>
          <Link to="/don" className="bg-white text-gold-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-lg transition-all duration-200 inline-flex items-center text-lg shadow-xl">
            Faire un Don Maintenant
            <ArrowRight className="w-6 h-6 ml-3" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
