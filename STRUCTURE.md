# Structure du Projet - La Famille Les Aigles

## 📂 Architecture des Dossiers

```
les-aigles/
│
├── 📄 Configuration Root
│   ├── .eslintrc.cjs              # Configuration ESLint
│   ├── .gitignore                 # Fichiers ignorés par Git
│   ├── .env.example               # Template variables d'environnement
│   ├── index.html                 # Point d'entrée HTML
│   ├── package.json               # Dépendances et scripts
│   ├── postcss.config.js          # Configuration PostCSS pour Tailwind
│   ├── tailwind.config.js         # Configuration Tailwind CSS
│   ├── vite.config.js             # Configuration Vite
│   ├── supabase-schema.sql        # Schéma complet de la base de données
│   └── README.md                  # Documentation principale
│
├── 📁 src/
│   ├── 📄 main.jsx                # Point d'entrée React
│   ├── 📄 App.jsx                 # Composant principal avec Router
│   ├── 📄 index.css               # Styles globaux + Tailwind
│   │
│   ├── 📁 components/             # Composants réutilisables
│   │   ├── Header.jsx             # ✅ Header international avec langue & don
│   │   └── Footer.jsx             # ✅ Footer avec transparence
│   │
│   ├── 📁 pages/                  # Pages de l'application
│   │   ├── Home.jsx               # ✅ Page d'accueil complète
│   │   └── Events.jsx             # ✅ Page événements
│   │
│   ├── 📁 lib/                    # Utilitaires et configurations
│   │   └── supabaseClient.js      # ✅ Client Supabase + helpers
│   │
│   └── 📁 assets/                 # Fichiers statiques (images, etc.)
│
└── 📁 public/                     # Assets publics (favicon, etc.)
```

## 🎯 Responsabilités des Composants

### Components (src/components/)

#### Header.jsx
**Responsabilités:**
- Navigation principale responsive
- Sélecteur de langue FR/EN
- Bouton de don très visible
- Menu hamburger mobile
- Logo et nom de l'association

