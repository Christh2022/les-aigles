import { useMemo, useState } from 'react'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'

const CONTACT_EMAIL = 'contact@les-aigles.org'
const CONTACT_PHONE = '+33 6 12 34 56 78'
const CONTACT_ADDRESS = 'Melun, France'

const initialForm = {
  nom: '',
  email: '',
  sujet: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)

  const mailtoLink = useMemo(() => {
    const subject = encodeURIComponent(form.sujet || 'Demande de contact')
    const body = encodeURIComponent(
      `Nom: ${form.nom || '-'}\nEmail: ${form.email || '-'}\n\nMessage:\n${form.message || ''}`
    )
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }, [form])

  return (
    <main className="min-h-[75vh] bg-gradient-to-b from-white via-slate-50 to-white">
      <section className="container-custom pt-14 pb-8 md:pt-16 md:pb-10">
        <div className="mb-10 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-500">Nous contacter</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Parlons de votre projet
          </h1>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Une question, une demande de partenariat ou une envie de collaborer avec La Famille Les Aigles ?
            Ecrivez-nous, nous revenons vers vous rapidement.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-slate-900">Coordonnees</h2>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-primary-600" />
                  <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-primary-700">
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-primary-600" />
                  <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} className="hover:text-primary-700">
                    {CONTACT_PHONE}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary-600" />
                  <span>{CONTACT_ADDRESS}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 text-primary-600" />
                  <span>Lun - Ven : 09:00 - 18:00</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-primary-100 bg-primary-50/60 p-5">
              <h3 className="text-sm font-bold text-primary-900">Besoin d une reponse rapide ?</h3>
              <p className="mt-2 text-xs text-primary-800">
                Utilisez le formulaire, puis cliquez sur Envoyer. Votre application mail va s ouvrir avec votre message pre-rempli.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
            <h2 className="mb-4 text-base font-bold text-slate-900">Formulaire de contact</h2>

            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  required
                  value={form.nom}
                  onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))}
                  placeholder="Votre nom"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none transition focus:border-primary-300 focus:bg-white"
                />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Votre email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none transition focus:border-primary-300 focus:bg-white"
                />
              </div>

              <input
                required
                value={form.sujet}
                onChange={(e) => setForm((prev) => ({ ...prev, sujet: e.target.value }))}
                placeholder="Sujet"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none transition focus:border-primary-300 focus:bg-white"
              />

              <textarea
                required
                rows={7}
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Votre message"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none transition focus:border-primary-300 focus:bg-white"
              />

              <a
                href={mailtoLink}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-700/20 transition hover:-translate-y-0.5"
              >
                <Send className="h-4 w-4" /> Envoyer
              </a>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
