# Soft West - Redesign Inspiré de The Sillies + Supabase 👽

## 🎨 Changements Majeurs

### Couleurs
- **Couleur primaire** : `#BFFF00` (Vert anis/lime) au lieu du `#8CE634`
- **Couleur secondaire** : `#FF2E7E` (Rose magenta) pour l'accent
- **Fond principal** : `#F0FFE0` (Vert clair pastel) au lieu du beige
- **Texte** : Plus sombre pour plus de contraste

### Typographie
- **Titres playful** : Utilisation de la font `Caveat` pour les titres (manuscrite/playful)
- **Corps de texte** : `Fredoka` (sans-serif moderne et conviviale)

### Structure & Layout
1. **Top Banner** : Bande supérieure scrollante avec les infos (shipping, retours, sécurité, etc.)
2. **Header amélioré** : Logo + barre de recherche + actions (thème, admin, panier)
3. **Navigation** : Centralisée sous le header avec underline animation
4. **Hero section** : Grille 2 colonnes avec contenu + emoji alien
5. **Sections modularisées** :
   - Featured products
   - Moods (4 états d'humeur)
   - À propos (avec numbering)
   - Avis clients (carousel)
   - FAQ (accordion)
   - Admin dashboard

## 🛠️ **NOUVEAU : Intégration Supabase**

### Backend inclus :
- ✅ **Base de données PostgreSQL** avec table `products`
- ✅ **Authentification** (email/password)
- ✅ **Admin Dashboard** (créer/modifier/supprimer produits)
- ✅ **Row Level Security** (permissions)
- ✅ **Synchronisation en temps réel**

### Fonctionnalités admin :
- 🔐 Connexion sécurisée
- ➕ Ajouter des produits
- ✏️ Modifier les produits
- 🗑️ Supprimer les produits
- 📊 Vue d'ensemble en table

## 📁 Fichiers

```
├── index.html              # Structure HTML + modales admin/login
├── styles.css              # Styles CSS (responsive, dark mode, admin)
├── app.js                  # JavaScript avec Supabase intégré
├── README.md               # Ce fichier
├── SUPABASE_SETUP.md       # Guide complet Supabase
└── SUPABASE_SCHEMA.sql    # Script SQL pour créer la BD
```

## 🚀 Démarrage rapide

### 1. **Configurer Supabase** (5 minutes)
Voir le fichier `SUPABASE_SETUP.md` pour les détails complets.

Résumé rapide :
1. Créer compte sur https://supabase.com
2. Créer un projet
3. Exécuter le script SQL fourni
4. Copier les clés API
5. Mettre à jour les variables dans `app.js`

### 2. **Tester localement**
```bash
# Ouvrir index.html dans un navigateur
# ou servir avec un serveur local
python3 -m http.server 8000
```

### 3. **Déployer en production**
- Vercel, Netlify, GitHub Pages, ou tout serveur static
- Aucun backend nécessaire (Supabase = backend !)

## 🎯 Fonctionnalités

### Page Accueil
- Hero section avec call-to-action
- Produits en vedette (4 premiers - depuis Supabase)
- Section des 4 moods
- Section "Pourquoi nous" avec 3 points
- Avis clients en carousel
- FAQ avec 6 questions

### Page Boutique
- Grille de tous les produits (Supabase)
- Filtres par mood (Tous, Happy, Grumpy, Overthink, Low Battery)
- Recherche en temps réel

### Page Admin 🔐
- Connexion / Déconnexion
- Créer un nouveau produit
- Modifier un produit existant
- Supprimer un produit
- Vue d'ensemble en table
- Protégé par authentification Supabase

### Features Frontend
- 🌙 Dark mode toggle
- 🔍 Recherche produits en temps réel
- 🛒 Panier avec compteur
- 💬 FAQ accordion
- ⭐ Carousel avis
- 📱 Design responsive (mobile, tablette, desktop)
- 🔐 Authentification admin

## 🔐 Sécurité

### Authentification
- Email/Password via Supabase Auth
- Sessions stockées en localStorage (sécurisé)
- Déconnexion possible

### Permissions (RLS)
- **Produits visibles** : À tous (lecture seule)
- **Modification produits** : Admins authentifiés uniquement
- **API calls** : Signées avec clé publique

### Bonnes pratiques
✅ Clé publique (`anon key`) utilisée en frontend
✅ Service role key jamais exposée en frontend
✅ Row Level Security active
✅ Authentification obligatoire pour l'admin

## 📊 Structure Supabase

### Table `products`
```sql
id          BIGINT         -- PK auto-incrément
name        VARCHAR(255)   -- Nom du produit
category    VARCHAR(100)   -- Catégorie
price       DECIMAL(10,2)  -- Prix en €
emoji       VARCHAR(10)    -- Emoji ou icon
mood        VARCHAR(50)    -- happy, grumpy, overthink, lowbattery, all
badge       VARCHAR(50)    -- Tag optionnel (Chaud, Populaire, etc)
created_at  TIMESTAMP      -- Créé le
updated_at  TIMESTAMP      -- Modifié le
```

## 💡 Configuration

### Fichier `app.js` - Lignes 6-7
```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR-ANON-KEY';
```

Remplacez par vos vraies clés depuis Supabase Settings → API.

### Créer un utilisateur admin
1. Dans Supabase : Authentication → Users
2. "Add user"
3. Email + Password
4. Utilisez ces identifiants pour vous connecter sur le site

## 📱 Responsive Design

- **Desktop** : Mise en page complète
- **Tablette** : Grilles adaptées
- **Mobile** : Colonne unique, menus optimisés

## 🎭 Moods

1. **Happy Beam** (100%) 😊 - L'alien des bonnes journées
2. **Grumpy Cloud** (70%) 😠 - Toléré, mais juste
3. **Overthinker** (40%) 🤔 - Le cerveau qui ne s'arrête pas
4. **Low Battery** (10%) 😴 - Off. Recharge en cours.

## 🔧 Fonctions JavaScript

### Navigation
- `navigateTo(page)` - Changer de page
- Protégée : admin nécessite connexion

### Produits
- `loadProducts()` - Charger depuis Supabase
- `renderProducts()` - Afficher les produits
- `filterProducts(query)` - Recherche
- `filterProductsByMood(mood)` - Filtrer par mood
- `addToCart()` - Panier local

### Admin
- `openLoginModal()` - Afficher login
- `openProductForm(id?)` - Créer/modifier produit
- `saveProduct()` - Sauvegarder dans Supabase
- `deleteProduct(id)` - Supprimer de Supabase
- `logout()` - Déconnexion

### Supabase
- `setupSupabase()` - Initialiser client
- `checkAuthStatus()` - Vérifier session
- `loadAdminProducts()` - Charger pour admin

## 📝 TODOs Optionnels

Pour améliorer davantage :
- [ ] Intégrer SendGrid/Resend pour formulaire contact
- [ ] Ajouter stripe pour paiement
- [ ] Lazy loading images
- [ ] Service worker pour offline mode
- [ ] Analytics (Plausible, Posthog)
- [ ] Notifications push
- [ ] Panier persistant (localStorage)
- [ ] Wishlist
- [ ] Avis clients (soumettre + afficher)

## 🧪 Tests

### Tester l'admin localement :
1. Ouvrir `index.html` dans le navigateur
2. Cliquer sur le bouton admin (cadenas 🔒)
3. Se connecter avec l'utilisateur créé dans Supabase
4. Créer/modifier/supprimer un produit
5. Voir les changements en temps réel

### Tester la recherche :
1. Aller sur la boutique
2. Taper dans la barre de recherche
3. Les produits se filtrent en temps réel

### Tester dark mode :
1. Cliquer sur l'icône lune en haut
2. Le site bascule en dark mode
3. L'état est sauvegardé (localStorage)

## 📚 Ressources

- **Supabase Docs** : https://supabase.com/docs
- **Supabase Auth** : https://supabase.com/docs/guides/auth
- **PostgreSQL** : https://www.postgresql.org/docs
- **Row Level Security** : https://supabase.com/docs/guides/auth/row-level-security

## 🚀 Déployer en production

### Option 1 : Vercel / Netlify (Recommandé)
1. Push le code sur GitHub
2. Connecter Vercel/Netlify à votre repo
3. Déployer automatiquement
4. Ajouter variables d'env si nécessaire

### Option 2 : Un serveur classique
1. Uploader les fichiers HTML/CSS/JS
2. Accéder via URL
3. C'est tout ! Aucun backend nécessaire

### Avant de lancer :
- [ ] Supabase configuré
- [ ] Utilisateur admin créé
- [ ] URLs autorisées dans Supabase
- [ ] Clés API dans app.js (publique seulement)
- [ ] Testé localement complètement
- [ ] Formulaire contact intégré (optionnel)

## 🎉 Résultat

Un site e-commerce **moderne, ludique et complet** avec :
- ✅ Design inspiré de The Sillies
- ✅ Backend Supabase complet
- ✅ Admin dashboard
- ✅ Authentification
- ✅ Base de données PostgreSQL
- ✅ Responsive design
- ✅ Prêt pour la production

👽✨ Bon développement !

