'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const MODEL_URL = '/models/brain.glb';

type Region = {
  id: string;
  name: string;
  /** local direction from the brain centre used to anchor the hotspot on the surface */
  dir: [number, number, number];
  blurb: string;
  relevance: string;
};

const REGIONS: Region[] = [
  {
    id: 'frontal',
    name: 'Frontal lobe',
    dir: [-0.9, 0.4, 0.25],
    blurb: 'Executive function, judgment, and personality.',
    relevance:
      'Coup–contrecoup forces in a collision frequently bruise the frontal lobes, driving the personality and executive-function changes seen after a TBI.',
  },
  {
    id: 'temporal',
    name: 'Temporal lobe',
    dir: [-0.35, -0.45, 0.85],
    blurb: 'Memory, language, and emotion.',
    relevance:
      'The temporal lobes sit against the skull base and are vulnerable in rotational injuries — often behind post-injury memory and word-finding complaints.',
  },
  {
    id: 'parietal',
    name: 'Parietal lobe',
    dir: [0.1, 0.95, 0.15],
    blurb: 'Sensory integration and spatial awareness.',
    relevance:
      'Parietal damage shows up as sensory and spatial deficits — subtle, but documentable with the right specialist.',
  },
  {
    id: 'occipital',
    name: 'Occipital lobe',
    dir: [0.95, 0.25, 0.1],
    blurb: 'Visual processing.',
    relevance:
      'Visual disturbances after head trauma can trace to the occipital cortex, even when imaging looks unremarkable.',
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    dir: [0.7, -0.6, 0.2],
    blurb: 'Balance and coordination.',
    relevance:
      'Dizziness, imbalance, and coordination problems after a concussion frequently implicate the cerebellum.',
  },
  {
    id: 'brainstem',
    name: 'Brain stem',
    dir: [0.15, -0.95, 0.1],
    blurb: 'Vital functions and consciousness.',
    relevance:
      'Brain-stem involvement signals a severe injury — and a case that demands specialist documentation.',
  },
];

const BASE_DIST = 3.4;
const FOCUS_DIST = 2.7;

/** Soft radial glow used to highlight the selected region. */
function makeGlowTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

