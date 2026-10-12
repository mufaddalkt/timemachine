# Local verification

The build is an explicitly labeled cinematic engine preview. These checks establish working code and interactions, not finished photorealism or historical authenticity of candidate 3D assets.

## Passed

- TypeScript strict typecheck.
- Next.js static production export of `/` and `/archive/`.
- Content integrity: 60 primary archive articles; every year 2000–2026 present; required 12 broader civilization/geology records; unique IDs and valid HTTPS source links.
- Optimized WebP assets exist. Runtime GLBs have valid headers, mesh data, skinned animation data, and a native Walk clip.
- Browser renderer loads the apartment/sedan GLB into a spatial street and shows the hospital corridor blockout.
- One master timeline advances and reverses camera and native skeletal animation. On the verified 2019 frame, animation time was 16.8942 and camera position was `0.849,2.013,-268.685`. Reversing to 2020 returned animation time to 14.5407 and the camera to `-0.111,1.679,-228.675`.
- Opening the 2020 documentary focus and reading Sources paused the film. Closing it restored exactly: camera `-0.111,1.679,-228.675`, animation 14.5407, and scroll 7349.60009765625.
- Search filters a year and opens its article. WHO source link renders correctly. Saved discovery state persists between the original archive and revised cinematic interface.
- System reduced-motion preference selects the archive view; the gentler-motion switch enables/disables the real-time view.
- The illustrated archive was inspected at both narrow and desktop layouts. The revised controls adapt to narrow widths.

## Fixed during checks

- Isolated dev and production build caches to avoid concurrent Next.js output corruption.
- Scoped era pins to their actual scene elements in the readable archive.
- Passed the film controller explicitly into the 3D renderer, preserving synchronization through hot reload.
- Disabled continuous idle GPU rendering; frames are requested by actual time changes and scene updates.
- Prevented adjacent-city traffic from appearing inside the hospital corridor.
- Corrected caption/control hit testing so the documentary action remains clickable at short viewport heights.
- Rejected direct clip transfer between incompatible bind poses; the preview now samples the native stock rig clip.

## Still required

Final-assets visual verification, real mobile GPU testing, historical clothing/behavior review, licensed photoreal environment/character production, nested documentaries/profiles/maps, cinematic audio, and performance measurement with the final scene complexity. See `PRODUCTION-PLAN.md`.

## Release state

The owner authorized publication of this current prototype on 12 October 2026 after reviewing its unfinished photorealistic scope. Publication proceeds through GitHub followed by Vercel; the final deployment result establishes the live release.

