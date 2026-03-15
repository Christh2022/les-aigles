# Les Aigles

Association France-Congo pour l'aide sociale internationale

## Description

Les Aigles est une plateforme web internationale dédiée à l'association France-Congo pour l'aide sociale. Cette application permet de gérer les articles, formations, événements et dons pour soutenir les actions humanitaires entre la France et le Congo.

## Stack Technique

- **React 18** - Framework JavaScript
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS utilitaire
- **Supabase** - Backend as a Service (base de données et authentification)
- **React Router** - Navigation

## Installation

### Prérequis

- Node.js 18+ et npm (ou yarn/pnpm)
- Un compte Supabase (pour la base de données)

### Configuration

1. Cloner le dépôt:
```bash
git clone https://github.com/Christh2022/les-aigles.git
cd les-aigles
```

2. Installer les dépendances:
```bash
npm install
```

3. Configurer les variables d'environnement:
Créer un fichier `.env` à la racine du projet avec:
```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_supabase
```

4. Lancer le serveur de développement:
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la version de production
- `npm run lint` - Vérifie le code avec ESLint

## Structure du Projet

```
les-aigles/
├── public/          # Fichiers statiques
├── src/
│   ├── App.jsx      # Composant principal
│   ├── main.jsx     # Point d'entrée
│   ├── index.css    # Styles globaux avec Tailwind
│   └── App.css      # Styles du composant App
├── index.html       # Template HTML
├── vite.config.js   # Configuration Vite
├── tailwind.config.js  # Configuration Tailwind
├── postcss.config.js   # Configuration PostCSS
└── package.json     # Dépendances et scripts
```

## Thème de Couleurs

- **Bleu primaire** (`#2563eb`) - Actions institutionnelles
- **Or** (`#f59e0b`) - Dons et appels à l'action
- **Bleu** - Badge France
- **Vert** - Badge Congo

## Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

Ce projet est sous licence MIT.
