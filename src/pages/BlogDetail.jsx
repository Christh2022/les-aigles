import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CalendarDays, ChevronLeft, Globe2 } from 'lucide-react'
import { getArticleById } from '../lib/supabaseClient'

const isVideoUrl = (url = '') => /\.(mp4|webm|mov)(\?.*)?$/i.test(url)

export default function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getArticleById(id)
        setArticle(data)
      } catch (err) {
        console.error('Erreur chargement article:', err)
        setError('Article introuvable ou inaccessible.')
      } finally {
        setLoading(false)
      }
    }

    if (id) loadArticle()
  }, [id])

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0">
          <div className="absolute -top-16 left-8 h-72 w-72 rounded-full bg-primary-200/20 blur-3xl" />
          <div className="absolute bottom-0 right-8 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-2 text-xs font-semibold text-primary-700 transition hover:bg-primary-50"
          >
            <ChevronLeft className="h-4 w-4" /> Retour
          </button>

          {loading ? (
            <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm">
              <div className="skeleton mb-5 h-7 w-2/3" />
              <div className="skeleton mb-3 h-4 w-1/2" />
              <div className="skeleton h-64 w-full rounded-2xl" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-8 text-center text-sm text-slate-500">
              {error}
              <div className="mt-4">
                <Link
                  to="/blog"
                  className="inline-flex items-center rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white"
                >
                  Revenir au blog
                </Link>
              </div>
            </div>
          ) : article ? (
            <article className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-sm">
              <header className="p-6 md:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                  <Globe2 className="h-3.5 w-3.5" /> {article.langue || 'FR'}
                </span>

                <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                  {article.titre}
                </h1>

                <p className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500 md:text-sm">
                  <CalendarDays className="h-4 w-4" />
                  {article.date ? new Date(article.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                </p>
              </header>

              {article.image_url ? (
                <div className="mx-6 mb-6 overflow-hidden rounded-2xl bg-slate-100 md:mx-8 md:mb-8">
                  {isVideoUrl(article.image_url) ? (
                    <video
                      src={article.image_url}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-[420px] w-full bg-black object-contain"
                    />
                  ) : (
                    <img
                      src={article.image_url}
                      alt={article.titre || 'Article'}
                      className="h-[420px] w-full object-contain bg-black/5"
                    />
                  )}
                </div>
              ) : null}

              <div className="p-6 pt-0 md:p-8 md:pt-0">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-700 md:text-base">
                  {article.contenu}
                </p>
              </div>
            </article>
          ) : null}
        </div>
      </section>
    </main>
  )
}
