import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ShieldCheck,
  LogOut,
  PlusCircle,
  Mail,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  BookText,
  CalendarDays,
  GraduationCap,
  Handshake,
  Baby,
  Users,
  Pencil,
  Trash2,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const initialArticle = {
  titre: '',
  contenu: '',
  image_url: '',
  langue: 'FR',
}

const initialFormation = {
  titre: '',
  description: '',
  image_url: '',
  niveau: 'Debutant',
  pays_concerne: 'France',
}

const initialEvent = {
  titre: '',
  description: '',
  image_url: '',
  lieu: '',
  pays: 'France',
  date_debut: '',
}

const initialPartner = {
  nom: '',
  type: '',
  contact: '',
  email: '',
}

const initialChild = {
  nom: '',
  age: '',
  pays: 'RDC',
  statut: '',
}

const initialVolunteer = {
  nom: '',
  email: '',
  telephone: '',
  competences: '',
}

const ADMIN_PATH = '/acces-prive-lfae-7mQ2x9Kp4Vn8Rt3Yh6Zs1Jd5Wc0bL2t9/admin'
const STORAGE_BUCKET = 'images'

export default function Admin() {
  const [searchParams] = useSearchParams()
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [authMode, setAuthMode] = useState('signin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [activeSection, setActiveSection] = useState('blogs')

  const [articles, setArticles] = useState([])
  const [formations, setFormations] = useState([])
  const [events, setEvents] = useState([])
  const [partners, setPartners] = useState([])
  const [children, setChildren] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [tableStatus, setTableStatus] = useState({})
  const [loadingData, setLoadingData] = useState(false)

  const [articleForm, setArticleForm] = useState(initialArticle)
  const [formationForm, setFormationForm] = useState(initialFormation)
  const [eventForm, setEventForm] = useState(initialEvent)
  const [partnerForm, setPartnerForm] = useState(initialPartner)
  const [childForm, setChildForm] = useState(initialChild)
  const [volunteerForm, setVolunteerForm] = useState(initialVolunteer)
  const [actionMessage, setActionMessage] = useState('')
  const [articleImageFile, setArticleImageFile] = useState(null)
  const [eventImageFile, setEventImageFile] = useState(null)
  const [formationImageFile, setFormationImageFile] = useState(null)
  const [editingArticleId, setEditingArticleId] = useState(null)
  const [editingEventId, setEditingEventId] = useState(null)
  const [editingFormationId, setEditingFormationId] = useState(null)
  const [editingPartnerId, setEditingPartnerId] = useState(null)
  const [editingChildId, setEditingChildId] = useState(null)
  const [editingVolunteerId, setEditingVolunteerId] = useState(null)
  const [detailState, setDetailState] = useState({ section: '', item: null })

  const sections = [
    { key: 'blogs', label: 'Blogs', icon: BookText },
    { key: 'events', label: 'Evenements', icon: CalendarDays },
    { key: 'formations', label: 'Formations', icon: GraduationCap },
    { key: 'partners', label: 'Partenaires', icon: Handshake },
    { key: 'children', label: 'Enfants', icon: Baby },
    { key: 'volunteers', label: 'Benevoles', icon: Users },
  ]

  const loadTable = useCallback(async (tableName, setter) => {
    const { data, error } = await supabase.from(tableName).select('*').order('id', { ascending: false }).limit(30)
    if (error) {
      setter([])
      return { tableName, error: error.message }
    }
    setter(data || [])
    return { tableName, error: null }
  }, [])

  const loadAdminData = useCallback(async () => {
    setLoadingData(true)
    const results = await Promise.all([
      loadTable('articles', setArticles),
      loadTable('formations', setFormations),
      loadTable('evenements', setEvents),
      loadTable('partenaires', setPartners),
      loadTable('enfants', setChildren),
      loadTable('benevoles', setVolunteers),
    ])

    const nextStatus = {}
    results.forEach((result) => {
      if (result.error) {
        nextStatus[result.tableName] = result.error
      }
    })
    setTableStatus(nextStatus)
    setLoadingData(false)
  }, [loadTable])

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session || null)
      setLoadingSession(false)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const modeParam = searchParams.get('mode')
    if (modeParam === 'signup') {
      setAuthMode('signup')
      return
    }
    setAuthMode('signin')
  }, [searchParams])

  useEffect(() => {
    if (!session) return
    loadAdminData()
  }, [session, loadAdminData])

  useEffect(() => {
    setDetailState((prev) => {
      if (prev.section === activeSection) return prev
      return { section: '', item: null }
    })
  }, [activeSection])

  const refreshData = async () => {
    if (!session) return
    await loadAdminData()
  }

  const handleSelectDetails = (section, item) => {
    setDetailState((prev) => {
      if (prev.section === section && prev.item?.id === item.id) {
        return { section: '', item: null }
      }
      return { section, item }
    })
  }

  const handleDeleteRow = async (tableName, id, successMessage) => {
    const shouldDelete = window.confirm('Confirmer la suppression ?')
    if (!shouldDelete) return

    setActionMessage('Suppression en cours...')
    const { error } = await supabase.from(tableName).delete().eq('id', id)

    if (error) {
      setActionMessage(`Suppression impossible: ${error.message}`)
      return
    }

    if (detailState.item?.id === id) {
      setDetailState({ section: '', item: null })
    }

    await refreshData()
    setActionMessage(successMessage)
  }

  const uploadImageFile = async (file, folderName) => {
    if (!file) return null

    const extension = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'jpg'
    const filePath = `${folderName}/${Date.now()}-${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setActionMessage(`Upload image impossible: ${uploadError.message}`)
      return null
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)
    return data.publicUrl
  }

  const cancelArticleEdit = () => {
    setEditingArticleId(null)
    setArticleForm(initialArticle)
    setArticleImageFile(null)
  }

  const cancelEventEdit = () => {
    setEditingEventId(null)
    setEventForm(initialEvent)
    setEventImageFile(null)
  }

  const cancelFormationEdit = () => {
    setEditingFormationId(null)
    setFormationForm(initialFormation)
    setFormationImageFile(null)
  }

  const cancelPartnerEdit = () => {
    setEditingPartnerId(null)
    setPartnerForm(initialPartner)
  }

  const cancelChildEdit = () => {
    setEditingChildId(null)
    setChildForm(initialChild)
  }

  const cancelVolunteerEdit = () => {
    setEditingVolunteerId(null)
    setVolunteerForm(initialVolunteer)
  }

  const startArticleEdit = (item) => {
    setEditingArticleId(item.id)
    setArticleForm({
      titre: item.titre || '',
      contenu: item.contenu || '',
      image_url: item.image_url || '',
      langue: item.langue || 'FR',
    })
  }

  const startEventEdit = (item) => {
    setEditingEventId(item.id)
    setEventForm({
      titre: item.titre || '',
      description: item.description || '',
      image_url: item.image_url || '',
      lieu: item.lieu || '',
      pays: item.pays || 'France',
      date_debut: item.date_debut ? String(item.date_debut).slice(0, 16) : '',
    })
  }

  const startFormationEdit = (item) => {
    setEditingFormationId(item.id)
    setFormationForm({
      titre: item.titre || '',
      description: item.description || '',
      image_url: item.image_url || '',
      niveau: item.niveau || 'Debutant',
      pays_concerne: item.pays_concerne || 'France',
    })
  }

  const startPartnerEdit = (item) => {
    setEditingPartnerId(item.id)
    setPartnerForm({
      nom: item.nom || '',
      type: item.type || '',
      contact: item.contact || '',
      email: item.email || '',
    })
  }

  const startChildEdit = (item) => {
    setEditingChildId(item.id)
    setChildForm({
      nom: item.nom || '',
      age: String(item.age ?? ''),
      pays: item.pays || 'RDC',
      statut: item.statut || '',
    })
  }

  const startVolunteerEdit = (item) => {
    setEditingVolunteerId(item.id)
    setVolunteerForm({
      nom: item.nom || '',
      email: item.email || '',
      telephone: item.telephone || '',
      competences: item.competences || '',
    })
  }

  const handleSignIn = async (event) => {
    event.preventDefault()
    setAuthMessage('Connexion en cours...')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setAuthMessage('Echec de connexion. Verifie tes identifiants.')
      return
    }

    setAuthMessage('Connexion reussie.')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const handleSignUp = async (event) => {
    event.preventDefault()

    if (password.length < 6) {
      setAuthMessage('Le mot de passe doit contenir au moins 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setAuthMessage('Les mots de passe ne correspondent pas.')
      return
    }

    setAuthMessage('Creation du compte en cours...')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${ADMIN_PATH}?mode=signin`,
      },
    })

    if (error) {
      setAuthMessage(`Echec de creation de compte: ${error.message}`)
      return
    }

    setAuthMessage('Compte cree. Verifie ta boite mail si la confirmation est activee, puis connecte-toi.')
    setAuthMode('signin')
    setPassword('')
    setConfirmPassword('')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setActionMessage('Session fermee.')
  }

  const handleCreateArticle = async (event) => {
    event.preventDefault()
    setActionMessage(editingArticleId ? 'Mise a jour article...' : 'Enregistrement article...')

    const uploadedImageUrl = articleImageFile ? await uploadImageFile(articleImageFile, 'articles') : null
    if (articleImageFile && !uploadedImageUrl) return

    const payload = {
      ...articleForm,
      image_url: uploadedImageUrl || articleForm.image_url || null,
      date: new Date().toISOString(),
    }

    const { error } = editingArticleId
      ? await supabase.from('articles').update(payload).eq('id', editingArticleId)
      : await supabase.from('articles').insert(payload)

    if (error) {
      setActionMessage(`Impossible de creer l article: ${error.message}`)
      return
    }

    cancelArticleEdit()
    await refreshData()
    setActionMessage(editingArticleId ? 'Article mis a jour avec succes.' : 'Article cree avec succes.')
  }

  const handleCreateFormation = async (event) => {
    event.preventDefault()
    setActionMessage(editingFormationId ? 'Mise a jour formation...' : 'Enregistrement formation...')

    const uploadedImageUrl = formationImageFile ? await uploadImageFile(formationImageFile, 'formations') : null
    if (formationImageFile && !uploadedImageUrl) return

    const payload = {
      ...formationForm,
      image_url: uploadedImageUrl || formationForm.image_url || null,
    }

    const { error } = editingFormationId
      ? await supabase.from('formations').update(payload).eq('id', editingFormationId)
      : await supabase.from('formations').insert(payload)

    if (error) {
      setActionMessage(`Impossible de creer la formation: ${error.message}`)
      return
    }

    cancelFormationEdit()
    await refreshData()
    setActionMessage(editingFormationId ? 'Formation mise a jour avec succes.' : 'Formation creee avec succes.')
  }

  const handleCreateEvent = async (event) => {
    event.preventDefault()
    setActionMessage(editingEventId ? 'Mise a jour evenement...' : 'Enregistrement evenement...')

    const uploadedImageUrl = eventImageFile ? await uploadImageFile(eventImageFile, 'evenements') : null
    if (eventImageFile && !uploadedImageUrl) return

    const payload = {
      ...eventForm,
      image_url: uploadedImageUrl || eventForm.image_url || null,
    }

    const { error } = editingEventId
      ? await supabase.from('evenements').update(payload).eq('id', editingEventId)
      : await supabase.from('evenements').insert(payload)

    if (error) {
      setActionMessage(`Impossible de creer l evenement: ${error.message}`)
      return
    }

    cancelEventEdit()
    await refreshData()
    setActionMessage(editingEventId ? 'Evenement mis a jour avec succes.' : 'Evenement cree avec succes.')
  }

  const handleCreatePartner = async (event) => {
    event.preventDefault()
    setActionMessage(editingPartnerId ? 'Mise a jour partenaire...' : 'Enregistrement partenaire...')

    const { error } = editingPartnerId
      ? await supabase.from('partenaires').update(partnerForm).eq('id', editingPartnerId)
      : await supabase.from('partenaires').insert(partnerForm)

    if (error) {
      setActionMessage(`Impossible de creer le partenaire: ${error.message}`)
      return
    }

    cancelPartnerEdit()
    await refreshData()
    setActionMessage(editingPartnerId ? 'Partenaire mis a jour avec succes.' : 'Partenaire cree avec succes.')
  }

  const handleCreateChild = async (event) => {
    event.preventDefault()
    setActionMessage(editingChildId ? 'Mise a jour enfant...' : 'Enregistrement enfant...')

    const payload = {
      ...childForm,
      age: Number(childForm.age),
    }

    const { error } = editingChildId
      ? await supabase.from('enfants').update(payload).eq('id', editingChildId)
      : await supabase.from('enfants').insert(payload)

    if (error) {
      setActionMessage(`Impossible de creer l enfant: ${error.message}`)
      return
    }

    cancelChildEdit()
    await refreshData()
    setActionMessage(editingChildId ? 'Enfant mis a jour avec succes.' : 'Enfant ajoute avec succes.')
  }

  const handleCreateVolunteer = async (event) => {
    event.preventDefault()
    setActionMessage(editingVolunteerId ? 'Mise a jour benevole...' : 'Enregistrement benevole...')

    const { error } = editingVolunteerId
      ? await supabase.from('benevoles').update(volunteerForm).eq('id', editingVolunteerId)
      : await supabase.from('benevoles').insert(volunteerForm)

    if (error) {
      setActionMessage(`Impossible de creer le benevole: ${error.message}`)
      return
    }

    cancelVolunteerEdit()
    await refreshData()
    setActionMessage(editingVolunteerId ? 'Benevole mis a jour avec succes.' : 'Benevole ajoute avec succes.')
  }

  if (loadingSession) {
    return (
      <main className="container-custom py-16">
        <p className="text-sm text-slate-600">Chargement de la session admin...</p>
      </main>
    )
  }

  if (!session) {
    const isAuthError = /echec|impossible|ne correspondent|doit contenir/i.test(authMessage)

    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-50">
        <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

        <section className="container-custom relative py-14 sm:py-20">
          <div className="mx-auto max-w-lg rounded-3xl border border-primary-100/70 bg-white/90 p-6 shadow-xl shadow-primary-900/5 backdrop-blur md:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-500">Espace securise</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Administration</h1>
                <p className="mt-1 text-sm text-slate-600">Connecte-toi ou cree ton compte pour acceder au dashboard.</p>
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin')
                  setAuthMessage('')
                }}
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  authMode === 'signin'
                    ? 'bg-white text-primary-700 shadow-sm shadow-primary-900/10 ring-1 ring-primary-100'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup')
                  setAuthMessage('')
                }}
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  authMode === 'signup'
                    ? 'bg-white text-primary-700 shadow-sm shadow-primary-900/10 ring-1 ring-primary-100'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Creer un compte
              </button>
            </div>

            <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Adresse email</span>
                <div className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 ring-offset-2 transition focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
                  <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary-600" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="w-full bg-transparent px-2 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Mot de passe</span>
                <div className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 ring-offset-2 transition focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-primary-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="w-full bg-transparent px-2 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {authMode === 'signup' ? (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">Confirmer le mot de passe</span>
                  <div className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 ring-offset-2 transition focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-primary-600" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retapez votre mot de passe"
                      className="w-full bg-transparent px-2 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>
              ) : null}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-700/20 transition hover:-translate-y-0.5 hover:from-primary-700 hover:to-primary-800"
              >
                {authMode === 'signin' ? (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Se connecter
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Creer mon compte
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500">
                {authMode === 'signin'
                  ? 'Tu n as pas encore de compte ? Passe sur Creer un compte.'
                  : 'Utilise une adresse valide pour recevoir la confirmation si elle est activee.'}
              </p>
            </form>

            {authMessage ? (
              <div
                className={`mt-4 rounded-xl border px-3 py-2 text-xs ${
                  isAuthError
                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}
              >
                {authMessage}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    )
  }

  const isPopupSection = ['blogs', 'events', 'formations'].includes(detailState.section)
  const isDetailPopupOpen = Boolean(isPopupSection && detailState.item)
  const detailImageUrl = detailState.item?.image_url || ''

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <section className="container-custom py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Dashboard Admin</h1>
            <p className="text-sm text-slate-600">
              Gestion centralisee: evenements, blogs, formations, partenaires, enfants et benevoles.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-3 py-2 text-xs font-semibold text-primary-700"
          >
            <LogOut className="h-4 w-4" /> Deconnexion
          </button>
        </div>

        {actionMessage ? <p className="mb-4 text-xs text-slate-600">{actionMessage}</p> : null}

        {Object.keys(tableStatus).length > 0 ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Certaines tables ne sont pas encore accessibles: {Object.keys(tableStatus).join(', ')}.
          </div>
        ) : null}

        <div className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.key
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'border-primary-200 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary-100 hover:text-primary-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            )
          })}
        </div>

        {activeSection === 'blogs' ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <form
              onSubmit={handleCreateArticle}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5"
            >
              <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-primary-100/60 blur-2xl" />
              <div className="relative mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-500">Publication</p>
                  <h2 className="text-base font-extrabold text-slate-900">Gerer les blogs</h2>
                  <p className="mt-1 text-xs text-slate-500">Redige et publie un nouvel article.</p>
                </div>
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">Blog</span>
              </div>

              <div className="space-y-3">
                <input
                  required
                  value={articleForm.titre}
                  onChange={(e) => setArticleForm((p) => ({ ...p, titre: e.target.value }))}
                  placeholder="Titre"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-primary-300 focus:bg-white"
                />
                <textarea
                  required
                  value={articleForm.contenu}
                  onChange={(e) => setArticleForm((p) => ({ ...p, contenu: e.target.value }))}
                  placeholder="Contenu"
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-primary-300 focus:bg-white"
                />
                <input
                  value={articleForm.image_url}
                  onChange={(e) => setArticleForm((p) => ({ ...p, image_url: e.target.value }))}
                  placeholder="Image URL"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-primary-300 focus:bg-white"
                />
                <label className="block rounded-xl border border-dashed border-primary-200 bg-primary-50/40 px-3 py-2 text-xs text-primary-700">
                  Choisir une image depuis l appareil
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setArticleImageFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-xs"
                  />
                </label>
                <select
                  value={articleForm.langue}
                  onChange={(e) => setArticleForm((p) => ({ ...p, langue: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-primary-300 focus:bg-white"
                >
                  <option value="FR">FR</option>
                  <option value="EN">EN</option>
                </select>
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-primary-700/25 transition hover:-translate-y-0.5">
                    <PlusCircle className="h-4 w-4" /> {editingArticleId ? 'Mettre a jour le blog' : 'Ajouter le blog'}
                  </button>
                  {editingArticleId ? (
                    <button
                      type="button"
                      onClick={cancelArticleEdit}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600"
                    >
                      Annuler
                    </button>
                  ) : null}
                </div>
              </div>
            </form>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900">Blogs recents</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {articles.length} elements
                </span>
              </div>
              {loadingData ? (
                <p className="text-xs text-slate-500">Chargement...</p>
              ) : articles.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-500">
                  Aucun blog pour le moment.
                </p>
              ) : (
                <ul className="space-y-2 text-xs text-slate-700">
                  {articles.slice(0, 12).map((item) => (
                    <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                      <p className="font-semibold text-slate-800">{item.titre}</p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">{item.langue || 'FR'}</p>
                      {item.image_url ? (
                        <p className="mt-1 text-[11px] font-semibold text-primary-600">Photo disponible</p>
                      ) : null}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectDetails('blogs', item)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => startArticleEdit(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-primary-200 bg-primary-50 px-2 py-1 text-[11px] font-semibold text-primary-700"
                        >
                          <Pencil className="h-3 w-3" /> Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow('articles', item.id, 'Blog supprime avec succes.')}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700"
                        >
                          <Trash2 className="h-3 w-3" /> Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

            </div>
          </div>
        ) : null}

        {activeSection === 'events' ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <form
              onSubmit={handleCreateEvent}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5"
            >
              <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-100/70 blur-2xl" />
              <div className="relative mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Planification</p>
                  <h2 className="text-base font-extrabold text-slate-900">Gerer les evenements</h2>
                  <p className="mt-1 text-xs text-slate-500">Ajoute un nouvel evenement du calendrier.</p>
                </div>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">Event</span>
              </div>

              <div className="space-y-3">
                <input
                  required
                  value={eventForm.titre}
                  onChange={(e) => setEventForm((p) => ({ ...p, titre: e.target.value }))}
                  placeholder="Titre"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:bg-white"
                />
                <textarea
                  required
                  value={eventForm.description}
                  onChange={(e) => setEventForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Description"
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:bg-white"
                />
                <input
                  value={eventForm.image_url}
                  onChange={(e) => setEventForm((p) => ({ ...p, image_url: e.target.value }))}
                  placeholder="Image URL"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:bg-white"
                />
                <label className="block rounded-xl border border-dashed border-sky-200 bg-sky-50/40 px-3 py-2 text-xs text-sky-700">
                  Choisir une image depuis l appareil
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEventImageFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-xs"
                  />
                </label>
                <input
                  required
                  value={eventForm.lieu}
                  onChange={(e) => setEventForm((p) => ({ ...p, lieu: e.target.value }))}
                  placeholder="Lieu"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:bg-white"
                />
                <input
                  required
                  value={eventForm.pays}
                  onChange={(e) => setEventForm((p) => ({ ...p, pays: e.target.value }))}
                  placeholder="Pays"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:bg-white"
                />
                <input
                  required
                  type="datetime-local"
                  value={eventForm.date_debut}
                  onChange={(e) => setEventForm((p) => ({ ...p, date_debut: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:bg-white"
                />
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-sky-700/25 transition hover:-translate-y-0.5">
                    <PlusCircle className="h-4 w-4" /> {editingEventId ? 'Mettre a jour l evenement' : 'Ajouter l evenement'}
                  </button>
                  {editingEventId ? (
                    <button
                      type="button"
                      onClick={cancelEventEdit}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600"
                    >
                      Annuler
                    </button>
                  ) : null}
                </div>
              </div>
            </form>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900">Evenements recents</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {events.length} elements
                </span>
              </div>
              {loadingData ? (
                <p className="text-xs text-slate-500">Chargement...</p>
              ) : events.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-500">
                  Aucun evenement pour le moment.
                </p>
              ) : (
                <ul className="space-y-2 text-xs text-slate-700">
                  {events.slice(0, 12).map((item) => (
                    <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                      <p className="font-semibold text-slate-800">{item.titre}</p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">{item.pays || 'N/A'}</p>
                      {item.image_url ? <p className="mt-1 text-[11px] font-semibold text-sky-600">Photo disponible</p> : null}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectDetails('events', item)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => startEventEdit(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-primary-200 bg-primary-50 px-2 py-1 text-[11px] font-semibold text-primary-700"
                        >
                          <Pencil className="h-3 w-3" /> Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow('evenements', item.id, 'Evenement supprime avec succes.')}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700"
                        >
                          <Trash2 className="h-3 w-3" /> Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

            </div>
          </div>
        ) : null}

        {activeSection === 'formations' ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <form
              onSubmit={handleCreateFormation}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5"
            >
              <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-100/70 blur-2xl" />
              <div className="relative mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600">Apprentissage</p>
                  <h2 className="text-base font-extrabold text-slate-900">Gerer les formations</h2>
                  <p className="mt-1 text-xs text-slate-500">Cree et organise les parcours de formation.</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Formation</span>
              </div>

              <div className="space-y-3">
                <input
                  required
                  value={formationForm.titre}
                  onChange={(e) => setFormationForm((p) => ({ ...p, titre: e.target.value }))}
                  placeholder="Titre"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                />
                <textarea
                  required
                  value={formationForm.description}
                  onChange={(e) => setFormationForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Description"
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                />
                <input
                  value={formationForm.image_url}
                  onChange={(e) => setFormationForm((p) => ({ ...p, image_url: e.target.value }))}
                  placeholder="Image URL"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                />
                <label className="block rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 px-3 py-2 text-xs text-emerald-700">
                  Choisir une image depuis l appareil
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormationImageFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-xs"
                  />
                </label>
                <input
                  required
                  value={formationForm.niveau}
                  onChange={(e) => setFormationForm((p) => ({ ...p, niveau: e.target.value }))}
                  placeholder="Niveau"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                />
                <input
                  required
                  value={formationForm.pays_concerne}
                  onChange={(e) => setFormationForm((p) => ({ ...p, pays_concerne: e.target.value }))}
                  placeholder="Pays concerne"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                />
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-700/25 transition hover:-translate-y-0.5">
                    <PlusCircle className="h-4 w-4" />{' '}
                    {editingFormationId ? 'Mettre a jour la formation' : 'Ajouter la formation'}
                  </button>
                  {editingFormationId ? (
                    <button
                      type="button"
                      onClick={cancelFormationEdit}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600"
                    >
                      Annuler
                    </button>
                  ) : null}
                </div>
              </div>
            </form>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900">Formations recentes</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {formations.length} elements
                </span>
              </div>
              {loadingData ? (
                <p className="text-xs text-slate-500">Chargement...</p>
              ) : formations.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-500">
                  Aucune formation pour le moment.
                </p>
              ) : (
                <ul className="space-y-2 text-xs text-slate-700">
                  {formations.slice(0, 12).map((item) => (
                    <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                      <p className="font-semibold text-slate-800">{item.titre}</p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">
                        {item.niveau || 'N/A'} • {item.pays_concerne || 'N/A'}
                      </p>
                      {item.image_url ? (
                        <p className="mt-1 text-[11px] font-semibold text-emerald-600">Photo disponible</p>
                      ) : null}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectDetails('formations', item)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => startFormationEdit(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-primary-200 bg-primary-50 px-2 py-1 text-[11px] font-semibold text-primary-700"
                        >
                          <Pencil className="h-3 w-3" /> Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow('formations', item.id, 'Formation supprimee avec succes.')}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700"
                        >
                          <Trash2 className="h-3 w-3" /> Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

            </div>
          </div>
        ) : null}

        {activeSection === 'partners' ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <form onSubmit={handleCreatePartner} className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-bold text-gray-900">Gerer les partenaires</h2>
              <div className="space-y-2">
                <input
                  required
                  value={partnerForm.nom}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, nom: e.target.value }))}
                  placeholder="Nom"
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <input
                  value={partnerForm.type}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, type: e.target.value }))}
                  placeholder="Type"
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <input
                  value={partnerForm.contact}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, contact: e.target.value }))}
                  placeholder="Contact"
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  value={partnerForm.email}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Email"
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white">
                    <PlusCircle className="h-4 w-4" />{' '}
                    {editingPartnerId ? 'Mettre a jour le partenaire' : 'Ajouter le partenaire'}
                  </button>
                  {editingPartnerId ? (
                    <button
                      type="button"
                      onClick={cancelPartnerEdit}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      Annuler
                    </button>
                  ) : null}
                </div>
              </div>
            </form>

            <div className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-gray-900">Partenaires recents</h3>
              {loadingData ? (
                <p className="text-xs text-slate-500">Chargement...</p>
              ) : (
                <ul className="space-y-2 text-xs text-slate-700">
                  {partners.slice(0, 12).map((item) => (
                    <li key={item.id} className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="font-semibold">{item.nom}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectDetails('partners', item)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => startPartnerEdit(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-primary-200 bg-primary-50 px-2 py-1 text-[11px] font-semibold text-primary-700"
                        >
                          <Pencil className="h-3 w-3" /> Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow('partenaires', item.id, 'Partenaire supprime avec succes.')}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700"
                        >
                          <Trash2 className="h-3 w-3" /> Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {detailState.section === 'partners' && detailState.item ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">Details du partenaire</p>
                  <p className="mt-1"><span className="font-semibold">Nom:</span> {detailState.item.nom}</p>
                  <p><span className="font-semibold">Type:</span> {detailState.item.type || 'N/A'}</p>
                  <p><span className="font-semibold">Contact:</span> {detailState.item.contact || 'N/A'}</p>
                  <p><span className="font-semibold">Email:</span> {detailState.item.email || 'N/A'}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {activeSection === 'children' ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <form onSubmit={handleCreateChild} className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-bold text-gray-900">Gerer les enfants</h2>
              <div className="space-y-2">
                <input
                  required
                  value={childForm.nom}
                  onChange={(e) => setChildForm((p) => ({ ...p, nom: e.target.value }))}
                  placeholder="Nom"
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <input
                  required
                  type="number"
                  min="0"
                  value={childForm.age}
                  onChange={(e) => setChildForm((p) => ({ ...p, age: e.target.value }))}
                  placeholder="Age"
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <input
                  required
                  value={childForm.pays}
                  onChange={(e) => setChildForm((p) => ({ ...p, pays: e.target.value }))}
                  placeholder="Pays"
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <input
                  value={childForm.statut}
                  onChange={(e) => setChildForm((p) => ({ ...p, statut: e.target.value }))}
                  placeholder="Statut"
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white">
                    <PlusCircle className="h-4 w-4" /> {editingChildId ? 'Mettre a jour l enfant' : 'Ajouter l enfant'}
                  </button>
                  {editingChildId ? (
                    <button
                      type="button"
                      onClick={cancelChildEdit}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      Annuler
                    </button>
                  ) : null}
                </div>
              </div>
            </form>

            <div className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-gray-900">Enfants recents</h3>
              {loadingData ? (
                <p className="text-xs text-slate-500">Chargement...</p>
              ) : (
                <ul className="space-y-2 text-xs text-slate-700">
                  {children.slice(0, 12).map((item) => (
                    <li key={item.id} className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="font-semibold">
                        {item.nom} - {item.pays || 'N/A'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectDetails('children', item)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => startChildEdit(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-primary-200 bg-primary-50 px-2 py-1 text-[11px] font-semibold text-primary-700"
                        >
                          <Pencil className="h-3 w-3" /> Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow('enfants', item.id, 'Enfant supprime avec succes.')}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700"
                        >
                          <Trash2 className="h-3 w-3" /> Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {detailState.section === 'children' && detailState.item ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">Details enfant</p>
                  <p className="mt-1"><span className="font-semibold">Nom:</span> {detailState.item.nom}</p>
                  <p><span className="font-semibold">Age:</span> {detailState.item.age ?? 'N/A'}</p>
                  <p><span className="font-semibold">Pays:</span> {detailState.item.pays || 'N/A'}</p>
                  <p><span className="font-semibold">Statut:</span> {detailState.item.statut || 'N/A'}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {activeSection === 'volunteers' ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <form onSubmit={handleCreateVolunteer} className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-bold text-gray-900">Gerer les benevoles</h2>
              <div className="space-y-2">
                <input
                  required
                  value={volunteerForm.nom}
                  onChange={(e) => setVolunteerForm((p) => ({ ...p, nom: e.target.value }))}
                  placeholder="Nom"
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  required
                  value={volunteerForm.email}
                  onChange={(e) => setVolunteerForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Email"
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <input
                  value={volunteerForm.telephone}
                  onChange={(e) => setVolunteerForm((p) => ({ ...p, telephone: e.target.value }))}
                  placeholder="Telephone"
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <textarea
                  value={volunteerForm.competences}
                  onChange={(e) => setVolunteerForm((p) => ({ ...p, competences: e.target.value }))}
                  placeholder="Competences"
                  rows={4}
                  className="w-full rounded-lg border border-primary-100 px-3 py-2 text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white">
                    <PlusCircle className="h-4 w-4" />{' '}
                    {editingVolunteerId ? 'Mettre a jour le benevole' : 'Ajouter le benevole'}
                  </button>
                  {editingVolunteerId ? (
                    <button
                      type="button"
                      onClick={cancelVolunteerEdit}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      Annuler
                    </button>
                  ) : null}
                </div>
              </div>
            </form>

            <div className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-gray-900">Benevoles recents</h3>
              {loadingData ? (
                <p className="text-xs text-slate-500">Chargement...</p>
              ) : (
                <ul className="space-y-2 text-xs text-slate-700">
                  {volunteers.slice(0, 12).map((item) => (
                    <li key={item.id} className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="font-semibold">
                        {item.nom} - {item.email || 'N/A'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectDetails('volunteers', item)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => startVolunteerEdit(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-primary-200 bg-primary-50 px-2 py-1 text-[11px] font-semibold text-primary-700"
                        >
                          <Pencil className="h-3 w-3" /> Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow('benevoles', item.id, 'Benevole supprime avec succes.')}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700"
                        >
                          <Trash2 className="h-3 w-3" /> Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {detailState.section === 'volunteers' && detailState.item ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">Details benevole</p>
                  <p className="mt-1"><span className="font-semibold">Nom:</span> {detailState.item.nom}</p>
                  <p><span className="font-semibold">Email:</span> {detailState.item.email || 'N/A'}</p>
                  <p><span className="font-semibold">Telephone:</span> {detailState.item.telephone || 'N/A'}</p>
                  <p className="mt-1 whitespace-pre-wrap">{detailState.item.competences || 'Aucune competence renseignee'}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {isDetailPopupOpen ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/70 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-slate-900">
                  {detailState.section === 'blogs'
                    ? 'Details du blog'
                    : detailState.section === 'events'
                    ? 'Details de l evenement'
                    : 'Details de la formation'}
                </h3>
                <button
                  type="button"
                  onClick={() => setDetailState({ section: '', item: null })}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  Fermer
                </button>
              </div>

              {detailImageUrl ? (
                <img
                  src={detailImageUrl}
                  alt={detailState.item?.titre || 'Detail'}
                  className="mb-3 h-56 w-full rounded-xl object-cover"
                />
              ) : null}

              <div className="space-y-1 text-xs text-slate-700">
                <p>
                  <span className="font-semibold">Titre:</span> {detailState.item?.titre || 'N/A'}
                </p>
                {detailState.section === 'blogs' ? (
                  <p>
                    <span className="font-semibold">Langue:</span> {detailState.item?.langue || 'FR'}
                  </p>
                ) : null}
                {detailState.section === 'events' ? (
                  <>
                    <p>
                      <span className="font-semibold">Lieu:</span> {detailState.item?.lieu || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold">Pays:</span> {detailState.item?.pays || 'N/A'}
                    </p>
                  </>
                ) : null}
                {detailState.section === 'formations' ? (
                  <>
                    <p>
                      <span className="font-semibold">Niveau:</span> {detailState.item?.niveau || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold">Pays:</span> {detailState.item?.pays_concerne || 'N/A'}
                    </p>
                  </>
                ) : null}
                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-slate-700">
                  {detailState.item?.contenu || detailState.item?.description || 'Aucune description'}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}
