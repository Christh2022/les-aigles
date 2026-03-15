import { useEffect, useState } from 'react'
import { Calendar, MapPin, Clock, Users, Filter } from 'lucide-react'
import { getEvenements } from '../lib/supabaseClient'

const Events = () => {
  const [evenements, setEvenements] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('ALL')

  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        setLoading(true)
        const data = await getEvenements()
        setEvenements(data || [])
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvenements()
  }, [])

  const filteredEvents = selectedCountry === 'ALL'
    ? evenements
    : evenements.filter(e => e.pays === selectedCountry)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isUpcoming = (dateDebut) => {
    return new Date(dateDebut) >= new Date()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-10 h-10" />
              <h1 className="text-4xl md:text-5xl font-bold">Événements</h1>
            </div>
            <p className="text-xl text-gray-100">
              Découvrez nos événements en France et au Congo. Rejoignez-nous pour faire la différence !
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b sticky top-20 z-40 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Filtrer par pays:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCountry('ALL')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCountry === 'ALL'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous les événements
              </button>
              <button
                onClick={() => setSelectedCountry('France')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCountry === 'France'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🇫🇷 France
              </button>
              <button
                onClick={() => setSelectedCountry('Congo')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCountry === 'Congo'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🇨🇬 Congo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            // Loading Skeletons
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="card overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  {/* Event Image/Banner */}
                  <div className={`h-48 flex items-center justify-center ${
                    event.pays === 'France'
                      ? 'bg-gradient-to-br from-primary-400 to-primary-600'
                      : 'bg-gradient-to-br from-green-400 to-green-600'
                  }`}>
                    <Calendar className="w-20 h-20 text-white opacity-80" />
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    {/* Location Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`badge ${
                        event.pays === 'France' ? 'badge-france' : 'badge-congo'
                      }`}>
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.pays === 'France' ? '🇫🇷' : '🇨🇬'} {event.lieu}, {event.pays}
                      </span>
                      {isUpcoming(event.date_debut) && (
                        <span className="badge bg-gold-100 text-gold-800">
                          À venir
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {event.titre}
                    </h3>

                    {/* Event Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Event Date & Time */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        <span>{formatDate(event.date_debut)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        <span>{formatTime(event.date_debut)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${
                        isUpcoming(event.date_debut)
                          ? 'bg-primary-600 hover:bg-primary-700 text-white'
                          : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                      }`}
                      disabled={!isUpcoming(event.date_debut)}
                    >
                      {isUpcoming(event.date_debut) ? (
                        <span className="flex items-center justify-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>S&apos;inscrire</span>
                        </span>
                      ) : (
                        'Événement passé'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedCountry === 'ALL'
                  ? 'Il n\'y a pas d\'événements disponibles pour le moment.'
                  : `Aucun événement prévu ${selectedCountry === 'France' ? 'en France' : 'au Congo'} pour le moment.`}
              </p>
              {selectedCountry !== 'ALL' && (
                <button
                  onClick={() => setSelectedCountry('ALL')}
                  className="btn-primary"
                >
                  Voir tous les événements
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      {!loading && evenements.length > 0 && (
        <section className="py-12 bg-white border-t">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {evenements.length}
                </div>
                <div className="text-gray-600">Événements Total</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {evenements.filter(e => isUpcoming(e.date_debut)).length}
                </div>
                <div className="text-gray-600">À Venir</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {evenements.filter(e => e.pays === 'France').length}
                </div>
                <div className="text-gray-600">🇫🇷 France</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {evenements.filter(e => e.pays === 'Congo').length}
                </div>
                <div className="text-gray-600">🇨🇬 Congo</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <Users className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Organisez votre propre événement
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Vous souhaitez organiser un événement de collecte de fonds ou de sensibilisation ?
            Contactez-nous !
          </p>
          <a
            href="mailto:contact@les-aigles.org"
            className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-all duration-200 inline-block"
          >
            Nous Contacter
          </a>
        </div>
      </section>
    </div>
  )
}

export default Events
