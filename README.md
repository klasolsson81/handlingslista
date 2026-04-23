# Handlingslista

En mobile-first inköpslista med kategorier. Byggd för ett Ullared-besök — all
data sparas lokalt i `localStorage`, inget konto, inget moln.

## Tech stack

- Vite + React 19 + TypeScript (strict)
- Tailwind CSS v4 (CSS-first config via `@theme`)
- lucide-react för ikoner
- PWA-manifest så "Lägg till på startskärmen" fungerar på iOS/Android

## Kör lokalt

```bash
npm install
npm run dev
```

Öppna [http://localhost:5173](http://localhost:5173). För att testa på mobil
mot samma wifi:

```bash
npm run dev -- --host
```

## Bygg för produktion

```bash
npm run build
npm run preview   # testa bygget lokalt
```

Artefakter hamnar i `dist/`.

## Regenerera PWA-ikoner

`public/icon.svg` är källan. Om du uppdaterar den, kör:

```bash
npm run icons
```

Scriptet (`scripts/generate-icons.mjs`) skriver ut `icon-192.png`,
`icon-512.png`, `icon-512-maskable.png` och `apple-touch-icon.png`.

## Deploy till Vercel

1. Pusha till GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial: Handlingslista V1"
   gh repo create handlingslista --public --source=. --push
   ```
2. Gå till [vercel.com](https://vercel.com) → **New Project** → importera
   `handlingslista`-repot.
3. Klicka **Deploy**. Ingen config behövs — Vite auto-detekteras.

## Projektstruktur

```
src/
├── App.tsx              # root, state, prop-drilling
├── main.tsx
├── index.css            # Tailwind + design tokens
├── types.ts             # AppState, Item, Category
├── hooks/
│   └── useLocalState.ts # localStorage-persisterad state med 200ms debounce
├── lib/
│   ├── formatDate.ts    # svensk datumformatering
│   ├── calcProgress.ts  # progress-hjälpare
│   └── exportText.ts    # "Kopiera som text"
└── components/          # Header, CategoryCard, ItemRow, Fab, AddSheet, …
```

## Scope

Se `CLAUDE.md` för full spec och avgränsningar.
