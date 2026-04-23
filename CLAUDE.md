# CLAUDE.md — Handlingslista (Ullared MVP)

## Vad detta är

En mobile-first webapp för en inköpslista med kategorier. Byggs ikväll för ett Ullared-besök imorgon. Hostas på Vercel, kod på GitHub, ingen backend. All data i localStorage.

Användaren är utvecklaren själv. Ingen autentisering, ingen molnlagring, ingen multi-user, ingen multi-list.

## Målbild

Se `design-reference.png` i repo-roten. Det är den visuella målbilden — Nordic minimalism, varm off-white bakgrund, sage green accent, generös spacing. Följ den så nära som möjligt, inklusive typografi, färger, och layout.

## Tech stack

- **Vite** (senaste stable)
- **React 18** + **TypeScript** (strict mode)
- **Tailwind CSS** (senaste stable)
- **lucide-react** för ikoner
- **Ingen** state-library — useState + en custom `useLocalState`-hook räcker
- **Inget** komponentsbibliotek — bygg komponenter själv, håll det lätt
- **Inga** tester i V1 (avsiktligt — tidsbegränsning)
- **ESLint** + **Prettier** med standard-konfig
- **PWA-manifest** + ikoner så "Lägg till på startskärmen" funkar på iOS/Android. Detta är ett MÅSTE för mobile-first feel.

### Deployment
- GitHub repo → Vercel (auto-deploy från `main`)
- SPA, ingen SSR
- Ingen custom `vercel.json` behövs — Vite auto-detekteras

## Design system

### Färger (exponera som CSS-variabler i `:root`)
```
--bg:            #FAFAF7   /* huvudbakgrund, varm off-white */
--surface:       #FFFFFF   /* kort */
--border:        #EAE8E3   /* 1px border på kort */
--text-primary:  #1A1A1A
--text-secondary:#6B6B6B
--text-muted:    #9B9B9B
--accent:        #4A7C59   /* sage green — primary, check, progress */
--accent-soft:   #E8EFE9   /* hover/subtle bg */
--accent-track:  #E8E6E1   /* progressbar track */
--danger:        #B4534C   /* delete-knappar, confirms */
```

### Typografi
- Font: **Inter** från Google Fonts (`wght@400;500;600;700`)
- Fallback: `system-ui, -apple-system, sans-serif`
- Kategorinamn: uppercase, `text-base font-bold tracking-wide`
- Item-text: `text-base font-medium`
- Sekundärtext (datum, progress): `text-sm text-[--text-secondary]`

### Spacing, radius, elevation
- Kort-padding: 20px (`p-5`)
- Gap mellan kort: 12px (`gap-3`)
- Radius på kort: 12px (`rounded-xl`)
- Radius på pill/FAB: 999px (`rounded-full`)
- FAB: 56x56
- Item-row min-höjd: 48px
- Checkbox: 24x24, rund
- Kort-shadow: `0 1px 3px rgba(0,0,0,0.04)`
- FAB-shadow: Tailwind `shadow-lg`

### Animation
- Expand/collapse kategori: 200ms ease-out (height + opacity)
- Check-toggle: 150ms färg + liten scale-pop på bocken
- Sheet in/out: 250ms ease-out
- **Inte** framer-motion — vanlig CSS/Tailwind räcker

## Features — MÅSTE (V1)

### 1. Global header
- Tillbaka-chevron vänster (placeholder, gör inget i V1)
- Titel centrerad, klickbar → blir `<input>` inline, enter/blur sparar
- Under titel: `{dagens datum på svenska} · {X} av {Y} klara`
- Global progressbar + procent höger ("69%")
- Kebab-meny (⋮) höger (se Meny längre ner)

### 2. Kategori-kort
- **Kollapsad**: namn (uppercase), "N/M klara", chevron-ner, tunn progressbar under namnet
- **Expanderad**: namn + "N/M klara", chevron-upp, ingen progressbar, items listade under
- När N === M: grön rund checkmark-badge ersätter "N/M klara"
- Tom kategori: visa "Inga varor än" som muted placeholder, ingen räknare

### 3. Item-rad
- Vänster: rund checkbox (24x24)
- Mitten: item-namn
- Checkad: `line-through`, färg `--text-muted`, bock blir sage-fylld med vit ✓
- Höger: diskret × (opacity-40) för delete
- Hela raden (utom ×) togglar checked på klick
- × raderar direkt + visar "Ångra"-toast nere i 5 sek

### 4. Items utan kategori
- Samlas i en virtuell kategori sist i listan, namngiven **"ÖVRIGT"**
- Kategorin skapas automatiskt när första unkategoriserade item läggs till, göms när ingen finns

### 5. FAB + Add-sheet
- Fixerad nere till höger, sage green, vit +, med pill-label "Lägg till" till vänster (alltid synlig, både mobil och desktop)
- Klick → bottom sheet glider upp med två alternativ:
  - **+ Ny kategori** → input för namn → Enter sparar och stänger sheet
  - **+ Ny vara** → input för namn + `<select>` för kategori (existerande + "Ingen kategori") → Enter sparar
- Input fokuseras automatiskt när sheet öppnas
- Tap utanför sheet eller swipe-ner → stäng (swipe är nice-to-have, tap-utanför är måste)

### 6. Meny (kebab ⋮ top-right)
- **Rensa alla bockar** — avmarkerar alla items, behåller dem
- **Rensa hela listan** — nollställer allt, kräver confirm-dialog
- **Byt namn på listan** — alternativ till inline edit på titel
- **Kopiera som text** — lägger hela listan som plain text på clipboard (grupperat per kategori, checkade med `[x]`, ocheckade med `[ ]`)

### 7. Persistens
- All state sparas direkt i `localStorage` under key `handlingslista:v1`
- Ladda vid mount, fallback till defaultstate
- Debounce writes 200ms vid snabba ändringar (check/uncheck spam)

