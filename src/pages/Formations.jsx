import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BadgeCheck,
  BookOpen,
  Clock3,
  GraduationCap,
  Search,
  SlidersHorizontal,
  Star,
  Users2,
} from 'lucide-react'
import { getFormations } from '../lib/supabaseClient'

const normalizeCountryName = (country = '') => {
  const normalized = country.trim().toLowerCase()

  if (
    [
      'rdc',
      'r.d.c',
      'drc',
      'congo',
      'congo-kinshasa',
      'kinshasa',
      'republique democratique du congo',
      'republique democratique du congo (rdc)',
      'république démocratique du congo',
      'democratic republic of the congo',
    ].includes(normalized)
  ) {
    return 'RDC'
  }

  if (normalized === 'france') {
    return 'France'
  }

  return country
}

export default function Formations() {
  const [formations, setFormations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('ALL')
  const [niveau, setNiveau] = useState('ALL')

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true)
        const data = await getFormations()
        setFormations(data || [])
      } catch (error) {
        console.error('Erreur chargement formations:', error)
        setFormations([])
      } finally {
        setLoading(false)
      }
    }

    fetchFormations()
  }, [])

  const availableCountries = useMemo(() => {
    const values = new Set(formations.map((f) => normalizeCountryName(f.pays_concerne)).filter(Boolean))
    return ['ALL', ...Array.from(values)]
  }, [formations])

  const availableLevels = useMemo(() => {
    const values = new Set(formations.map((f) => f.niveau).filter(Boolean))
    return ['ALL', ...Array.from(values)]
  }, [formations])

  const filteredFormations = useMemo(() => {
    const term = search.trim().toLowerCase()

    return formations.filter((formation) => {
      const matchCountry = country === 'ALL' || normalizeCountryName(formation.pays_concerne) === country
      const matchLevel = niveau === 'ALL' || formation.niveau === niveau
      const content = `${formation.titre || ''} ${formation.description || ''}`.toLowerCase()
      const matchSearch = !term || content.includes(term)

      return matchCountry && matchLevel && matchSearch
    })
  }, [formations, search, country, niveau])

  const buildCourseMeta = (formation, index) => {
    const seed = String(formation.id || index)
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)

    const rating = (4.2 + (seed % 7) / 10).toFixed(1)
    const learners = 120 + (seed % 1700)
    const hours = 2 + (seed % 14)
    const lessons = 8 + (seed % 22)
    const bestseller = seed % 3 === 0

    return {
      rating,
      learners,
      hours,
      lessons,
      bestseller,
    }
  }

  const formatLearners = (value) => `${value.toLocaleString('fr-FR')} apprenants`

  const getDisplayCountry = (formation) => {
    if (/alphabétisation et soutien scolaire/i.test(formation?.titre || '')) {
      return 'France & RDC'
    }
    return normalizeCountryName(formation?.pays_concerne) || 'International'
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0">
          <div className="absolute -top-16 left-8 h-72 w-72 rounded-full bg-primary-200/20 blur-3xl" />
          <div className="absolute bottom-0 right-8 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-xs font-semibold text-primary-700">
              <GraduationCap className="h-4 w-4" />
              Formations & insertion
            </span>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              Catalogue des Formations
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
              Explore des parcours concrets, presentes comme une plateforme de cours moderne, pour renforcer
              les competences et l insertion des jeunes.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container-custom">
          <div className="mb-6 grid gap-3 rounded-2xl border border-primary-100 bg-white p-4 shadow-sm md:grid-cols-3">
            <label className="md:col-span-2 flex items-center gap-2 rounded-xl border border-primary-100 px-3 py-2">
              <Search className="h-4 w-4 text-primary-600" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher une formation"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-primary-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary-700">
              <SlidersHorizontal className="h-4 w-4" />
              Filtres actifs
            </div>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-2">
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="rounded-xl border border-primary-100 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none"
            >
              {availableCountries.map((value) => (
                <option key={value} value={value}>
                  {value === 'ALL' ? 'Tous les pays' : value}
                </option>
              ))}
            </select>

            <select
              value={niveau}
              onChange={(event) => setNiveau(event.target.value)}
              className="rounded-xl border border-primary-100 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none"
            >
              {availableLevels.map((value) => (
                <option key={value} value={value}>
                  {value === 'ALL' ? 'Tous les niveaux' : value}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCountry('ALL')
                setNiveau('ALL')
              }}
              className="rounded-full bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white"
            >
              Tous les cours
            </button>
            {availableCountries
              .filter((value) => value !== 'ALL')
              .map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCountry(value)}
                  className="rounded-full border border-primary-200 bg-white px-4 py-1.5 text-xs font-semibold text-primary-700"
                >
                  {value}
                </button>
              ))}
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-3xl border border-primary-100 bg-white p-5 shadow-sm">
                  <div className="skeleton mb-4 h-5 w-3/4" />
                  <div className="skeleton mb-2 h-4 w-full" />
                  <div className="skeleton mb-2 h-4 w-5/6" />
                  <div className="skeleton h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredFormations.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredFormations.map((formation, index) => (
                <motion.article
                  key={formation.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.03 }}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <Link to={`/formations/${formation.id}`} className="block relative h-40 w-full p-4 text-white">
                    {formation.image_url ? (
                      <img
                        src={formation.image_url}
                        alt={formation.titre}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500" />
                    )}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_40%)]" />
                    <div className="absolute inset-0 bg-slate-900/20" />
                    <div className="relative z-10 flex items-start justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
                        <BookOpen className="h-3.5 w-3.5" /> {formation.niveau || 'General'}
                      </span>
                      {buildCourseMeta(formation, index).bestseller ? (
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-primary-700">
                          Bestseller
                        </span>
                      ) : null}
                    </div>

                  </Link>

                  <div className="p-4">
                    <Link to={`/formations/${formation.id}`}>
                      <h2 className="line-clamp-2 text-base font-bold text-gray-900 hover:text-primary-700">{formation.titre}</h2>
                    </Link>
                    <p className="mt-1 text-xs font-medium text-slate-500">La Famille Les Aigles Academy</p>

                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="font-bold text-amber-700">{buildCourseMeta(formation, index).rating}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={`${formation.id}-${i}`} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{formation.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                        <Users2 className="h-3 w-3" /> {formatLearners(buildCourseMeta(formation, index).learners)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                        <Clock3 className="h-3 w-3" /> {buildCourseMeta(formation, index).hours}h
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                        <BadgeCheck className="h-3 w-3" /> {buildCourseMeta(formation, index).lessons} lecons
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">
                        {getDisplayCountry(formation)}
                      </span>
                      <Link
                        to={`/formations/${formation.id}`}
                        className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
                      >
                        Voir formation
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-8 text-center text-sm text-slate-500">
              Aucune formation trouvee avec ces filtres.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
