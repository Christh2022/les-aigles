# La Famille Les Aigles - Plateforme Internationale

🦅 Plateforme web internationale pour l'association d'aide sociale "La Famille Les Aigles"

## 📋 Vue d'ensemble

Association d'aide sociale internationale œuvrant de la France (siège à Melun) au Congo (opérations à Kinshasa) avec pour missions principales :
- 🏠 Gestion d'un orphelinat au Congo
- 📚 Direction d'une école primaire au Congo
- 🎓 Programmes de formation et d'insertion des jeunes en France et au Congo

**SIREN:** 939 491 122

## 🛠️ Stack Technique

### Frontend
- **React 18** avec Vite
- **React Router Dom** pour la navigation
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes

### Backend
- **Supabase** (PostgreSQL, Auth, Storage)

### Couleurs du Thème
- **Primary (Bleu Institutionnel):** `#2563eb` (primary-600)
- **Gold (Or):** `#f59e0b` (gold-500)
- **Blanc:** Base

## 📁 Structure du Projet

```
les-aigles-platform/
├── public/
├── src/
│   ├── assets/           # Images, logos, etc.
│   ├── components/       # Composants réutilisables
│   │   ├── Header.jsx    # ✅ Header avec sélecteur langue + bouton don
│   │   └── Footer.jsx    # ✅ Footer avec section transparence
│   ├── pages/            # Pages de l'application
│   │   ├── Home.jsx      # ✅ Page d'accueil complète
│   │   └── Events.jsx    # ✅ Page événements avec filtres
│   ├── lib/
│   │   └── supabaseClient.js  # ✅ Configuration Supabase
│   ├── App.jsx           # ✅ Composant principal avec routing
│   ├── main.jsx          # ✅ Point d'entrée
│   └── index.css         # ✅ Styles globaux avec Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ et npm/yarn
- Compte Supabase (gratuit)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/Christh2022/les-aigles.git
cd les-aigles
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

Puis éditez `.env.local` avec vos clés Supabase :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

4. **Configurer la base de données Supabase** (voir section suivante)

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## 🗄️ Configuration Base de Données Supabase

### Schéma SQL à exécuter dans Supabase SQL Editor

```sql
-- Table: articles (Blog & Actualités)
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  image_url TEXT,
  langue VARCHAR(2) DEFAULT 'FR' CHECK (langue IN ('FR', 'EN')),
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances de recherche
CREATE INDEX idx_articles_langue ON articles(langue);
CREATE INDEX idx_articles_date ON articles(date DESC);

