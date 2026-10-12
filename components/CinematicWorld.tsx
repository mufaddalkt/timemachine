"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { acquireModel, releaseModel } from "../lib/model-cache";
import {
  filmState as defaultFilm,
  shots,
  shotRails,
  type WorldKind,
  type FilmState,
} from "../lib/cinema";
const FilmClock = createContext<FilmState>(defaultFilm);
function useModel(url: string) {
  const [asset, setAsset] = useState<GLTF | null>(null);
  useEffect(() => {
    let live = true;
    acquireModel(url)
      .then((g) => {
        if (live) setAsset(g);
      })
      .catch(() => {
        if (live) setAsset(null);
      });
    return () => {
      live = false;
      releaseModel(url);
    };
  }, [url]);
  return asset;
}
function Model({
  rootName,
  position,
  rotation = 0,
  height = 12,
}: {
  rootName: string;
  position: [number, number, number];
  rotation?: number;
  height?: number;
}) {
  const asset = useModel("/models/city-candidates.glb");
  const group = useMemo(() => {
    if (!asset) return null;
    const object = asset.scene.getObjectByName(rootName);
    if (!object) return null;
    const scene = object.clone(true);
    scene.position.set(0, 0, 0);
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = height / Math.max(0.01, size.y);
    const wrapper = new THREE.Group();
    scene.position.set(-center.x * s, -box.min.y * s, -center.z * s);
    scene.scale.setScalar(s);
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    wrapper.add(scene);
    return wrapper;
  }, [asset, height, rootName]);
  return group ? (
    <group position={position} rotation={[0, rotation, 0]}>
      <primitive object={group} />
    </group>
  ) : null;
}
function Inhabitant({
  index,
  origin,
  hospital = false,
}: {
  index: number;
  origin: number;
  hospital?: boolean;
}) {
  const filmState = useContext(FilmClock);
  const { gl } = useThree();
  const person = useModel("/models/soldier.glb");
  const walk = person;
  const ref = useRef<THREE.Group>(null);
  const character = useMemo(() => {
    if (!person || !walk) return null;
    const body = cloneSkeleton(person.scene);
    const names = new Map<string, string>();
    body.traverse((n) => {
      if (n instanceof THREE.Bone)
        names.set(
          n.name.replace(/^.*[:|]/, "").replace(/^mixamorig/, ""),
          n.name,
        );
      if (n instanceof THREE.Mesh) {
        n.castShadow = true;
        n.receiveShadow = true;
      }
    });
    const original = walk.animations.find((a) => a.name === "Walk");
    if (!original) return null;
    const clip = original.clone();
    const mixer = new THREE.AnimationMixer(body);
    mixer.clipAction(clip).play();
    const box = new THREE.Box3().setFromObject(body);
    const scale = 1.7 / Math.max(0.1, box.max.y - box.min.y);
    body.scale.setScalar(scale);
    body.position.y = -box.min.y * scale;
    return { body, mixer, clip };
  }, [person, walk]);
  useEffect(
    () => () => {
      if (character) {
        character.mixer.stopAllAction();
        character.mixer.uncacheRoot(character.body);
      }
    },
    [character],
  );
  useFrame(() => {
    if (!character || !ref.current) return;
    const t = filmState.progress * 120;
    character.mixer.setTime(t + index * 0.4);
    const z = 8 - ((t * 0.7 + index * 5) % 32);
    ref.current.position.set(
      hospital ? (index % 2 ? 1.4 : -1.4) : index % 2 ? 5.8 : -5.8,
      0,
      z + origin,
    );
    ref.current.rotation.y = index % 2 ? Math.PI : 0;
    if (process.env.NODE_ENV === "development" && index === 0) {
      gl.domElement.dataset.animationTime = character.mixer.time.toFixed(4);
      gl.domElement.dataset.animationTracks = String(
        character.clip.tracks.length,
      );
    }
  });
  return character ? (
    <group ref={ref}>
      <primitive object={character.body} />
    </group>
  ) : null;
}
function WindowGrid({
  x,
  z,
  width,
  height,
}: {
  x: number;
  z: number;
  width: number;
  height: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const rows = Math.floor(height / 2.3),
    cols = Math.floor(width / 1.3);
  const count = rows * cols;
  useEffect(() => {
    const m = new THREE.Matrix4();
    let index = 0;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        m.makeTranslation(x, (r + 1) * 2.3, z + (c - cols / 2) * 1.3);
        ref.current?.setMatrixAt(index++, m);
      }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [x, z, rows, cols]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.02, 1.1, 0.75]} />
      <meshStandardMaterial
        color="#a0bed0"
        emissive="#7dabc2"
        emissiveIntensity={0.35}
        roughness={0.15}
        metalness={0.8}
      />
    </instancedMesh>
  );
}
function Traffic({ index }: { index: number }) {
  const filmState = useContext(FilmClock);
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      const t = filmState.progress * 180;
      ref.current.position.z = 16 - ((t * 2 + index * 11) % 50);
    }
  });
  return (
    <group ref={ref}>
      <Model
        rootName="VEH_sedan"
        position={[index % 2 ? 1.7 : -1.7, 0, 0]}
        rotation={index % 2 ? Math.PI : 0}
        height={1.45}
      />
    </group>
  );
}
function City({
  origin,
  onMarker,
  active,
}: {
  origin: number;
  onMarker: () => void;
  active: boolean;
}) {
  return (
    <group position={[0, 0, origin]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        position={[0, -0.025, -4]}
      >
        <planeGeometry args={[28, 68]} />
        <meshPhysicalMaterial
          color="#19222a"
          roughness={0.24}
          metalness={0.45}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          {[0, 1, 2, 3, 4].map((i) => (
            <group key={i}>
              <Model
                rootName="ENV_apartment"
                position={[side * 10, 0, 16 - i * 14]}
                rotation={side === 1 ? Math.PI / 2 : -Math.PI / 2}
                height={17 + (i % 2) * 7}
              />
              <WindowGrid
                x={side * 6.9}
                z={16 - i * 14}
                width={11}
                height={16}
              />
              <mesh position={[side * 5.7, 0.09, 16 - i * 14]} receiveShadow>
                <boxGeometry args={[3.1, 0.18, 14]} />
                <meshStandardMaterial color="#474d4f" roughness={0.85} />
              </mesh>
              <mesh position={[side * 4.5, 3.2, 14 - i * 14]} castShadow>
                <cylinderGeometry args={[0.04, 0.08, 6.4, 8]} />
                <meshStandardMaterial color="#30383b" metalness={0.7} />
              </mesh>
              <pointLight
                position={[side * 4.5, 6.5, 14 - i * 14]}
                color="#e8bf81"
                intensity={30}
                distance={16}
                decay={2}
              />
              <mesh position={[side * 4.5, 6.45, 14 - i * 14]}>
                <sphereGeometry args={[0.14, 8, 8]} />
                <meshBasicMaterial color="#ecd5ae" />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {active &&
        Array.from({ length: 15 }, (_, i) => (
          <mesh
            key={i}
            position={[0, -0.024, 20 - i * 4]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.11, 1.6]} />
            <meshStandardMaterial color="#b1aca0" roughness={0.6} />
          </mesh>
        ))}
      {active && [0, 1, 2].map((i) => <Traffic key={i} index={i} />)}
      <mesh
        position={[5.4, 2.5, -5]}
        onClick={onMarker}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <torusGeometry args={[0.27, 0.03, 8, 32]} />
        <meshBasicMaterial color="#d2c4a7" />
      </mesh>
    </group>
  );
}
function Hospital({
  origin,
  onMarker,
}: {
  origin: number;
  onMarker: () => void;
}) {
  return (
    <group position={[0, 0, origin]}>
      <mesh position={[0, -0.05, -4]} receiveShadow>
        <boxGeometry args={[7, 0.1, 55]} />
        <meshStandardMaterial
          color="#78929b"
          roughness={0.27}
          metalness={0.18}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 3.5, 2, -4]}>
            <boxGeometry args={[0.2, 4, 55]} />
            <meshStandardMaterial color="#b7c7cb" roughness={0.8} />
          </mesh>
          {Array.from({ length: 7 }, (_, i) => (
            <group key={i}>
              <mesh position={[side * 3.37, 1.5, 12 - i * 6]}>
                <boxGeometry args={[0.06, 2.9, 1.9]} />
                <meshStandardMaterial color="#5c7d86" roughness={0.7} />
              </mesh>
              <mesh position={[side * 3.3, 1.9, 12 - i * 6]}>
                <boxGeometry args={[0.04, 0.6, 0.9]} />
                <meshPhysicalMaterial
                  color="#afd3d9"
                  transparent
                  opacity={0.5}
                  roughness={0.1}
                />
              </mesh>
              <mesh position={[side * 3.28, 1.15, 11.4 - i * 6]}>
                <boxGeometry args={[0.04, 0.04, 0.25]} />
                <meshStandardMaterial
                  color="#aab2b6"
                  metalness={1}
                  roughness={0.2}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      <mesh position={[0, 4, -4]}>
        <boxGeometry args={[7, 0.15, 55]} />
        <meshStandardMaterial color="#849ca4" />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <group key={i}>
          <mesh position={[0, 3.88, 16 - i * 6]}>
            <boxGeometry args={[1.8, 0.03, 0.4]} />
            <meshBasicMaterial color="#d3edf2" />
          </mesh>
          <pointLight
            position={[0, 3.6, 16 - i * 6]}
            intensity={18}
            color="#b7dae8"
            distance={8}
          />
        </group>
      ))}
      <mesh position={[1.8, 1.5, -6]} onClick={onMarker}>
        <torusGeometry args={[0.23, 0.035, 8, 24]} />
        <meshBasicMaterial color="#d2c4a7" />
      </mesh>
      <group position={[2.5, 0, -7]}>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.6, 1.3, 0.6]} />
          <meshStandardMaterial color="#6c8793" metalness={0.3} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[0.7, 0.45, 0.06]} />
          <meshStandardMaterial
            color="#101e25"
            emissive="#427b87"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  );
}
function ArchiveSpace({ origin, world }: { origin: number; world: WorldKind }) {
  const filmState = useContext(FilmClock);
  return (
    <group position={[0, 0, origin]}>
      {world === "earth" ? (
        <>
          <mesh position={[0, 4, -9]}>
            <sphereGeometry args={[7, 48, 32]} />
            <meshStandardMaterial
              color={filmState.shot > shots.length - 3 ? "#541b0e" : "#38596b"}
              roughness={0.9}
              emissive={
                filmState.shot > shots.length - 3 ? "#963211" : "#142630"
              }
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0, 4, -9]}>
            <sphereGeometry args={[7.1, 32, 24]} />
            <meshBasicMaterial
              color="#93b4c4"
              transparent
              opacity={0.025}
              side={THREE.BackSide}
            />
          </mesh>
        </>
      ) : null}
    </group>
  );
}
function Director({
  index,
  onMarker,
}: {
  index: number;
  onMarker: () => void;
}) {
  const filmState = useContext(FilmClock);
  const { camera, scene, gl } = useThree();
  const fog = useMemo(() => new THREE.FogExp2("#17242d", 0.017), []);
  const background = useMemo(() => new THREE.Color("#17242d"), []);
  const ca = useMemo(() => new THREE.Color(), []),
    cb = useMemo(() => new THREE.Color(), []);
  const position = useMemo(() => new THREE.Vector3(), []),
    look = useMemo(() => new THREE.Vector3(), []);
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    shots.forEach((s, i) => {
      const rail = shotRails[s.world];
      points.push(new THREE.Vector3(rail.from[0], rail.from[1], 18 - i * 40));
      points.push(new THREE.Vector3(rail.to[0], rail.to[1], -2 - i * 40));
    });
    points.push(new THREE.Vector3(0, 5, -shots.length * 40 + 18));
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.3);
  }, []);
  useEffect(() => {
    scene.fog = fog;
    scene.background = background;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.88;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog, background, gl]);
  useFrame(() => {
    const p = filmState.progress;
    curve.getPoint(Math.min(0.999999, p), position);
    curve.getPoint(Math.min(1, p + 0.0035), look);
    camera.position.copy(position);
    camera.lookAt(look);
    ca.set(shots[filmState.shot]?.color || "#adc5d6").multiplyScalar(0.1);
    cb.set(
      shots[Math.min(shots.length - 1, filmState.shot + 1)]?.color || "#adc5d6",
    ).multiplyScalar(0.1);
    background
      .copy(ca)
      .lerp(cb, THREE.MathUtils.smoothstep(filmState.local, 0.72, 1));
    fog.color.copy(background);
    fog.density = shots[filmState.shot]?.world === "hospital" ? 0.026 : 0.014;
    if (process.env.NODE_ENV === "development") {
      gl.domElement.dataset.cameraPosition = camera.position
        .toArray()
        .map((v) => v.toFixed(3))
        .join(",");
      gl.domElement.dataset.filmProgress = p.toFixed(6);
      gl.domElement.dataset.drawCalls = String(gl.info.render.calls);
      gl.domElement.dataset.triangles = String(gl.info.render.triangles);
    }
  });
  const visible = [index - 1, index, index + 1].filter(
    (i) => i >= 0 && i < shots.length,
  );
  return (
    <>
      <ambientLight intensity={0.65} color="#aabecd" />
      <directionalLight
        position={[7, 25, 30 - index * 40]}
        color={shots[index]?.color}
        intensity={2.3}
        castShadow
        shadow-mapSize={[
          filmState.quality === "mobile" ? 512 : 1024,
          filmState.quality === "mobile" ? 512 : 1024,
        ]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      {visible.map((i) => {
        const s = shots[i];
        return s.world === "city" ? (
          <City
            key={i}
            active={i === index}
            origin={-i * 40}
            onMarker={onMarker}
          />
        ) : s.world === "hospital" ? (
          <Hospital key={i} origin={-i * 40} onMarker={onMarker} />
        ) : (
          <ArchiveSpace key={i} origin={-i * 40} world={s.world} />
        );
      })}
      {(shots[index]?.world === "city" || shots[index]?.world === "hospital") &&
        Array.from(
          {
            length:
              shots[index]?.world === "hospital"
                ? 2
                : filmState.quality === "mobile"
                  ? 3
                  : 6,
          },
          (_, i) => (
            <Inhabitant
              key={`${shots[index]?.world}-${i}`}
              index={i}
              origin={-index * 40}
              hospital={shots[index]?.world === "hospital"}
            />
          ),
        )}
    </>
  );
}
export default function CinematicWorld({
  index,
  clock,
  onMarker,
  onReady,
}: {
  index: number;
  clock: FilmState;
  onMarker: () => void;
  onReady: () => void;
}) {
  useEffect(
    () => () => {
      clock.invalidate = undefined;
    },
    [clock],
  );
  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 1.25]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 2, 18], fov: 55, near: 0.1, far: 180 }}
      onCreated={({ invalidate }) => {
        clock.invalidate = invalidate;
        onReady();
      }}
      aria-label="Interactive 3D cinematic engine preview"
    >
      <FilmClock.Provider value={clock}>
        <Director index={index} onMarker={onMarker} />
      </FilmClock.Provider>
    </Canvas>
  );
}
