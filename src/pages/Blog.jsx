import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  CalendarDays,
  Globe2,
  SlidersHorizontal,
  Image as ImageIcon,
  Video,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { getArticles } from '../lib/supabaseClient'
import { supabase } from '../lib/supabaseClient'

const isVideoUrl = (url = '') => /\.(mp4|webm|mov)(\?.*)?$/i.test(url)

export default function Blog() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [langue, setLangue] = useState('ALL')
  const [mediaType, setMediaType] = useState('ALL')
  const [sortOrder, setSortOrder] = useState('RECENT')
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 6

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const data = await getArticles(langue === 'ALL' ? null : langue)
        setArticles(data || [])
      } catch (error) {
        console.error('Erreur chargement blog:', error)
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()

    const channel = supabase
      .channel('articles-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        () => {
          fetchArticles()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [langue])

  const filteredArticles = useMemo(() => {
    const term = search.trim().toLowerCase()
    let result = articles

    if (mediaType === 'VIDEO') {
      result = result.filter((article) => isVideoUrl(article.image_url || ''))
    }

    if (mediaType === 'IMAGE') {
      result = result.filter((article) => article.image_url && !isVideoUrl(article.image_url || ''))
    }

    if (term) {
      result = result.filter((article) => {
        const haystack = `${article.titre || ''} ${article.contenu || ''}`.toLowerCase()
        return haystack.includes(term)
      })
    }

    result = [...result].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return sortOrder === 'RECENT' ? dateB - dateA : dateA - dateB
    })

    return result
  }, [articles, search, mediaType, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE))

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredArticles, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, langue, mediaType, sortOrder])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

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
              <Globe2 className="h-4 w-4" />
              Actualites de l association
            </span>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              Blog & Actualites
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
              Retrouvez nos informations de terrain, nos annonces officielles et les temps forts de nos actions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container-custom">
          <div className="mb-7 grid gap-3 rounded-2xl border border-primary-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
            <label className="flex items-center gap-2 rounded-xl border border-primary-100 px-3 py-2">
              <Search className="h-4 w-4 text-primary-600" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un article"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>

            <select
              value={langue}
              onChange={(event) => setLangue(event.target.value)}
              className="rounded-xl border border-primary-100 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none"
            >
              <option value="ALL">Toutes langues</option>
              <option value="FR">Francais</option>
              <option value="EN">English</option>
            </select>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-primary-100 bg-white p-3 shadow-sm">
            <span className="inline-flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-primary-700">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Navigation blog
            </span>

            <button
              type="button"
              onClick={() => setMediaType('ALL')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                mediaType === 'ALL' ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700'
              }`}
            >
              Tout
            </button>

            <button
              type="button"
              onClick={() => setMediaType('IMAGE')}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                mediaType === 'IMAGE' ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700'
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" /> Images
            </button>

            <button
              type="button"
              onClick={() => setMediaType('VIDEO')}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                mediaType === 'VIDEO' ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700'
              }`}
            >
              <Video className="h-3.5 w-3.5" /> Videos
            </button>

            <div className="ml-auto">
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="rounded-lg border border-primary-100 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 outline-none"
              >
                <option value="RECENT">Plus recents</option>
                <option value="OLD">Plus anciens</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-3xl border border-primary-100 bg-white p-5 shadow-sm">
                  <div className="skeleton mb-4 h-52 w-full rounded-2xl" />
                  <div className="skeleton mb-3 h-5 w-2/3" />
                  <div className="skeleton mb-2 h-4 w-full" />
                  <div className="skeleton h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {paginatedArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.03 }}
                  className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-sm"
                >
                  <Link to={`/blog/${article.id}`} className="block h-56 w-full bg-slate-100">
                    {article.image_url ? (
                      isVideoUrl(article.image_url) ? (
                        <video
                          src={article.image_url}
                          controls
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-contain bg-black"
                        />
                      ) : (
                        <img
                          src={article.image_url}
                          alt={article.titre || 'Article'}
                          className="h-full w-full object-contain bg-black/5"
                          loading="lazy"
                        />
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm font-medium text-slate-500">
                        Aucun media
                      </div>
                    )}
                  </Link>

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700">
                        {article.langue || 'FR'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {article.date ? new Date(article.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                      </span>
                    </div>

                    <h2 className="line-clamp-2 text-lg font-bold text-gray-900">{article.titre}</h2>
                    <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-slate-600">{article.contenu}</p>
                    <Link
                      to={`/blog/${article.id}`}
                      className="mt-4 inline-flex items-center text-xs font-semibold text-primary-700 hover:text-primary-800"
                    >
                      Lire l article
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-8 text-center text-sm text-slate-500">
              Aucun article trouve avec ces filtres.
            </div>
          )}

          {!loading && filteredArticles.length > 0 ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-100 bg-white p-3 shadow-sm">
              <p className="text-xs text-slate-600">
                Page {currentPage} / {totalPages} • {filteredArticles.length} article(s)
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" /> Precedent
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Suivant <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
