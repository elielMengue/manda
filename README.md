# Manda

Manda est une plateforme Ã©ducative toutâ€‘enâ€‘un visant Ã  dÃ©mocratiser lâ€™accÃ¨s aux compÃ©tences numÃ©riques en Afrique. Elle permet aux jeunes dâ€™apprendre, de se certifier et dâ€™accÃ©der Ã  des opportunitÃ©s professionnelles â€” le tout en ligne.

---

## Objectif du projet

Donner aux jeunes, oÃ¹ quâ€™ils soient, les moyens de se former aux mÃ©tiers du numÃ©rique, valider leurs compÃ©tences et entrer en contact avec des employeurs ou partenaires de projets Ã  impact.

---

## Cas dâ€™utilisation

- Apprenant

  - Sâ€™inscrire et suivre des cours en ligne (vidÃ©os, textes)
  - RÃ©aliser des projets pratiques
  - Obtenir un certificat numÃ©rique
  - Suivre sa progression par module
  - AccÃ©der Ã  des opportunitÃ©s de stage ou dâ€™emploi

- Formateur

  - CrÃ©er des cours et modules pÃ©dagogiques
  - Ajouter des vidÃ©os, textes, quiz et ressources
  - Suivre la progression des Ã©tudiants

- Admin

  - GÃ©rer les utilisateurs, cours et statistiques
  - ModÃ©rer les contenus
  - Attribuer les rÃ´les

- Partenaire / Recruteur
  - Publier des offres dâ€™emploi ou de stage
  - Rechercher des profils certifiÃ©s
  - Contacter directement les talents

---

## FonctionnalitÃ©s (roadmap)

- [ ] Authentification sÃ©curisÃ©e (JWT)
- [ ] RÃ´les et permissions (Admin, Ã‰tudiant, Formateur, Partenaire)
- [ ] Suivi des cours et modules
- [ ] CrÃ©ation et Ã©dition de contenus pÃ©dagogiques
- [ ] GÃ©nÃ©ration de certificats PDF tÃ©lÃ©chargeables
- [ ] Projets pratiques soumis par les Ã©tudiants
- [ ] Tableau de bord personnalisÃ© par rÃ´le
- [ ] Espace recruteur avec filtrage par certification
- [ ] Messagerie interne Ã©tudiantsâ€‘formateurs
- [ ] Classements et badges de rÃ©ussite
- [ ] API publique pour partenaires tiers

---

## Stack technique

- Frontend: Next.js, Tailwind CSS, TypeScript
- Backend: Railway (PostgreSQL), API custom (JWT)
- Base de donnÃ©es: PostgreSQL + Prisma
- UI/UX: shadcn/ui, Lucide Icons
- DÃ©ploiement: Vercel (frontend) + Railway (backend)
- Diagrammes & Docs: Draw.io, Figma

---

## Architecture (haut niveau)

```mermaid
flowchart TD
    A[Utilisateur] -->|AccÃ¨de| B[Frontend - Next.js]
    B --> C[Auth]
    B --> D[PostgreSQL - Railway]
    C --> E[API / Middleware Auth]
    D --> E
    E -->|DonnÃ©es filtrÃ©es| B
```

---

## DÃ©marrage rapide

- PrÃ©requis: Node 18+, NPM/PNPM, PostgreSQL (Railway ou local)
- Installation:
  - Copier `.env.example` vers `.env` et renseigner `DATABASE_URL` et `JWT_SECRET`.
  - GÃ©nÃ©rer le client Prisma: `npm run prisma:generate`
  - Pousser le schÃ©ma en base: `npm run prisma:push` (ou `npm run prisma:migrate` en dev)
  - Lancer lâ€™app: `npm run dev`

Endpoints utiles:

- GET `/api/health` â€” statut rapide de lâ€™application

---

## Prochaines Ã©tapes (Backend)

- Choix dâ€™architecture:
  - A) API dÃ©diÃ©e sur Railway (Express/Nest + JWT) â€” Front Next.js consomme lâ€™API
  - B) API intÃ©grÃ©e (Next.js Route Handlers `app/api`) â€” plus simple, dÃ©ploiement unique
- Ã€ valider: prÃ©fÃ©rence A ou B, flux auth (signup, login, refresh), gestion des rÃ´les.
- ImplÃ©menter ensuite: Auth JWT + rÃ´les, CRUD de base (Users, Cours, Modulesâ€¦), suivi de progression, messagerie.

---

## DÃ©veloppement

- Prisma: schÃ©ma sous `prisma/schema.prisma`, migrations sous `prisma/migrations`
- Client Prisma unique via `lib/prisma.ts`
- Tailwind v4 activÃ© via `app/globals.css`
- Endpoint santÃ©: `app/api/health/route.ts`

---

## Backend (Architecture A)

- Code API: `backend/`
- DÃ©marrer en local:
  - `cd backend`
  - `npm install`
  - `cp .env.example .env` et renseigner `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`
  - `npm run prisma:generate`
  - (optionnel) `npm run prisma:migrate` ou `prisma db push`
  - `npm run dev` puis ouvrir `http://localhost:8080/health`
- DÃ©ploiement Railway (free):
  - CrÃ©er un projet, ajouter un service PostgreSQL (Railway gÃ¨re `DATABASE_URL`)
  - DÃ©ployer le dossier `backend/` (monorepo) et dÃ©finir `CORS_ORIGIN` et `JWT_SECRET`
  - VÃ©rifier `GET /health` sur le domaine public Railway

