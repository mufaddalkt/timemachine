# EPOCH — The Cinematic Time Machine

Working local engine preview and sourced historical archive. The updated photorealistic film brief is **not yet complete**. The owner authorized publication of this current prototype on 12 October 2026 after reviewing its limitations.

## Run

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Enable full camera mode through Experience information if your system requests reduced motion.

```sh
npm run typecheck
npm run build
```

The static production build is exported to `out/`. Dev and production caches are separated. Vercel can build this Next.js project without secrets or a backend.

## Current implementation

- A GSAP master timeline drives a Catmull-Rom Three.js camera, GLB scene geometry, native skinned animation sampling, traffic position, light/fog grading, captions and historical time.
- Current and adjacent scenes load through a shared GLB cache with lease accounting and disposal. Demand rendering avoids spending GPU time while the user holds time still.
- The modern street and hospital corridor demonstrate spatial sequencing. They are labeled technical previews. Modern geometry is vertex-colored; the hospital is a blockout; stock animated figures have provisional clothing.
- All years from 2026 through 2000 have individually accessible, source-backed information. Civilization and geological entries distinguish approximate ranges, regional scope and uncertainty.
- Search, pause/resume, timeline scrubbing, skip controls, readable article sections, source links, browser-local saved discoveries, optional browser speech, native keyboard focus and reduced-motion alternatives are implemented.
- `/archive/` preserves a readable illustrated historical journey. Broader cinematic worlds remain archive visualizations pending appropriate environment and character assets.

## Source layout

`components/FilmExperience.tsx` owns the master timeline and interface. `components/CinematicWorld.tsx` renders spatial scenes and animation. `lib/model-cache.ts` manages resource leases. `lib/cinema.ts` supplies shot direction. `lib/history.json`, `annual.json` and `additional.json` supply educational records; adjacent research JSON files preserve source verification notes.

`PRODUCTION-PLAN.md` records asset requirements, distinct shot transitions, unfinished features and the release gate. Model provenance and fidelity limitations are in `public/models/asset-note.md` and `asset-manifest.json`. Original AI-generated Earth and Egypt image prompts are in `public/images/asset-note.md`; production image assets use WebP. Photographic and AI imagery is illustrative, not archival evidence.

## Requested release

The current prototype is approved for upload to `mufaddalkt/timemachine`, then deploy Vercel project `timemachine` under team `ktsmart`. Requested production alias: `timemachine.vercel.app`, subject to availability. The prototype labels remain visible. Consult the GitHub commit and Vercel deployment result for the release state.

