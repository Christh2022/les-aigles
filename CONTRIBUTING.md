# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à La Famille Les Aigles! Ce guide vous aidera à contribuer efficacement au projet.

## 🎯 Comment Contribuer?

### Types de Contributions

- 🐛 **Correction de bugs**
- ✨ **Nouvelles fonctionnalités**
- 📝 **Amélioration de la documentation**
- 🎨 **Améliorations UI/UX**
- 🌍 **Traductions**
- ♿ **Accessibilité**
- ⚡ **Optimisations de performance**

## 🚀 Workflow de Contribution

### 1. Fork et Clone

```bash
# Fork le repository sur GitHub, puis:
git clone https://github.com/VOTRE-USERNAME/les-aigles.git
cd les-aigles
```

### 2. Créer une Branche

```bash
git checkout -b type/description-courte
```

**Types de branches:**
- `feat/` - Nouvelle fonctionnalité
- `fix/` - Correction de bug
- `docs/` - Documentation
- `style/` - Changements de style (CSS, formatage)
- `refactor/` - Refactoring de code
- `test/` - Ajout de tests
- `chore/` - Maintenance (dépendances, config)

**Exemples:**
```bash
git checkout -b feat/donation-page
git checkout -b fix/mobile-menu-close
git checkout -b docs/api-documentation
```

### 3. Développer

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### 4. Suivre les Standards de Code

#### JavaScript/React

- ✅ Utilisez les **hooks** React (useState, useEffect, etc.)
- ✅ Composants **fonctionnels** uniquement
- ✅ **PropTypes** ou commentaires JSDoc pour documenter les props
- ✅ Nommage en **camelCase** pour variables/fonctions
- ✅ Nommage en **PascalCase** pour composants
- ✅ Fichiers `.jsx` pour les composants React

#### CSS/Tailwind

- ✅ Privilégiez **Tailwind** aux styles inline
- ✅ Utilisez les **classes utilitaires personnalisées** (`.btn-primary`, `.card`, etc.)
- ✅ Responsive **mobile-first**
- ✅ Classes dans l'ordre: layout → spacing → colors → typography → effects

#### Commits

Format: `type: description courte`

**Types:**
- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation uniquement
- `style:` - Formatage, ponctuation
- `refactor:` - Refactoring
- `test:` - Ajout de tests
- `chore:` - Maintenance

**Exemples:**
```bash
git commit -m "feat: add donation form with project selection"
git commit -m "fix: mobile menu not closing on route change"
git commit -m "docs: update API documentation for supabaseClient"
```

### 5. Tester

```bash
# Vérifier le lint
npm run lint

# Builder pour vérifier qu'il n'y a pas d'erreurs
npm run build

# Tester la build
npm run preview
```

### 6. Pusher et Créer une Pull Request

```bash
git push origin votre-branche
```

Puis sur GitHub:
1. Allez sur votre fork
2. Cliquez sur "Compare & pull request"
3. Remplissez le template de PR (voir ci-dessous)

## 📋 Template de Pull Request

```markdown
## Description
[Décrivez vos changements en quelques phrases]

## Type de changement
- [ ] Bug fix (correction d'un problème existant)
- [ ] Nouvelle fonctionnalité (ajout de fonctionnalité)
- [ ] Breaking change (changement qui casse la compatibilité)
- [ ] Documentation

## Comment tester?
1. [Étape 1]
2. [Étape 2]
3. [Résultat attendu]

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai testé localement mes changements
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] Pas d'avertissements ESLint
- [ ] La build passe sans erreurs
- [ ] Testé sur mobile et desktop

## Screenshots (si applicable)
[Ajoutez des captures d'écran si changements visuels]
```

## 🎨 Guidelines UI/UX

### Couleurs

- **Primary (Bleu)**: Actions principales, liens
- **Gold (Or)**: Donations, CTA importants
- **Green**: Congo, succès
- **Blue**: France, informations

### Composants

Réutilisez les composants existants:
- Boutons: `.btn-primary`, `.btn-gold`
- Cartes: `.card`
- Badges: `.badge`, `.badge-france`, `.badge-congo`

### Responsive

Testez toujours sur:
- 📱 Mobile (320px - 768px)
- 📱 Tablet (768px - 1024px)
- 💻 Desktop (1024px+)

### Accessibilité

- ✅ Alt text pour toutes les images
- ✅ Labels pour tous les inputs
- ✅ Contraste suffisant (WCAG AA minimum)
- ✅ Navigation au clavier fonctionnelle
- ✅ ARIA labels pour les icônes

## 🗄️ Modifications de Base de Données

Si vous devez modifier le schéma:

1. **Mettez à jour** `supabase-schema.sql`
2. **Documentez** les changements dans la PR
3. **Créez une migration** si possible:

```sql
-- Migration: Add new field to formations table
-- Date: 2026-03-XX
-- Author: Votre Nom

ALTER TABLE formations ADD COLUMN duree_semaines INTEGER;
```

## 🌍 Ajout de Traductions

Structure pour i18n (future):

```
src/
  locales/
    fr/
      common.json
      home.json
    en/
      common.json
      home.json
```

## ✅ Checklist Avant la PR

- [ ] Code lint sans erreurs (`npm run lint`)
- [ ] Build réussie (`npm run build`)
- [ ] Testé sur Chrome, Firefox, Safari
- [ ] Testé sur mobile
- [ ] Pas de `console.log()` oubliés
- [ ] Pas de credentials hardcodés
- [ ] Documentation mise à jour
- [ ] Captures d'écran ajoutées (si UI)

## 🚫 À Éviter

- ❌ Commiter `node_modules/` ou `.env.local`
- ❌ Hardcoder des URLs ou credentials
- ❌ Modifier plusieurs fonctionnalités non liées dans une PR
- ❌ Supprimer du code sans raison valable
- ❌ Ignorer les erreurs ESLint
- ❌ Copier-coller du code sans comprendre
- ❌ Modifier les dépendances sans raison

## 📞 Questions?

- 💬 Ouvrez une **Discussion** GitHub pour les questions générales
- 🐛 Ouvrez une **Issue** pour les bugs
- 📧 Email: dev@les-aigles.org

## 🙏 Code de Conduite

- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est le mieux pour la communauté
- Montrez de l'empathie envers les autres contributeurs

## 📝 License

En contribuant, vous acceptez que vos contributions soient sous la même licence que le projet principal.

---

Merci de contribuer à La Famille Les Aigles! 🦅

Ensemble, nous construisons une plateforme qui fait vraiment la différence.
