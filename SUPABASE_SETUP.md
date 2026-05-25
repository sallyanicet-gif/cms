# Configuration Supabase - Soft West

## 📋 Étapes pour configurer Supabase

### 1. Créer un compte Supabase
1. Allez sur https://supabase.com
2. Cliquez sur "Sign Up"
3. Créez un compte avec Google, GitHub ou email
4. Créez une nouvelle organisation et projet

### 2. Configurer la base de données

Une fois dans Supabase, allez dans "SQL Editor" et exécutez ce script :

```sql
-- Créer la table products
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10, 2),
  emoji VARCHAR(10),
  mood VARCHAR(50),
  badge VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer les index
CREATE INDEX idx_products_mood ON products(mood);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Ajouter la RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Créer une policy pour lire les produits (public)
CREATE POLICY "Enable read access for all users"
ON products FOR SELECT
USING (true);

-- Créer une policy pour les admins (créer/modifier/supprimer)
CREATE POLICY "Enable all for authenticated users"
ON products FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

### 3. Configurer l'authentification

1. Allez dans "Authentication" → "Providers"
2. Assurez-vous que "Email" est activé
3. Allez dans "URL Configuration"
4. Ajoutez vos URLs autorisées :
   - `http://localhost:3000` (développement)
   - `http://localhost:8000` (si vous utilisez un serveur local)
   - Votre URL de production

### 4. Obtenir les clés API

1. Allez dans "Settings" → "API"
2. Copiez votre :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (clé publique)
   - **service_role key** (clé secrète - à garder privée !)

### 5. Mettre à jour le fichier app.js

Dans `app.js`, remplacez les constantes :

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';  // Votre Project URL
const SUPABASE_KEY = 'your-anon-key';  // Votre clé publique anon
```

### 6. Créer un utilisateur admin

1. Allez dans "Authentication" → "Users"
2. Cliquez sur "Add user"
3. Entrez email et mot de passe
4. Cliquez "Create user"

Utilisez cet email/password pour vous connecter en admin sur le site.

## 🔐 Sécurité

### Bonnes pratiques :
- ✅ N'utilisez JAMAIS la `service_role key` en frontend
- ✅ Utilisez uniquement la clé `anon public` dans le JavaScript
- ✅ Les policies RLS contrôlent l'accès aux données
- ✅ L'authentification via email/password reste sécurisée

### Structure des policies :
- **Lecture (SELECT)** : Tous les utilisateurs peuvent voir les produits
- **Création/Modification/Suppression** : Seulement les utilisateurs authentifiés (admins)

## 📱 Déployer en production

### Sur Vercel / Netlify :

1. Mettez votre code sur GitHub
2. Connectez Vercel/Netlify à votre repo
3. Ajoutez les variables d'environnement :
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=your-anon-key
   ```
4. Déployez !

### Sur un serveur classique :

1. Uploadez les fichiers (HTML, CSS, JS)
2. Assurez-vous que `app.js` a les bonnes valeurs Supabase
3. C'est tout ! Aucun backend nécessaire (Supabase = backend)

## 🗄️ Structure de la table products

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGINT | ID unique (auto-incrément) |
| name | VARCHAR | Nom du produit |
| category | VARCHAR | Catégorie (Peluche, Porte-clés, etc) |
| price | DECIMAL | Prix en euros |
| emoji | VARCHAR | Emoji ou icône |
| mood | VARCHAR | happy, grumpy, overthink, lowbattery, all |
| badge | VARCHAR | Badge optionnel (Chaud, Populaire, etc) |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de dernière modification |

## 🔄 Fonctionnalités implémentées

### Frontend :
- ✅ Affichage des produits (depuis Supabase)
- ✅ Recherche en temps réel
- ✅ Filtres par mood
- ✅ Dark mode / Light mode
- ✅ Panier (local)
- ✅ FAQ & Carousel

### Admin :
- ✅ Connexion/Déconnexion
- ✅ Créer un produit
- ✅ Modifier un produit
- ✅ Supprimer un produit
- ✅ Voir tous les produits en table
- ✅ Authentification via Supabase

### Contact :
- ⏳ À intégrer avec un service d'email (SendGrid, Resend, etc)

## 📧 Ajouter l'envoi d'emails (optionnel)

### Option 1 : Avec Supabase Edge Functions

1. Installez Supabase CLI
2. Créez une Edge Function pour envoyer les emails
3. Liez-la à votre formulaire de contact

### Option 2 : Avec EmailJS

1. Créez un compte sur https://www.emailjs.com
2. Intégrez EmailJS dans votre formulaire contact
3. Configurez votre domaine d'email

### Option 3 : Avec SendGrid / Resend

Même processus que ci-dessus, mais avec ces services.

## 🐛 Dépannage

### "Invalid project ref" ?
- Vérifiez que votre SUPABASE_URL est correct
- Vérifiez que votre SUPABASE_KEY est correct

### "Auth error" ?
- Vérifiez que l'utilisateur existe dans Supabase
- Vérifiez que l'email/password sont corrects
- Vérifiez les URL autorisées dans "URL Configuration"

### Les produits ne s'affichent pas ?
- Vérifiez que la table `products` existe
- Vérifiez que vous avez des produits dans la table
- Vérifiez la console du navigateur pour les erreurs

## 📚 Ressources utiles

- Supabase Docs : https://supabase.com/docs
- Supabase JavaScript Client : https://supabase.com/docs/reference/javascript
- PostgreSQL Docs : https://www.postgresql.org/docs
- Row Level Security : https://supabase.com/docs/guides/auth/row-level-security

## ✅ Checklist avant de lancer

- [ ] Supabase account créé
- [ ] Table products créée
- [ ] RLS policies configurées
- [ ] URLs autorisées ajoutées
- [ ] Utilisateur admin créé
- [ ] Clés API copié dans app.js
- [ ] Formulaire contact intégré (optionnel)
- [ ] Site testé localement
- [ ] Déployé en production

Voilà ! Vous êtes prêt ! 🚀