## OUT-OF-SCOPE (gör INTE)
- Flera listor, byta lista, arkivera lista
- Molnsync, konton, auth, delning
- Drag-and-drop reordering
- Nestade kategorier
- Bilder / emoji på items
- Notifieringar / reminders
- Mörkt läge (lämna utrymme för senare — använd CSS-variabler konsekvent så det är enkelt att lägga till)
- Tester av något slag
- i18n — svensk UI är hardcoded

## Data model

```typescript
// src/types.ts
export type Item = {
  id: string;                 // crypto.randomUUID()
  name: string;
  checked: boolean;
  categoryId: string | null;  // null = "ÖVRIGT"
  createdAt: number;
};

export type Category = {
  id: string;
  name: string;
  expanded: boolean;          // persisterad UI-state
  createdAt: number;
};

export type AppState = {
  listName: string;           // default "Ullared"
  createdAt: number;
  categories: Category[];     // ordning = createdAt asc
  items: Item[];              // ordning = createdAt asc
  version: 1;
};
```

Default-state vid första start:
```typescript
{
  listName: "Ullared",
  createdAt: Date.now(),
  categories: [],
  items: [],
  version: 1,
}
```

**Ingen seed-data.** Listan startar tom, användaren bygger själv.

## Komponent-arkitektur

Platt och enkel. Ingen atoms/molecules-pretention.

```
src/
├── App.tsx                  # root, useLocalState, prop-drilling
├── main.tsx
├── index.css                # Tailwind + CSS-variabler
├── types.ts
├── hooks/
│   └── useLocalState.ts
├── lib/
│   ├── formatDate.ts        # svensk lokalisering
│   ├── calcProgress.ts      # {done, total} för lista/kategori
│   └── exportText.ts        # kopiera-som-text
└── components/
    ├── Header.tsx
    ├── GlobalProgress.tsx
    ├── CategoryCard.tsx
    ├── ItemRow.tsx
    ├── ProgressBar.tsx
    ├── Fab.tsx
    ├── AddSheet.tsx
    ├── KebabMenu.tsx
    ├── ConfirmDialog.tsx
    └── UndoToast.tsx
```

## Interaktionspatterns

- **Tap på item-body** → toggle checked
- **Tap på ×** → delete + undo-toast (5s)
- **Tap på kategori-header** → toggle expanded
- **Tap på titel** → inline edit, enter/blur sparar
- **Long press** — använd INTE. Ingen gesture-beroende UX.
- Alla touch-targets ≥ 44x44 (Apple HIG)

## Svensk datumformatering

```typescript
new Date().toLocaleDateString('sv-SE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
// "23 april 2026"
```

## Code conventions

- TypeScript strict, **inga** `any`, **inga** `@ts-ignore`
- Functional components, inga klasser
- Named exports för komponenter
- En komponent per fil
- Tailwind-klasser, inga inline styles utom för CSS-variabler
- **Inga** `console.log` i committad kod
- `crypto.randomUUID()` för id:n — inga libraries

## Acceptance criteria

Appen är klar när:

- [ ] `/` laddar, visar header "Ullared" + dagens datum
- [ ] Lägga till kategori via FAB funkar
- [ ] Lägga till vara via FAB (med kategori-select) funkar
- [ ] Check/uncheck funkar med ett tryck
- [ ] Progress-räknare och progressbars uppdateras korrekt (kategori + globalt)
- [ ] Item-delete via × + undo-toast funkar
- [ ] Expand/collapse på kategori-kort funkar (smooth animation)
- [ ] Full kategori visar grön checkmark-badge istället för "N/M klara"
- [ ] Tom kategori visar "Inga varor än"
- [ ] Items utan kategori hamnar i auto-skapad "ÖVRIGT" längst ner
- [ ] Reload → all data kvar i localStorage
- [ ] Fungerar på iPhone Safari 17+ utan layoutbuggar
- [ ] Fungerar på desktop Chrome
- [ ] Meny: "Rensa alla bockar", "Rensa hela listan" (med confirm), "Byt namn", "Kopiera som text" — alla funkar
- [ ] PWA-manifest finns, app går att "installera" på iOS
- [ ] `npm run build` lyckas utan warnings
- [ ] Deployad på Vercel, URL funkar publikt

## Om du är osäker

Fråga **innan** du börjar bygga. Specifikt om:
- Ambiguös interaktion (ex. exakt animation för sheet)
- Edge-cases i datamodellen (ex. vad händer om man tar bort kategori med items?)
- Vercel-konfig

**Fråga INTE** om:
- Färger, radii, spacing, typografi — hårdspecificerat ovan
- Scope — står det inte ovan så är det OUT-OF-SCOPE

### Edge-case-beslut (förhandslåsta)
- **Ta bort kategori med items**: items flyttas till "ÖVRIGT", tas inte bort
- **Byta namn på kategori till tom sträng**: ignoreras, behåller tidigare namn
- **Lägga till item med tomt namn**: submit disabled
- **Samma namn på två kategorier**: tillåtet (id:n skiljer dem)

## Workflow

1. Scaffolda Vite-projektet
2. Installera deps (Tailwind, lucide-react, Inter via Google Fonts)
3. Sätt upp design tokens i `index.css`
4. Bygg komponenter bottom-up: `ProgressBar` → `ItemRow` → `CategoryCard` → `Header` → `Fab` → `AddSheet` → `App`
5. Koppla state via `useLocalState` i `App`, drilla props ner
6. Verifiera i browser på både mobil-viewport och desktop
7. `npm run build` — noll errors, noll warnings
8. Skriv kort `README.md` med deploy-steg
9. Stanna och rapportera innan commit — användaren reviewar
