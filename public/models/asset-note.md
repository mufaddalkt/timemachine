# EPOCH 3D asset candidates

Status: geometry references for development. These are stylized, vertex-colored catalog models, not photoreal finished assets. Catalog tools expose no author, license, usage grant, or attribution requirements. Publication readiness and model rights are unverified.

Source: Higgsfield 3D Jutsu curated catalog. Retrieved 2026-10-12 through scene_builder_3d_search_assets → scene_builder_3d_import_asset → scene_builder_3d_get_glb. No direct catalog download workaround and no paid generation were used.

Study project: https://higgsfield.ai/3d-jutsu/d2bb5ce0-9c1f-4147-93ac-2e7e8baa3fcf
Final export revision: 3. Final verification query: verify-candidate-scene-01.
Final scene shown once using scene_builder_3d_show_scene at revision 3.

## Files

- city-candidates.glb — both assets, staged apart and grounded; 3,246,676 bytes. Includes a static inspection camera and Sun/Point lights. Scene lighting and world may differ in a web viewer.
- city-candidates-preview.png — inspected EEVEE camera render; colored stylized surfaces visible.
- apartment-candidate.glb — original building-only revision 1, 2,920,316 bytes; original source origin is around vertical center.
- apartment-candidate-preview.png — Workbench form inspection; Workbench displays these shader-based vertex colors as grey, so this preview is geometry evidence only.

## Provenance and dimensions

| Catalog name | Catalog asset ID | Export root | Mesh child | Blender dimensions (X,Y,Z metres) | Faces |
|---|---|---|---|---|---|
| Apartment Block 01 | 2ae77922-2fc4-45fd-8a1e-4c4fb1ef8d76 | ENV_apartment | apartment_block_01 | 7.629531, 6.789718, 13.410000 | 34,738 |
| Car Sedan 01 | 646ee81d-d37f-4137-9484-71a72125715e | VEH_sedan | car_sedan_01 | 1.203150, 3.056950, 0.962072 | 5,680 |

Blender uses Z up. glTF export uses Y up, so web dimensions (X,Y,Z) are approximately:
- Building: 7.629531, 13.410000, 6.789718.
- Sedan: 1.203150, 0.962072, 3.056950. This is small for a life-size sedan; the consuming app should choose and document any intended scale correction.

Both imported meshes have zero UV layers, zero image textures, and glTF COLOR_0 vertex colors. Materials are lowpoly and lowpoly.001 with roughness 0.92 and metallic 0.02. No animation actions were present in Blender; exported GLB has no animations array and no armature.

Combined GLB root translations (X,Y,Z, Y up):
- ENV_apartment: [0, 6.704999923706055, 0]; child translation [0.23982059955596924, -6.694999694824219, -0.11500000953674316].
- VEH_sedan: [9, 0.48099565505981445, 0]; child translation [0, -0.484254390001297, -0.7809749841690063].

Both mesh minimum world ground coordinates were verified within floating-point tolerance of zero. Keep the child translation relative to its root when extracting either asset. Root name is the easiest selector in Three.js.

## Catalog gaps

Searches human, person, character, people, woman, civilian, animated, hospital, medical, and doctor returned zero matching assets. Search man returned unrelated substring matches (e.g. manhole, mangrove). Corridor returned bunker and dungeon modules, not a hospital corridor. The metropolis search returned CATALOG_UNAVAILABLE (503); modular city and street search results were available.

No animated realistic civilian, hospital corridor, or complete inhabited streetscape was supplied by this catalog workflow. Do not represent the two candidate models as fulfilling those requirements.

## Import issue

First sedan import with a translated transform returned INVALID_ARGUMENT and changed no scene state. A fresh exact Car Sedan 01 search, followed by import of its returned importArguments without a transform, succeeded. Placement was then changed with a guarded Blender mutation after inspection.

