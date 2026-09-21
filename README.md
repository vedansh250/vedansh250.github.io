# Vedansh Paunikar — Cloud / DevOps / SRE portfolio

React + TypeScript + Vite, Three.js (react-three-fiber), GSAP + ScrollTrigger, Lenis.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview
```

## Fill in before publishing
Edit **`src/data/links.ts`**. Any empty value hides its button/row automatically, so nothing fake is ever shown.

| key        | what to put |
|------------|-------------|
| `linkedin` | your LinkedIn profile URL |
| `email`    | your email address |
| `resume`   | e.g. `./resume.pdf` — drop the file in `/public` |

Project buttons (`VIEW PROJECT`, `GITHUB`, `LIVE DEMO`) appear when you add `view` / `github` / `live` to an entry in `src/data/projects.ts`.

The "My contribution" and "Result" lines in `projects.ts` are drafted only from the technology lists you supplied — make them specific to what you personally did.

## Deploy
Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`
(Settings → Pages → Source: GitHub Actions). `vite.config.ts` uses `base: './'`, so it also works at `/portfolio/`.

## Structure
- `src/scenes/` — Three.js: hero infrastructure graph, network lines + instanced data packets, particles, 3D explorer
- `src/components/` — page sections; `CloudScene.tsx` lazy-loads WebGL and falls back to an SVG/CSS network if WebGL is missing
- `src/data/` — all content (experience, skills, projects, pipeline, links)
- `src/lib/` — motion helpers, Lenis wiring, shared scene state
