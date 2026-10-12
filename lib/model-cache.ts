import {
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
type Entry = {
  promise: Promise<GLTF>;
  asset?: GLTF;
  leases: number;
  timer?: ReturnType<typeof setTimeout>;
};
const cache = new Map<string, Entry>();
const loader = new GLTFLoader();
export function acquireModel(url: string): Promise<GLTF> {
  let item = cache.get(url);
  if (!item) {
    item = { promise: loader.loadAsync(url), leases: 0 };
    cache.set(url, item);
    const entry = item;
    entry.promise
      .then((asset) => {
        entry.asset = asset;
      })
      .catch(() => {
        if (cache.get(url) === entry) cache.delete(url);
      });
  }
  if (item.timer) clearTimeout(item.timer);
  item.leases++;
  return item.promise;
}
export function releaseModel(url: string) {
  const item = cache.get(url);
  if (!item) return;
  item.leases = Math.max(0, item.leases - 1);
  if (item.leases) return;
  item.timer = setTimeout(() => {
    if (item.leases || cache.get(url) !== item) return;
    const textures = new Set<THREE.Texture>();
    const materials = new Set<THREE.Material>();
    const geometries = new Set<THREE.BufferGeometry>();
    item.asset?.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        geometries.add(o.geometry);
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
          materials.add(m);
          Object.values(m).forEach((v) => {
            if (v instanceof THREE.Texture) textures.add(v);
          });
        });
      }
    });
    textures.forEach((t) => t.dispose());
    materials.forEach((m) => m.dispose());
    geometries.forEach((g) => g.dispose());
    cache.delete(url);
  }, 4000);
}
export function assetCacheSnapshot() {
  return [...cache].map(([url, item]) => ({
    url,
    leases: item.leases,
    ready: !!item.asset,
  }));
}
