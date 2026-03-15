# 🚀 Guide de Démarrage Rapide

## Installation en 5 Minutes

### 1. Prérequis
- Node.js 18+ installé ([nodejs.org](https://nodejs.org))
- Compte Supabase gratuit ([supabase.com](https://supabase.com))

### 2. Installation des Dépendances

```bash
npm install
```

### 3. Configuration Supabase

#### A. Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **Project URL** et **anon public key**

#### B. Configurer les Variables d'Environnement

```bash
# Copiez le fichier d'exemple
cp .env.example .env.local

# Éditez .env.local avec vos vraies clés
# VITE_SUPABASE_URL=https://votre-projet.supabase.co
# VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

#### C. Créer les Tables de Base de Données

1. Dans votre dashboard Supabase, allez dans **SQL Editor**
2. Copiez tout le contenu du fichier `supabase-schema.sql`
3. Exécutez le script SQL
4. Vérifiez que les tables sont créées dans **Table Editor**

#### D. Créer le Bucket de Storage

1. Allez dans **Storage** dans le dashboard Supabase
2. Créez un nouveau bucket nommé `images`
3. Rendez-le **public**

### 4. Lancer l'Application

```bash
npm run dev
```

L'application sera disponible sur **http://localhost:3000** 🎉

## 📊 Vérification de l'Installation

### Checklist Rapide

- [ ] Le site s'affiche correctement
- [ ] Le header avec le sélecteur de langue est visible
- [ ] Le bouton "Faire un Don" est animé
- [ ] La page d'accueil affiche les 2 pôles (France/Congo)
- [ ] Les formations s'affichent (ou message "Aucune formation")
- [ ] La page Événements est accessible via le menu
- [ ] Le footer affiche le SIREN: 939 491 122

### En Cas de Problème

#### Les formations/événements ne s'affichent pas
- Vérifiez que vous avez exécuté le script SQL complet
- Vérifiez que les données de test sont insérées
- Ouvrez la console du navigateur (F12) pour voir les erreurs

#### Erreur "Invalid API key"
- Vérifiez vos variables d'environnement dans `.env.local`
- Vérifiez que vous utilisez bien la **anon public key**, pas la **service_role key**
- Redémarrez le serveur de développement après modification du `.env.local`

#### Erreur de connexion Supabase
- Vérifiez que votre projet Supabase est actif
- Vérifiez l'URL dans `.env.local` (doit commencer par https://)
- Vérifiez les RLS policies dans Supabase (doivent autoriser la lecture publique)

## 🎨 Personnalisation Rapide

### Changer les Couleurs

Éditez `tailwind.config.js`:

```javascript
colors: {
  primary: { 600: '#VOTRE_COULEUR' },  // Couleur principale
  gold: { 500: '#VOTRE_OR' },           // Couleur des boutons de don
}
```

### Modifier les Textes

- **Hero Section**: `src/pages/Home.jsx` (ligne ~43)
- **Informations Association**: `src/components/Footer.jsx` (ligne ~16)
- **Navigation**: `src/components/Header.jsx` (ligne ~13)

## 📱 Tester sur Mobile

### Option 1: Accès depuis votre réseau local

```bash
# Vite affiche l'URL réseau au démarrage
# Exemple: http://192.168.1.10:3000
# Utilisez cette URL sur votre smartphone
```

### Option 2: Utiliser ngrok (pour tests externes)

```bash
npx ngrok http 3000
# Copiez l'URL https générée pour tester sur n'importe quel appareil
```

## 🚢 Déploiement

### Vercel (Recommandé)

```bash
npm install -g vercel
vercel
```

Pensez à configurer les variables d'environnement dans le dashboard Vercel!

### Netlify

1. Créez un compte sur [netlify.com](https://netlify.com)
2. Connectez votre repository GitHub
3. Configurez:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Ajoutez vos variables d'environnement dans les settings

## 📞 Besoin d'Aide?

- 📖 Consultez le [README.md](./README.md) complet
- 🏗️ Consultez la [STRUCTURE.md](./STRUCTURE.md) pour l'architecture
- 🗄️ Consultez le [supabase-schema.sql](./supabase-schema.sql) pour la base de données

---

**Temps estimé d'installation complète: 10-15 minutes** ⏱️

Bon développement! 🦅
