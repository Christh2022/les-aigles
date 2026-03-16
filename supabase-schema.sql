-- ============================================
-- Supabase Database Schema
-- La Famille Les Aigles - Plateforme Internationale
-- ============================================

-- Table: articles (Blog & Actualités)
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  image_url TEXT,
  langue VARCHAR(2) DEFAULT 'FR' CHECK (langue IN ('FR', 'EN')),
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_articles_langue ON articles(langue);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date DESC);

-- Table: formations (Programmes de formation)
CREATE TABLE IF NOT EXISTS formations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  niveau VARCHAR(50) NOT NULL,
  pays_concerne VARCHAR(50) NOT NULL CHECK (pays_concerne IN ('France', 'Congo')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour filtrer par pays
CREATE INDEX IF NOT EXISTS idx_formations_pays ON formations(pays_concerne);

-- Table: evenements (Événements France & Congo)
CREATE TABLE IF NOT EXISTS evenements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  date_debut TIMESTAMPTZ NOT NULL,
  lieu TEXT NOT NULL,
  pays VARCHAR(50) NOT NULL CHECK (pays IN ('France', 'Congo')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour filtrer par pays et trier par date
CREATE INDEX IF NOT EXISTS idx_evenements_pays ON evenements(pays);
CREATE INDEX IF NOT EXISTS idx_evenements_date ON evenements(date_debut DESC);

-- Table: dons (Système de dons multi-projets)
CREATE TABLE IF NOT EXISTS dons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  montant DECIMAL(10, 2) NOT NULL CHECK (montant > 0),
  donateur TEXT,
  email TEXT,
  projet_cible VARCHAR(50) NOT NULL CHECK (projet_cible IN ('General', 'Congo_Orphelinat', 'Congo_Ecole', 'France_Formations')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour statistiques
CREATE INDEX IF NOT EXISTS idx_dons_projet ON dons(projet_cible);
CREATE INDEX IF NOT EXISTS idx_dons_date ON dons(created_at DESC);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Activer Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evenements ENABLE ROW LEVEL SECURITY;
ALTER TABLE dons ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique (tout le monde peut lire)
CREATE POLICY "Public read access articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read access formations" ON formations FOR SELECT USING (true);
CREATE POLICY "Public read access evenements" ON evenements FOR SELECT USING (true);

-- Politique d'insertion publique pour les dons (anonyme possible)
CREATE POLICY "Public insert dons" ON dons FOR INSERT WITH CHECK (true);

-- ============================================
-- Données de test
-- ============================================

-- Articles
INSERT INTO articles (titre, contenu, langue) VALUES
('Bienvenue à La Famille Les Aigles', 'Notre association œuvre pour l''éducation et l''insertion des jeunes en France et au Congo. Depuis notre siège à Melun, nous coordonnons des actions de formation et de sensibilisation, tandis qu''au Congo, nous gérons un orphelinat et une école primaire.', 'FR'),
('Nouvelle école inaugurée au Congo', 'Une grande étape franchie avec l''ouverture de notre école primaire à Kinshasa. L''établissement accueille déjà 120 élèves du CP au CM2, avec 6 professeurs qualifiés. Un projet rendu possible grâce à vos dons généreux.', 'FR'),
('Welcome to La Famille Les Aigles', 'Our association works for the education and integration of young people in France and Congo. From our headquarters in Melun, we coordinate training and awareness actions, while in Congo, we manage an orphanage and a primary school.', 'EN');

-- Formations
INSERT INTO formations (titre, description, niveau, pays_concerne) VALUES
('Formation Numérique pour Jeunes', 'Initiation aux outils informatiques et à la programmation. Programme de 3 mois incluant Word, Excel, bases de la programmation web.', 'Débutant', 'France'),
('Alphabétisation et Soutien Scolaire', 'Programme d''aide aux devoirs et d''alphabétisation pour enfants et adultes. Sessions quotidiennes avec suivi personnalisé.', 'Débutant', 'Congo'),
('Alphabétisation et Soutien Scolaire', 'Programme d''aide aux devoirs et d''alphabétisation pour enfants et adultes. Sessions hebdomadaires de soutien scolaire en France avec suivi personnalisé.', 'Débutant', 'France'),
('Formation Entrepreneuriat Social', 'Accompagnement des jeunes entrepreneurs dans le développement de projets à impact social. Mentorat et formation business.', 'Intermédiaire', 'France'),
('Couture et Artisanat', 'Formation professionnelle en couture et artisanat traditionnel congolais. Certification à la fin du programme.', 'Débutant', 'Congo');

-- Événements
INSERT INTO evenements (titre, date_debut, lieu, pays, description) VALUES
('Collecte de Fonds Annuelle', '2026-04-15 14:00:00+00', 'Melun', 'France', 'Grande collecte de fonds pour soutenir nos projets au Congo. Tombola, vente de pâtisseries, et témoignages de bénéficiaires.'),
('Fête de l''École', '2026-05-20 10:00:00+00', 'Kinshasa', 'Congo', 'Célébration de fin d''année scolaire avec les élèves et leurs familles. Spectacles, remises de prix, et repas partagé.'),
('Conférence: Éducation en Afrique', '2026-06-10 18:30:00+00', 'Melun', 'France', 'Conférence-débat sur les enjeux de l''éducation en Afrique subsaharienne avec des experts et témoignages terrain.'),
('Journée Portes Ouvertes Orphelinat', '2026-07-05 09:00:00+00', 'Kinshasa', 'Congo', 'Découvrez notre orphelinat et rencontrez les enfants. Visite guidée, ateliers ludiques, et présentation des projets futurs.');

-- ============================================
-- Storage Configuration (à faire via l'interface Supabase)
-- ============================================

/*
1. Créer un bucket 'images' dans Storage
2. Le rendre public avec cette politique:

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );
*/

-- ============================================
-- Vues utiles pour les statistiques
-- ============================================

-- Vue: Statistiques des dons par projet
CREATE OR REPLACE VIEW stats_dons_par_projet AS
SELECT
  projet_cible,
  COUNT(*) as nombre_dons,
  SUM(montant) as montant_total,
  AVG(montant) as montant_moyen
FROM dons
GROUP BY projet_cible;

-- Vue: Événements à venir
CREATE OR REPLACE VIEW evenements_a_venir AS
SELECT *
FROM evenements
WHERE date_debut >= NOW()
ORDER BY date_debut ASC;

-- Vue: Articles récents
CREATE OR REPLACE VIEW articles_recents AS
SELECT *
FROM articles
ORDER BY date DESC
LIMIT 10;
