import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, BookOpen, MapPin } from 'lucide-react'
import { createFormationInscription, getFormationById } from '../lib/supabaseClient'

const PHONE_RULES = {
  France: {
    dialCode: '+33',
    placeholder: 'Ex: 6 12 34 56 78',
    pattern: '^(?:0|\\+33|33)?[1-9](?:[\\s.-]?\\d{2}){4}$',
    hint: 'Format France: 06 12 34 56 78',
  },
  Congo: {
    dialCode: '+242',
    placeholder: 'Ex: 06 123 45 67',
    pattern: '^(?:\\+242|242|0)?[0-9](?:[\\s.-]?\\d){7,8}$',
    hint: 'Format Congo: 06 123 45 67',
  },
  International: {
    dialCode: '+',
    placeholder: 'Ex: +243 999 000 000',
    pattern: '^\\+?[0-9][0-9\\s.-]{6,}$',
    hint: 'Format international: +Indicatif ...',
  },
}

export default function FormationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formation, setFormation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    pays: 'France',
    telephone: '',
    message: '',
  })

  const phoneRule = PHONE_RULES[formData.pays] || PHONE_RULES.International

  useEffect(() => {
    const loadFormation = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getFormationById(id)
        setFormation(data)
      } catch (err) {
        console.error('Erreur chargement formation:', err)
        setError('Formation introuvable ou inaccessible.')
      } finally {
        setLoading(false)
      }
    }

    if (id) loadFormation()
  }, [id])

  const getDisplayCountry = (item) => {
    if (/alphabétisation et soutien scolaire/i.test(item?.titre || '')) {
      return 'France & Congo'
    }
    return item?.pays_concerne || 'International'
  }

  useEffect(() => {
    const mappedCountry = formation?.pays_concerne === 'Congo' ? 'Congo' : formation?.pays_concerne === 'France' ? 'France' : 'International'
    if (mappedCountry) {
      setFormData((prev) => ({ ...prev, pays: mappedCountry }))
    }
  }, [formation])

  const normalizePhone = (rawPhone, selectedCountry) => {
    const cleaned = rawPhone.replace(/\s|\.|-/g, '')
    const rule = PHONE_RULES[selectedCountry] || PHONE_RULES.International

    if (!cleaned) return cleaned
    if (cleaned.startsWith('+')) return cleaned
    if (rule.dialCode === '+') return `+${cleaned}`
    if (cleaned.startsWith('0')) return `${rule.dialCode}${cleaned.slice(1)}`
    if (cleaned.startsWith(rule.dialCode.replace('+', ''))) return `+${cleaned}`
    return `${rule.dialCode}${cleaned}`
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formation) return

    try {
      setSubmitting(true)
      setSubmitMessage('')
      setSubmitError('')

      await createFormationInscription({
        formation_id: formation.id,
        formation_titre: formation.titre,
        nom: formData.nom.trim(),
        email: formData.email.trim(),
        telephone: normalizePhone(formData.telephone.trim(), formData.pays),
        message: formData.message.trim() || null,
      })

      setSubmitMessage('Inscription envoyee avec succes. Notre equipe vous contactera rapidement.')
      setFormData((prev) => ({ ...prev, nom: '', email: '', telephone: '', message: '' }))
    } catch (err) {
      console.error('Erreur inscription formation:', err)
      setSubmitError('Impossible d envoyer l inscription pour le moment. Merci de reessayer.')
    } finally {
      setSubmitting(false)
    }
  }

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
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>

          {loading ? (
            <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm">
              <div className="skeleton mb-5 h-7 w-2/3" />
              <div className="skeleton mb-3 h-4 w-1/2" />
              <div className="skeleton h-56 w-full rounded-2xl" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-8 text-center text-sm text-slate-500">
              {error}
              <div className="mt-4">
                <Link
                  to="/formations"
                  className="inline-flex items-center rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white"
                >
                  Revenir aux formations
                </Link>
              </div>
            </div>
          ) : formation ? (
            <article className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-sm">
              <div className="relative h-52 w-full p-6 text-white">
                {formation.image_url ? (
                  <img
                    src={formation.image_url}
                    alt={formation.titre}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500" />
                )}
                <div className="absolute inset-0 bg-slate-900/25" />
                <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  <BookOpen className="h-3.5 w-3.5" /> Formation
                </div>
                <h1 className="mt-4 max-w-4xl text-2xl font-extrabold tracking-tight md:text-4xl">
                  {formation.titre}
                </h1>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 font-semibold text-primary-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> {formation.niveau || 'General'}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
                    <MapPin className="h-3.5 w-3.5" /> {getDisplayCountry(formation)}
                  </span>
                </div>

                <h2 className="text-base font-bold text-gray-900 md:text-lg">Description complete</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700 md:text-base">
                  {formation.description}
                </p>

                <div className="mt-8 rounded-2xl border border-primary-100 bg-slate-50 p-4 md:p-6">
                  <h3 className="text-sm font-bold text-gray-900 md:text-base">S inscrire a cette formation</h3>
                  <p className="mt-1 text-xs text-slate-600 md:text-sm">
                    Remplissez ce formulaire pour reserver votre place. Nous vous recontacterons avec les details.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-700">Nom complet *</span>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-primary-100 bg-white px-3 py-2 text-sm outline-none focus:border-primary-300"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-700">Email *</span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-primary-100 bg-white px-3 py-2 text-sm outline-none focus:border-primary-300"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-1 block text-xs font-semibold text-slate-700">Pays de residence *</span>
                      <select
                        name="pays"
                        value={formData.pays}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-primary-100 bg-white px-3 py-2 text-sm outline-none focus:border-primary-300"
                      >
                        <option value="France">France</option>
                        <option value="Congo">Congo</option>
                        <option value="International">Autre pays</option>
                      </select>
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-1 block text-xs font-semibold text-slate-700">Telephone *</span>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        required
                        pattern={phoneRule.pattern}
                        title={phoneRule.hint}
                        placeholder={`${phoneRule.dialCode} ${phoneRule.placeholder}`}
                        className="w-full rounded-xl border border-primary-100 bg-white px-3 py-2 text-sm outline-none focus:border-primary-300"
                      />
                      <span className="mt-1 block text-[11px] text-slate-500">
                        Indicatif recommande: {phoneRule.dialCode} - {phoneRule.hint}
                      </span>
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-1 block text-xs font-semibold text-slate-700">Message (optionnel)</span>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-xl border border-primary-100 bg-white px-3 py-2 text-sm outline-none focus:border-primary-300"
                      />
                    </label>

                    <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? 'Envoi en cours...' : 'Envoyer mon inscription'}
                      </button>

                      {submitMessage ? (
                        <p className="text-xs font-medium text-emerald-700">{submitMessage}</p>
                      ) : null}

                      {submitError ? (
                        <p className="text-xs font-medium text-red-600">{submitError}</p>
                      ) : null}
                    </div>
                  </form>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </section>
    </main>
  )
}