**Props:** Aucune (utilise l'état local pour le menu et la langue)

**État:**
- `isMenuOpen`: Contrôle l'affichage du menu mobile
- `currentLang`: Langue active (FR/EN)

#### Footer.jsx
**Responsabilités:**
- Informations de contact (France & Congo)
- Liens rapides vers les pages
- Réseaux sociaux
- Section "Transparence & Gouvernance" avec SIREN
- Mentions légales et CGV

**Props:** Aucune

### Pages (src/pages/)

#### Home.jsx
**Sections:**
1. **Hero Section** - Vision globale "De la France au Congo"
2. **Carte Interactive** - Deux pôles d'activité (France/Congo)
3. **Nos Missions** - Focus Orphelinat & École
4. **Formations & Jeunes** - Grille filtrable par pays
5. **Blog & Événements** - Aperçus des derniers contenus
6. **CTA Donation** - Appel à l'action pour les dons

**État:**
- `formations`: Liste des formations depuis Supabase
- `articles`: Articles de blog (limité à 3)
- `evenements`: Événements à venir (limité à 3)
- `loading`: État de chargement
- `selectedCountry`: Filtre pays pour formations

**Intégrations Supabase:**
- `getFormations()` - Récupère toutes les formations
- `getArticles('FR')` - Récupère les articles en français
- `getEvenements()` - Récupère tous les événements

#### Events.jsx
**Responsabilités:**
- Affichage de tous les événements
- Filtrage par pays (France/Congo/Tous)
- Distinction événements à venir / passés
- Statistiques des événements
- CTA pour organiser un événement

**État:**
- `evenements`: Liste complète des événements
- `loading`: État de chargement
- `selectedCountry`: Filtre pays actif

**Intégrations Supabase:**
- `getEvenements()` - Récupère tous les événements

## 🔧 Lib & Utilitaires

### supabaseClient.js
**Exports:**
- `supabase` - Instance du client Supabase
- `getArticles(langue)` - Récupère articles filtrés par langue
- `getFormations(pays)` - Récupère formations filtrées par pays
- `getEvenements(pays)` - Récupère événements filtrés par pays
- `createDon(donData)` - Crée un nouveau don
- `uploadImage(file, bucket)` - Upload une image vers Storage

**Configuration:**
- Utilise les variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- Gère automatiquement les erreurs avec try/catch

## 🎨 Styles et Thème

### Tailwind Configuration (tailwind.config.js)

**Couleurs Personnalisées:**
```javascript
primary: {  // Bleu Institutionnel
  500: '#3b82f6',
  600: '#2563eb',  // Principal
  700: '#1d4ed8',
  // ... autres nuances
}

gold: {     // Or
  500: '#f59e0b',  // Principal
  600: '#d97706',
  // ... autres nuances
}
```

**Classes Utilitaires Personnalisées (index.css):**
- `.btn-primary` - Bouton bleu standard
- `.btn-gold` - Bouton doré pour les dons
- `.card` - Carte avec ombre et hover
- `.badge` - Badge générique
- `.badge-france` - Badge bleu pour France
- `.badge-congo` - Badge vert pour Congo
- `.container-custom` - Container avec padding responsive

## 🗄️ Structure Base de Données

### Tables Supabase

#### articles
- **id** (UUID): Identifiant unique
- **titre** (TEXT): Titre de l'article
- **contenu** (TEXT): Contenu complet
- **image_url** (TEXT): URL de l'image
- **langue** (VARCHAR): FR ou EN
- **date** (TIMESTAMPTZ): Date de publication
- **created_at** (TIMESTAMPTZ): Date de création

#### formations
- **id** (UUID): Identifiant unique
- **titre** (TEXT): Titre de la formation
- **description** (TEXT): Description complète
- **niveau** (VARCHAR): Débutant, Intermédiaire, Avancé
- **pays_concerne** (VARCHAR): France ou Congo
- **created_at** (TIMESTAMPTZ): Date de création

#### evenements
- **id** (UUID): Identifiant unique
- **titre** (TEXT): Titre de l'événement
- **date_debut** (TIMESTAMPTZ): Date et heure de début
- **lieu** (TEXT): Lieu de l'événement
- **pays** (VARCHAR): France ou Congo
- **description** (TEXT): Description
- **created_at** (TIMESTAMPTZ): Date de création

#### dons
- **id** (UUID): Identifiant unique
- **montant** (DECIMAL): Montant du don
- **donateur** (TEXT): Nom du donateur
- **email** (TEXT): Email du donateur
- **projet_cible** (VARCHAR): General, Congo_Orphelinat, Congo_Ecole, France_Formations
- **message** (TEXT): Message optionnel
- **created_at** (TIMESTAMPTZ): Date du don

## 🔐 Sécurité (RLS - Row Level Security)

**Politiques implémentées:**
- Lecture publique pour: articles, formations, evenements
- Insertion publique pour: dons (permet les dons anonymes)
- Écriture admin: À configurer avec authentification Supabase

## 📱 Responsive Breakpoints

**Tailwind par défaut:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Stratégie:**
- Mobile-first design
- Navigation hamburger < 1024px
- Grilles adaptatives (1, 2, ou 3 colonnes selon la taille)

## 🚀 Scripts Disponibles

```bash
npm run dev       # Démarre le serveur de développement (port 3000)
npm run build     # Compile pour la production
npm run lint      # Vérifie le code avec ESLint
npm run preview   # Prévisualise la build de production
```

## 📦 Dépendances Principales

**Production:**
- `react` & `react-dom` (18.2.0) - Framework UI
- `react-router-dom` (6.22.1) - Routing
- `@supabase/supabase-js` (2.39.7) - Client Supabase
- `lucide-react` (0.344.0) - Icônes

**Développement:**
- `vite` (5.1.4) - Bundler
- `tailwindcss` (3.4.1) - Framework CSS
- `eslint` (8.56.0) - Linter

## 🌐 Internationalisation (Future)

**Structure prête pour i18n:**
- Sélecteur de langue dans le Header
- Navigation avec textes FR/EN
- Articles filtrables par langue dans la DB

**Recommandation:**
- Utiliser `react-i18next` pour l'implémentation complète
- Créer des fichiers de traduction séparés
- Persister la langue dans localStorage

## 📈 Performances

**Optimisations implémentées:**
- Skeleton loading pendant les requêtes
- Limitation des résultats affichés (slice)
- Index sur les colonnes fréquemment filtrées
- Images lazy-loaded (Tailwind par défaut)

**Futures optimisations:**
- Code splitting par route
- Service Worker pour cache offline
- Optimisation des images avec WebP
- Pagination pour grandes listes

## 🔄 Workflow de Développement Recommandé

1. **Créer une branche feature**
   ```bash
   git checkout -b feature/nom-feature
   ```

2. **Développer et tester localement**
   ```bash
   npm run dev
   ```

3. **Linter avant commit**
   ```bash
   npm run lint
   ```

4. **Build de test**
   ```bash
   npm run build
   npm run preview
   ```

5. **Commit et push**
   ```bash
   git add .
   git commit -m "feat: description"
   git push origin feature/nom-feature
   ```

---

📝 **Note:** Ce document doit être mis à jour à chaque ajout de composant, page ou modification de structure majeure.