-- Table: formations (Programmes de formation)
CREATE TABLE formations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  niveau VARCHAR(50) NOT NULL,
  pays_concerne VARCHAR(50) NOT NULL CHECK (pays_concerne IN ('France', 'Congo')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour filtrer par pays
CREATE INDEX idx_formations_pays ON formations(pays_concerne);

-- Table: evenements (Événements France & Congo)
CREATE TABLE evenements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  date_debut TIMESTAMPTZ NOT NULL,
  lieu TEXT NOT NULL,
  pays VARCHAR(50) NOT NULL CHECK (pays IN ('France', 'Congo')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour filtrer par pays et trier par date
CREATE INDEX idx_evenements_pays ON evenements(pays);
CREATE INDEX idx_evenements_date ON evenements(date_debut DESC);

-- Table: dons (Système de dons multi-projets)
CREATE TABLE dons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  montant DECIMAL(10, 2) NOT NULL CHECK (montant > 0),
  donateur TEXT,
  email TEXT,
  projet_cible VARCHAR(50) NOT NULL CHECK (projet_cible IN ('General', 'Congo_Orphelinat', 'Congo_Ecole', 'France_Formations')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour statistiques
CREATE INDEX idx_dons_projet ON dons(projet_cible);
CREATE INDEX idx_dons_date ON dons(created_at DESC);

-- Activer Row Level Security (RLS)
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

-- Pour l'admin, vous devrez configurer l'authentification Supabase
-- et créer des politiques spécifiques pour les opérations CREATE/UPDATE/DELETE

-- Storage: Créer un bucket pour les images (à faire via l'interface Supabase)
-- Nom du bucket: 'images'
-- Politique: Public read access
```

### Configuration du Storage

1. Dans le dashboard Supabase, allez dans **Storage**
2. Créez un nouveau bucket nommé `images`
3. Rendez-le public avec cette politique :
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );
```

## 🎨 Fonctionnalités Implémentées

### ✅ Header International
- Logo et nom de l'association
- Navigation responsive (desktop/mobile)
- **Sélecteur de langue FR/EN** (structure prête pour i18n)
- **Bouton "Faire un Don" très visible** avec animation pulse

### ✅ Page d'Accueil (Home.jsx)

#### 1. Hero Section - Vision Globale
- Titre accrocheur : "De la France au Congo, et demain vers le monde"
- Design moderne avec gradient et effets visuels
- Call-to-action vers les dons et missions

#### 2. Carte Interactive - Deux Pôles d'Activité
- **Pôle France (Melun)** : Coordination, formations, collecte de fonds
- **Pôle Congo (Kinshasa)** : Opérations terrain, orphelinat, école
- Badges et icônes distinctifs par pays

#### 3. Nos Missions - Focus Orphelinat & École
- **Orphelinat** : Capacité, âges, personnel
- **École Primaire** : Élèves, classes, enseignants
- Design avec cartes visuelles et informations clés

#### 4. Espace Formations & Jeunes
- Grille filtrable par pays (France/Congo/Tous)
- Affichage dynamique depuis Supabase
- Badges de localisation
- Skeleton loading pendant le chargement

#### 5. Blog & Événements
- Aperçu des derniers articles
- Aperçu des événements à venir
- Badges de localisation ([Melun, France] / [Kinshasa, Congo])

#### 6. Call-to-Action Donation
- Section impactante avec fond doré
- Lien vers page de don

### ✅ Page Événements (Events.jsx)
- Liste complète des événements
- **Filtres par pays** (France/Congo/Tous)
- **Badges de localisation** sur chaque carte
- Distinction événements à venir / passés
- Design responsive avec cartes modernes
- Statistiques en bas de page
- Section CTA pour organiser un événement

### ✅ Footer avec Transparence & Gouvernance
- Informations de contact (France & Congo)
- Réseaux sociaux
- **Section dédiée "Transparence & Gouvernance"**
- Affichage du SIREN : 939 491 122
- Liens vers mentions légales et politique de confidentialité

## 🌍 Fonctionnalités Internationales

### Gestion du Temps (TIMESTAMPTZ)
- Toutes les dates utilisent `TIMESTAMPTZ` dans Supabase
- Affichage correct pour Paris et Brazzaville
- Format français par défaut

### Mobile-Responsive
- Design optimisé pour smartphone (crucial pour le Congo)
- Navigation mobile hamburger
- Grilles adaptatives
- Performance optimisée

### Système de Don Multi-Projets
Les donateurs peuvent choisir :
- **General** : Fonctionnement global de l'association
- **Congo_Orphelinat** : Spécifiquement pour l'orphelinat
- **Congo_Ecole** : Spécifiquement pour l'école
- **France_Formations** : Programmes de formation en France

## 📱 Design Mobile-First

Le site est conçu pour être performant sur mobile :
- Tailwind CSS responsive breakpoints
- Navigation hamburger mobile
- Images optimisées
- Chargement progressif avec skeletons
- Possibilité future d'ajouter un cache pour connexions instables

## 🔐 Sécurité et Authentification

### Pour l'Admin Dashboard
Vous devrez configurer :

1. **Supabase Auth** pour l'authentification admin
2. **Row Level Security (RLS)** pour protéger les opérations d'écriture
3. **Politiques personnalisées** pour les rôles admin

Exemple de politique admin :
```sql
CREATE POLICY "Admin full access"
ON articles
USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');
```

## 🚧 Pages à Développer (Structure prête)

Les routes suivantes sont créées et affichent "En construction" :
- `/missions` - Détails des missions
- `/formations` - Liste complète des formations
- `/blog` - Blog complet
- `/contact` - Formulaire de contact
- `/don` - **Page de don avec choix de projet**
- `/admin` - Dashboard admin sécurisé

## 📊 Données Exemple pour Tests

### Insérer des données de test dans Supabase :

```sql
-- Articles
INSERT INTO articles (titre, contenu, langue) VALUES
('Bienvenue à La Famille Les Aigles', 'Notre association œuvre pour l''éducation et l''insertion des jeunes...', 'FR'),
('Nouvelle école inaugurée au Congo', 'Une grande étape franchie avec l''ouverture de notre école...', 'FR');

-- Formations
INSERT INTO formations (titre, description, niveau, pays_concerne) VALUES
('Formation Numérique pour Jeunes', 'Initiation aux outils informatiques et à la programmation', 'Débutant', 'France'),
('Alphabétisation et Soutien Scolaire', 'Programme d''aide aux devoirs et d''alphabétisation', 'Débutant', 'Congo');

-- Événements
INSERT INTO evenements (titre, date_debut, lieu, pays, description) VALUES
('Collecte de Fonds Annuelle', '2026-04-15 14:00:00+00', 'Melun', 'France', 'Grande collecte de fonds pour soutenir nos projets au Congo'),
('Fête de l''École', '2026-05-20 10:00:00+00', 'Kinshasa', 'Congo', 'Célébration de fin d''année scolaire avec les élèves et leurs familles');
```

## 🎯 Prochaines Étapes Recommandées

1. **Internationalisation (i18n)**
   - Installer `react-i18next`
   - Créer les fichiers de traduction FR/EN
   - Implémenter le changement de langue

2. **Système de Don Complet**
   - Intégration Stripe ou PayPal
   - Page de don avec formulaire
   - Reçus fiscaux automatiques

3. **Dashboard Admin**
   - Authentification Supabase
   - CRUD pour articles, formations, événements
   - Upload d'images
   - Statistiques de dons

4. **Optimisations Performance**
   - Lazy loading des images
   - Service Worker pour cache offline
   - Optimisation bundle size

5. **SEO & Analytics**
   - Meta tags dynamiques
   - Google Analytics
   - Sitemap.xml

## 📞 Support

Pour toute question technique :
- Email technique : dev@les-aigles.org
- Issues GitHub : [github.com/Christh2022/les-aigles/issues](https://github.com/Christh2022/les-aigles/issues)

---

**Développé avec ❤️ pour La Famille Les Aigles**

*De la France au Congo, et demain vers le monde* 🦅🌍
