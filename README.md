# edu
EduImpact est une plateforme éducative tout-en-un visant à démocratiser l'accès aux compétences numériques en Afrique. Elle permet aux jeunes d’apprendre, de se certifier et d’accéder à des opportunités professionnelles le tout en ligne.

---

##  Objectif du projet

Donner aux jeunes, où qu’ils soient, les moyens de se former aux métiers du numérique, valider leurs compétences et entrer en contact avec des employeurs ou partenaires de projets à impact.

---

##  Cas d’utilisation

-  **Apprenant**
  - S'inscrire et suivre des cours en ligne (vidéos, textes)
  - Réaliser des projets pratiques
  - Obtenir un certificat numérique
  - Suivre sa progression par module
  - Accéder à des opportunités de stage ou d’emploi

-  **Formateur**
  - Créer des cours et modules pédagogiques
  - Ajouter des vidéos, textes, quizz et ressources
  - Suivre la progression des étudiants

-  **Admin**
  - Gérer les utilisateurs, cours et statistiques
  - Modérer les contenus
  - Attribuer les rôles

-  **Partenaire / Recruteur**
  - Publier des offres d'emploi ou stage
  - Rechercher des profils certifiés
  - Contacter directement les talents

---

##  Fonctionnalités

- ✅ `Enable`: Authentification sécurisée (Supabase Auth)
- ✅ `Enable`: Rôles et permissions (Admin, Étudiant, Formateur, Partenaire)
- ✅ `Enable`: Suivi des cours et modules
- ✅ `Enable`: Création et édition de contenus pédagogiques
- ✅ `Enable`: Génération de certificats PDF téléchargeables
- ✅ `Enable`: Projets pratiques soumis par les étudiants
- ✅ `Enable`: Tableau de bord personnalisé par rôle
- ✅ `Enable`: Espace recruteur avec filtrage par certification
- 🟨 `Upcoming`: Messagerie interne étudiants-formateurs
- 🟨 `Upcoming`: Classements et badges de réussite
- 🟨 `Upcoming`: API publique pour partenaires tiers

---

##  Stack technique

| Côté | Technologie |
|------|-------------|
| Frontend | **Next.js**, Tailwind CSS, TypeScript |
| Backend | **Supabase** (Auth, DB, Storage) |
| Base de données | **PostgreSQL** |
| UI/UX | **shadcn/ui**, Lucide Icons |
| Déploiement | Vercel (frontend) + Supabase Cloud |
| Diagrammes & Docs | Mermaid.js, Figma |

---

##  Architecture

```mermaid
flowchart TD
    A[Utilisateur] -->|Accède| B[Frontend - Next.js]
    B --> C[Supabase Auth]
    B --> D[Supabase DB - PostgreSQL]
    B --> E[Supabase Storage - Vidéos, Certificats]
    D --> F[Politique RLS]
    C --> F
    F -->|Données filtrées| B
