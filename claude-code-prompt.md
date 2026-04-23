# Initial prompt till Claude Code

Lägg `CLAUDE.md` och `design-reference.png` i repo-roten (tom mapp).  
Starta Claude Code i mappen och klistra in detta som första meddelande:

---

```
Läs CLAUDE.md och design-reference.png i repo-roten innan du gör något annat.

Sedan:
1. Scaffolda projektet (Vite + React + TS + Tailwind + lucide-react)
2. Installera dependencies
3. Sätt upp design tokens i index.css enligt spec
4. Bygg appen per CLAUDE.md, bottom-up enligt workflow-sektionen
5. Verifiera att `npm run build` går igenom utan warnings
6. Testa manuellt i dev-server på både mobil-viewport (DevTools) och desktop
7. Skriv en kort README.md med lokal-start + Vercel-deploy-steg
8. Stanna innan du commitar — jag vill reviewa först

Om något i spec:en är ambiguöst eller du hittar edge-cases som inte är
förhandslåsta — fråga innan du implementerar. Bättre en fråga än en omtagning.

Om allt är klart, kör.
```

---

## Efter första rundan

Efter att Claude Code rapporterat klart:

1. Öppna dev-servern i telefonen (samma wifi, lokalt IP)
2. Kör igenom hela acceptance-listan i CLAUDE.md
3. Notera vad som inte funkar eller känns fel
4. Iterera i samma session — Claude Code har full kontext

## Deploy-flöde (efter review)

```bash
git init
git add .
git commit -m "initial: Handlingslista V1"
gh repo create handlingslista --public --source=. --push
```

Sedan: Vercel → New Project → import `handlingslista` från GitHub → deploy.  
Ingen config behövs, Vite auto-detekteras.

## Tips

- Om Claude Code börjar drifta från spec, påminn den: "Kolla CLAUDE.md igen, det står där."
- Om den föreslår scope-utökning (typ "ska jag lägga till dark mode också?"), svara "nej, V1 enligt spec".
- Om den frågar om tester — påminn om att de är uttryckligen out-of-scope i V1.
