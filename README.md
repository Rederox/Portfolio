# Portfolio V2 — Thevaraj Theivathan

Portfolio personnel avec interface d'administration intégrée. Thème sombre, animations fluides, CMS maison via Firebase.

**Live :** [theivathan.fr](https://theivathan.fr) &nbsp;|&nbsp; **GitHub :** [github.com/Rederox](https://github.com/Rederox) &nbsp;|&nbsp; **LinkedIn :** [linkedin.com/in/theivathan](https://www.linkedin.com/in/theivathan/)

---

## Fonctionnalités

### Portfolio (`/`)
- Hero animé avec typewriter
- Compétences, expériences, projets, formation
- Formulaire de contact (envoi email via SMTP)
- Tracking des visites et événements (Firestore)
- Thème et fond d'écran personnalisables depuis l'admin

### Admin (`/admin`)
- Authentification Firebase (protégé par middleware + cookie de session)
- Dashboard avec statistiques en temps réel
- Gestion CRUD : projets, compétences, expériences, formations
- Analytics : visites par pays/device/OS/referrer, événements clics
- Personnalisation du thème (6 couleurs + couleur custom + 6 styles de fond)
- Upload d'images via Firebase Storage

---

## Stack

| Catégorie | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14 |
| Langage | TypeScript | 5 |
| Style | Tailwind CSS | 3 |
| Animations | Framer Motion | 11 |
| Icônes | react-icons | 5 |
| Typage animé | react-simple-typewriter | 5 |
| Base de données | Firebase Firestore | 10 |
| Auth | Firebase Authentication | 10 |
| Stockage fichiers | Firebase Storage | 10 |
| Email | Nodemailer | 8 |
| Graphiques | Recharts | 3 |
| Analytics | @vercel/analytics | 1 |

**Design :** fond `#0a0a0a`, accent émeraude `#10b981` par défaut, polices Syne (titres) + Inter (corps).

Tout le contenu initial est dans `data/portfolio.ts`. Les données éditées via l'admin sont synchronisées dans Firestore.

---

## Installation

```bash
git clone https://github.com/Rederox/portfolio-v2.git
cd portfolio-v2/Portfolio
npm install
```

Créer un fichier `.env.local` à la racine de `Portfolio/` :

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# SMTP (formulaire de contact)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
```

Lancer en développement :

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Lancer le build de production
npm run lint     # Vérification ESLint
```

Seed Firestore (import des données initiales depuis `data/portfolio.ts`) :

```bash
node scripts/seed-firestore.mjs
```

---

## Structure

```
Portfolio/
├── app/
│   ├── layout.tsx              # Layout global (métadonnées, fonts)
│   ├── page.tsx                # Page portfolio principale
│   ├── globals.css             # Variables CSS & styles globaux
│   ├── admin/
│   │   ├── layout.tsx          # Layout admin (AuthProvider + AdminGuard)
│   │   ├── page.tsx            # Dashboard
│   │   ├── login/page.tsx      # Page de connexion
│   │   ├── analytics/page.tsx  # Statistiques visites & événements
│   │   ├── projects/page.tsx   # Gestion des projets
│   │   ├── skills/page.tsx     # Gestion des compétences
│   │   ├── experience/page.tsx # Gestion des expériences
│   │   ├── education/page.tsx  # Gestion des formations
│   │   └── theme/page.tsx      # Personnalisation du thème
│   └── api/
│       └── contact/route.ts    # API envoi email (Nodemailer)
├── components/
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── AnalyticsTracker.tsx    # Enregistre visites & durée (côté client)
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── Modal.tsx
│   │   └── ImageUpload.tsx
│   └── sections/
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Skills.tsx
│       ├── Experience.tsx
│       ├── Projects.tsx
│       ├── Education.tsx
│       └── Contact.tsx
├── data/
│   └── portfolio.ts            # Source initiale de toutes les données
├── lib/
│   ├── firebase.ts             # Init Firebase (lazy singletons)
│   ├── auth-context.tsx        # Contexte Firebase Auth
│   ├── firestore.ts            # Helpers CRUD Firestore
│   ├── analytics.ts            # Tracking visites & événements
│   ├── storage.ts              # Upload Firebase Storage
│   ├── themes.ts               # Définitions des thèmes
│   ├── theme-context.tsx       # Contexte thème actif
│   ├── mode-context.tsx        # Contexte portfolio/admin
│   └── iconMap.ts              # Mapping nom -> composant react-icons
├── hooks/
│   └── useFirestore.ts         # Hook générique CRUD Firestore
├── middleware.ts               # Protection des routes /admin/*
├── scripts/
│   └── seed-firestore.mjs      # Import initial des données dans Firestore
└── public/
    ├── me.jpg
    ├── about.jpg
    └── CV_Thevaraj_Theivathan.pdf
```

---

## Firebase — Collections Firestore

| Collection | Description | Lecture | Écriture |
|---|---|---|---|
| `analytics/summary` | Compteurs globaux (visites, clics...) | Auth | Public |
| `visits/{id}` | Enregistrements individuels de visites | Auth | Public |
| `projects/{id}` | Projets | Public | Auth |
| `skills/{id}` | Compétences | Public | Auth |
| `experience/{id}` | Expériences professionnelles | Public | Auth |
| `education/{id}` | Formations | Public | Auth |
| `settings/theme` | Thème et style de fond actifs | Public | Auth |

---

## Thèmes disponibles

| Nom | Accent |
|---|---|
| Emerald (défaut) | `#10b981` |
| Violet | `#8b5cf6` |
| Cyan | `#06b6d4` |
| Rose | `#f43f5e` |
| Ambre | `#f59e0b` |
| Indigo | `#6366f1` |
| Custom | Hex libre |

Styles de fond : `none`, `grid`, `dots`, `particles`, `waves`, `lines`.

---

## Contact

**Email :** theivathan14@gmail.com &nbsp;|&nbsp; **Tel :** +33 7 84 96 88 40 &nbsp;|&nbsp; **Argenteuil, France**