export default function BrainExplorer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Imperative bridge between React state and the render loop.
  const api = useRef<{
    select: (id: string | null) => void;
    zoom: (factor: number) => void;
    reset: () => void;
  }>({ select: () => {}, zoom: () => {}, reset: () => {} });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, BASE_DIST);

    scene.add(new THREE.AmbientLight(0xcdeef5, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(2, 3, 2.5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x53d2f0, 1.0);
    rim.position.set(-2.5, -1, -1.5);
    scene.add(rim);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = false; // no wheel-hijack; we expose zoom buttons
    controls.rotateSpeed = 0.8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.target.set(0, 0, 0);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) controls.autoRotate = false;

    const group = new THREE.Group();
    scene.add(group);

    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x0c93b2,
      emissive: 0x05323d,
      roughness: 0.78,
      metalness: 0.06,
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x9ff3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });

    // Selection highlight — a soft glow patch dropped onto the chosen region.
    // Parented to the brain group so it tracks the lobe as the model rotates.
    const glowTex = makeGlowTexture();
    const highlightMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xffc24a,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      depthTest: false,
    });
    const highlight = new THREE.Sprite(highlightMat);
    highlight.scale.set(1.15, 1.15, 1);
    highlight.visible = false;
    highlight.renderOrder = 5;
    group.add(highlight);

    const geometries: THREE.BufferGeometry[] = [];
    const regionLocal: Record<string, THREE.Vector3> = {};
    let pickTarget: THREE.Object3D | null = null;
    const pinRay = new THREE.Raycaster();
    let disposed = false;

    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        const root = gltf.scene;

        const meshes: THREE.Mesh[] = [];
        root.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh) meshes.push(m);
        });
        meshes.forEach((m) => {
          geometries.push(m.geometry as THREE.BufferGeometry);
          m.material = solidMat;
          const wire = new THREE.Mesh(m.geometry, wireMat);
          wire.scale.setScalar(1.006);
          m.add(wire);
        });

        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = 2.5 / Math.max(size.x, size.y, size.z);
        root.scale.setScalar(scale);
        root.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        group.add(root);
        group.updateMatrixWorld(true);
        pickTarget = root;

        // Anchor each hotspot on the actual surface: raycast from outside → in.
        const ray = new THREE.Raycaster();
        REGIONS.forEach((r) => {
          const dir = new THREE.Vector3(...r.dir).normalize();
          ray.set(dir.clone().multiplyScalar(100), dir.clone().negate());
          const hit = ray.intersectObject(root, true)[0];
          // Float the anchor slightly off the surface so grazing-angle pins
          // don't get culled by the fold directly beneath them.
          regionLocal[r.id] = hit
            ? group.worldToLocal(hit.point.clone().addScaledVector(dir, 0.07))
            : dir.multiplyScalar(1.2);
        });

        setReady(true);
      },
      undefined,
      (err) => console.error('BrainExplorer: model load failed', err)
    );

    const setSize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    // --- imperative API used by the React UI ---
    let focusTarget: THREE.Vector3 | null = null;
    let selectedId: string | null = null;
    const tmp = new THREE.Vector3();
    const camDir = new THREE.Vector3();

    api.current.select = (id) => {
      selectedId = id && regionLocal[id] ? id : null;
      if (!selectedId) {
        focusTarget = null;
        controls.autoRotate = !reduce;
        highlight.visible = false;
        return;
      }
      controls.autoRotate = false;
      const local = regionLocal[selectedId];
      highlight.position.copy(local); // glow drops onto the chosen region
      const worldDir = local.clone().applyMatrix4(group.matrixWorld).normalize();
      focusTarget = worldDir.multiplyScalar(FOCUS_DIST);
    };
    api.current.zoom = (factor) => {
      const d = camera.position.length() * factor;
      camera.position.setLength(THREE.MathUtils.clamp(d, 2.1, 6));
    };
    api.current.reset = () => {
      focusTarget = null;
      selectedId = null;
      highlight.visible = false;
      controls.autoRotate = !reduce;
      camera.position.set(0, 0, BASE_DIST);
    };

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(mount);

    const w2 = () => mount.clientWidth / 2;
    const h2 = () => mount.clientHeight / 2;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      if (focusTarget) {
        camera.position.lerp(focusTarget, 0.08);
        if (camera.position.distanceTo(focusTarget) < 0.02) focusTarget = null;
      }
      controls.update();

      // Project hotspots to screen and place the HTML pins (real occlusion
      // via raycast). The SELECTED region's pin is hidden so the highlighted
      // area shows only its glow, not a dot on top of it.
      if (Object.keys(regionLocal).length) {
        const cw = w2();
        const chh = h2();
        REGIONS.forEach((r) => {
          const el = pinRefs.current[r.id];
          const local = regionLocal[r.id];
          if (!el || !local) return;
          const worldPos = local.clone().applyMatrix4(group.matrixWorld);
          tmp.copy(worldPos).project(camera);
          const x = tmp.x * cw + cw;
          const y = -tmp.y * chh + chh;

          let occluded = false;
          if (pickTarget) {
            camDir.copy(worldPos).sub(camera.position);
            const dist = camDir.length();
            pinRay.set(camera.position, camDir.normalize());
            const hit = pinRay.intersectObject(pickTarget, true)[0];
            if (hit && hit.distance < dist - 0.1) occluded = true;
          }
          const onScreen = tmp.z < 1 && !occluded;
          const showPin = onScreen && r.id !== selectedId;
          el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          el.style.opacity = showPin ? '1' : '0';
          el.style.pointerEvents = showPin ? 'auto' : 'none';
          // keep the selection glow in sync with the region's occlusion
          if (r.id === selectedId) highlight.visible = onScreen;
        });
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      geometries.forEach((g) => g.dispose());
      solidMat.dispose();
      wireMat.dispose();
      glowTex.dispose();
      highlightMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (id: string) => {
    const next = id === selected ? null : id;
    setSelected(next);
    api.current.select(next);
  };

  const active = REGIONS.find((r) => r.id === selected) || null;

  return (
    <section className="bx">
      <div className="bx-inner">
        <header className="bx-head">
          <span className="bx-eyebrow">
            <span className="bx-eyebrow-dot" />
            Interactive · Neuroanatomy
          </span>
          <h2 className="bx-title">
            Explore the <em>injured brain</em>.
          </h2>
          <p className="bx-sub">
            Drag to rotate. Select a region to see how traumatic brain injury presents — and why
            specialist documentation makes or breaks a case.
          </p>
        </header>

        <div className="bx-stage">
          <div className="bx-canvas" ref={mountRef} />

          {/* navigation hotspot pins */}
          <div className="bx-pins" aria-hidden="true">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                ref={(el) => {
                  pinRefs.current[r.id] = el;
                }}
                className={`bx-pin ${selected === r.id ? 'is-active' : ''}`}
                onClick={() => select(r.id)}
                tabIndex={-1}
              >
                <span className="bx-pin-dot" />
                <span className="bx-pin-label">{r.name}</span>
              </button>
            ))}
          </div>

          {/* view controls */}
          <div className="bx-controls">
            <button onClick={() => api.current.zoom(0.82)} aria-label="Zoom in">+</button>
            <button onClick={() => api.current.zoom(1.22)} aria-label="Zoom out">−</button>
            <button
              onClick={() => {
                setSelected(null);
                api.current.reset();
              }}
              aria-label="Reset view"
              className="bx-reset"
            >
              ↺
            </button>
          </div>

          {/* region chips */}
          <div className="bx-list">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                className={`bx-chip ${selected === r.id ? 'is-active' : ''}`}
                onClick={() => select(r.id)}
              >
                {r.name}
              </button>
            ))}
          </div>

          {/* info panel */}
          <aside className={`bx-panel ${active ? 'is-open' : ''}`}>
            {active ? (
              <>
                <span className="bx-panel-tag">{active.blurb}</span>
                <h3>{active.name}</h3>
                <p>{active.relevance}</p>
                <a className="bx-panel-cta" href="/for/tbi-doctors">
                  TBI specialists on MediLink
                  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </>
            ) : (
              <div className="bx-panel-empty">
                <span className="bx-panel-hint">{ready ? 'Select a region' : 'Loading model…'}</span>
                <p>Six regions, each with how injury there shows up in a personal-injury case.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
