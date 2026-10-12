# EPOCH production status

This is a working local cinematic-engine prototype and sourced historical archive. It does **not** meet the final photorealistic film requirement. The owner subsequently authorized publication of the current prototype on 12 October 2026.

## Implemented

- Next.js/React/TypeScript application with static export and readable `/archive/` route.
- One GSAP/ScrollTrigger master timeline writes continuous time to a shared controller without rerendering React every frame.
- Catmull-Rom camera rail through adjacent environments; direction reverses when time is scrubbed backward.
- Detailed mesh candidates loaded from GLB, skinned character clones, and AnimationMixer pose sampling from timeline time.
- Native walking clips on a stock Mixamo skeleton used by Three.js examples. These stock figures are animation test assets, not authentic historical or medical character reconstructions. A second candidate was inspected and rejected for direct clip transfer because its bind-pose axes differ; no unverified retarget is presented as complete.
- Street tracking and hospital corridor blockout, period lighting and fog, moving traffic, clickable spatial event marker, instanced window geometry.
- Current and adjacent scene mounting, shared model leases, cancellation of stale async updates, delayed cache disposal, mixer cleanup.
- Adaptive pixel density, shadow-map limits, smaller mobile crowd, reduced-motion and unavailable-WebGL alternatives.
- Timeline scrubber, skip controls, pause/resume, sources, search, browser-local bookmarks, optional browser speech narration, modal focus and restoration.
- Individually accessible sourced entries for all 27 years from 2026 through 2000. Broader history, civilizations and geological periods use approximate date ranges and documented caveats.

## Asset gate

The connected 3D Jutsu catalog was inspected and two candidate models imported. It supplies a vertex-colored apartment block and sedan with no UV texture maps, animation actions or rigs. Their author/license metadata is unavailable. They are suitable only for local technical review until rights are verified.

Searches for animated people, civilian characters, doctors, hospitals and hospital corridors returned no suitable models. The model catalog advertises Meshy/Tripo 3D generation and rigging, but the callable generation interface rejects 3D models and refers to a `generate_3d` operation that is not exposed in this session. A plugin search did not reveal another available Meshy integration.

Required to clear the gate:

1. Provenance and redistribution permission for every public runtime model and texture.
2. Detailed PBR modern city, wet-road material, authentic civilian bodies/clothing, walking/idle/phone animation sets, modern traffic, wind-reactive trees.
3. A reconstructed hospital corridor and medical equipment; healthcare and commuter clothing, masks, period-appropriate actions. The current corridor is a technical blockout.
4. Period environments and rigs for computing, WWI/WWII, industry, medieval and ancient societies, human origins, and non-human prehistoric life.
5. Paleontologically reviewed species per period, distinct animation clips and habitats; no mixing species from unrelated periods.
6. Licensed cinematic audio stems, measured narrative takes, and spatial cues. Browser speech and generated tones are temporary alternatives.
7. Full GPU/mobile performance audit after final assets and post-processing are integrated.
8. Full nested documentary chapters, individual biographies, artifact diagrams, and an interactive geographical/parallel-civilization view. The current focus panel has meaningful article sections and related-person search, but those deeper editorial features remain unfinished.

## Directed shot plan

| Chapter          | Camera and transition                                                                                       | Required production assets                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 2026–2021        | Low evening tracking shot; traffic and pedestrians pass wet facades; hospital entrance comes into the rail  | Modern city kit, rigged civilians, cars, trees, PBR materials                 |
| 2020             | Track through an architectural passage; crowd/traffic diminish and blue-gray light deepens; corridor focus  | Hospital interior, medical rigs, masks, health equipment                      |
| 2019–2000        | Connected city tracking; decade props and information displays change; 2001 uses solemn documentary framing | Early-2000s vehicles, clothing, sourced media, restrained city reconstruction |
| Computing        | Match-cut aligned modern display to CRT; camera moves between workstations                                  | Personal computers, mainframes, transistor/vacuum-tube artifacts, engineers   |
| WWI/WWII         | Separate civilian street/factory sequences; gentle passage into archival-map focus                          | Period architecture and civilian rigs; uniforms and machinery with provenance |
| Industrial       | Ground tracking between machine assemblies, crane rise through steam                                        | Machinery, workers, factory interiors, coal/steam material effects            |
| Medieval/ancient | Architectural passage into warm settlement; river-level tracking becomes a crane shot                       | Researched settlement kits, boats, traders, workers, clothing                 |
| Human origins    | Slow ground-level travel; settlement structures recede; focus on tools and cooperation                      | Evidence-based hominin reconstructions, tool-use/fire animations, terrain     |
| Mesozoic         | Canopy passage and aerial rise; each period keeps distinct animals and vegetation                           | Reviewed species, skeletal animal animations, period vegetation               |
| Earlier geology  | Marine rails and changing light/water; scientific timescale expands                                         | Geological/biological reconstructions with uncertainty labels                 |
| Earth formation  | Orbital rail and accretion visualization; basalt/crust and atmospheric changes                              | High-detail planetary shaders/textures and scientifically reviewed chronology |

## Release sequence

Clear the asset gate, verify the finished 2026→2020 vertical slice, then extend and verify each cinematic chapter. The current prototype is approved for upload to `mufaddalkt/timemachine`; then create/deploy Vercel project `timemachine` under team `ktsmart`, verify the production build, and assign `timemachine.vercel.app` if available.

The existing GitHub repository was checked read-only. Publication is now authorized for the current prototype. Vercel was checked read-only; no matching project existed at the time of inspection. An unpublished private Sites registration was created before the owner's destination change; it has no deployed version and is not the requested release destination.

