import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
// IMPORTANT: Remplacez ces valeurs par vos vraies clés Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions pour les opérations courantes

/**
 * Récupère les articles avec filtrage optionnel par langue
 * @param {string} langue - Code de langue (FR/EN)
 */
export const getArticles = async (langue = null) => {
  let query = supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false })

  if (langue) {
    query = query.eq('langue', langue)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

/**
 * Recupere un article par son id
 * @param {string} id - Identifiant de l'article
 */
export const getArticleById = async (id) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Récupère les formations avec filtrage optionnel par pays
 * @param {string} pays - Pays concerné
 */
export const getFormations = async (pays = null) => {
  let query = supabase
    .from('formations')
    .select('*')
    .order('id', { ascending: false })

  if (pays) {
    query = query.eq('pays_concerne', pays)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

/**
 * Recupere une formation par son id
 * @param {string} id - Identifiant de la formation
 */
export const getFormationById = async (id) => {
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Récupère les événements avec filtrage optionnel par pays
 * @param {string} pays - Pays de l'événement
 */
export const getEvenements = async (pays = null) => {
  let query = supabase
    .from('evenements')
    .select('*')
    .order('date_debut', { ascending: false })

  if (pays) {
    query = query.eq('pays', pays)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

/**
 * Crée un nouveau don
 * @param {Object} donData - Données du don
 */
export const createDon = async (donData) => {
  const { data, error } = await supabase
    .from('dons')
    .insert([donData])
    .select()

  if (error) throw error
  return data
}

/**
 * Enregistre une inscription a une formation
 * @param {Object} inscriptionData - Donnees d'inscription
 */
export const createFormationInscription = async (inscriptionData) => {
  const { data, error } = await supabase
    .from('inscriptions_formations')
    .insert([inscriptionData])
    .select()

  if (error) throw error
  return data
}

/**
 * Upload une image vers Supabase Storage
 * @param {File} file - Fichier à uploader
 * @param {string} bucket - Nom du bucket
 */
export const uploadImage = async (file, bucket = 'images') => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}
