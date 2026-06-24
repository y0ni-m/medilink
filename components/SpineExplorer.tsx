'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

type Region = {
  id: string;
  name: string;
  blurb: string;
  relevance: string;
};

const REGIONS: Region[] = [
  {
    id: 'cervical',
    name: 'Cervical spine · C1–C7',
    blurb: 'The neck — whiplash territory.',
    relevance:
      'The cervical spine is the most common site of injury in rear-end collisions. Whiplash and soft-tissue damage here often don’t show on early imaging — which is exactly why specialist documentation matters.',
  },
  {
    id: 'thoracic',
    name: 'Thoracic spine · T1–T12',
    blurb: 'Mid-back and rib cage.',
    relevance:
      'The thoracic spine is more rigid, so injuries here usually signal higher-energy trauma — compression fractures and rib involvement that need clear imaging and follow-up.',
  },
  {
    id: 'lumbar',
    name: 'Lumbar spine · L1–L5',
    blurb: 'Lower back — herniated discs.',
    relevance:
      'The lumbar spine bears the most load and is the classic source of chronic post-accident back pain. Disc herniations here drive a large share of personal-injury treatment.',
  },
  {
    id: 'sacrum',
    name: 'Sacrum & SI joint',
    blurb: 'The pelvic base.',
    relevance:
      'Sacroiliac joint dysfunction after an impact is easy to miss and slow to resolve — a frequent source of lingering symptoms that benefit from targeted rehab.',
  },
  {
    id: 'coccyx',
    name: 'Coccyx',
    blurb: 'The tailbone.',
    relevance:
      'Coccyx injuries (coccydynia) commonly follow slip-and-fall cases. Painful and persistent, they’re worth documenting carefully.',
  },
];

const BASE_DIST = 3.7;
const FOCUS_DIST = 3.0;

// Base teal of the column, and the highlight applied to a selected region.
const BASE_COLOR = new THREE.Color(0x0c93b2);
const HIGHLIGHT_COLOR = new THREE.Color(0xffb347);

type BuiltSpine = {
  geometry: THREE.BufferGeometry;
  regionLocal: Record<string, THREE.Vector3>;
  // Per region, the contiguous vertex ranges [start, count] in the merged geometry.
  regionRanges: Record<string, Array<[number, number]>>;
};

/**
 * Procedurally build a vertebral column. Unlike the brain (whose gyri can't be
 * faked), a spine is a repeating stack of vertebrae following the natural
 * sagittal S-curve — which generates cleanly and recognizably in code.
 *
 * For each vertebra we build a body (cylinder), a posterior spinous process
 * (cone, angled down), and two small transverse processes, transform them into
 * column space, and merge everything into one geometry so it renders exactly
 * like the brain (shaded teal solid + wireframe overlay).
 */
function buildSpine(): BuiltSpine {
  // [region, count, bodyRadius, bodyHeight] from top (cervical) to bottom.
  const PLAN: [string, number, number, number][] = [
    ['cervical', 7, 0.12, 0.12],
    ['thoracic', 12, 0.17, 0.15],
    ['lumbar', 5, 0.22, 0.19],
  ];

  const parts: THREE.BufferGeometry[] = [];
  // Region tag per pushed part, parallel to `parts`, so we can compute
  // per-region vertex ranges after merging (mergeGeometries concatenates
  // vertices in push order).
  const partRegions: string[] = [];
  const pushPart = (region: string, g: THREE.BufferGeometry) => {
    parts.push(g);
    partRegions.push(region);
  };
  const regionCentroids: Record<string, THREE.Vector3> = {};
  const regionCounts: Record<string, number> = {};

  let y = 0; // grows downward (negative)
  let tGlobal = 0;
  const totalUnits = 7 + 12 + 5;

  const addCentroid = (id: string, v: THREE.Vector3) => {
    if (!regionCentroids[id]) {
      regionCentroids[id] = v.clone();
      regionCounts[id] = 1;
    } else {
      regionCentroids[id].add(v);
      regionCounts[id] += 1;
    }
  };

  // Sagittal S-curve: anterior is +Z. ~1.5 cycles over the column.
  const curveZ = (t: number) => 0.42 * Math.sin(t * 9.4 - 0.3);

  for (const [region, count, r, bodyH] of PLAN) {
    for (let i = 0; i < count; i++) {
      const t = tGlobal / (totalUnits - 1);
      const z = curveZ(t);
      const center = new THREE.Vector3(0, y, z);

      // vertebral body
      const body = new THREE.CylinderGeometry(r, r * 1.04, bodyH, 16, 1);
      body.translate(0, y, z);
      pushPart(region, body);

      // spinous process — cone pointing posterior (−Z), angled downward
      const procLen = r * 2.2;
      const proc = new THREE.ConeGeometry(r * 0.42, procLen, 8);
      proc.rotateX(-Math.PI / 2 - 0.55); // point −Z and tilt down
      proc.translate(0, y - procLen * 0.18, z - r - procLen * 0.32);
      pushPart(region, proc);

      // transverse processes — small stubs to the sides
      for (const sx of [-1, 1]) {
        const tp = new THREE.ConeGeometry(r * 0.3, r * 1.1, 6);
        tp.rotateZ((sx * Math.PI) / 2);
        tp.translate(sx * (r + r * 0.45), y, z);
        pushPart(region, tp);
      }

      addCentroid(region, center);
      y -= bodyH + bodyH * 0.42; // disc gap
      tGlobal += 1;
    }
  }

  // Sacrum — a tapered fused block.
  const sacrum = new THREE.CylinderGeometry(0.26, 0.12, 0.46, 18, 1);
  const sacrumZ = curveZ(1) - 0.08;
  sacrum.translate(0, y - 0.23, sacrumZ);
  pushPart('sacrum', sacrum);
  addCentroid('sacrum', new THREE.Vector3(0, y - 0.18, sacrumZ));
  y -= 0.46;

  // Coccyx — small tailbone nub.
  const coccyx = new THREE.ConeGeometry(0.08, 0.22, 10);
  coccyx.rotateX(Math.PI); // point down
  const coccyxZ = sacrumZ - 0.06;
  coccyx.translate(0, y - 0.11, coccyxZ);
  pushPart('coccyx', coccyx);
  addCentroid('coccyx', new THREE.Vector3(0, y - 0.11, coccyxZ));

  // Compute per-region vertex ranges in push order (mergeGeometries
  // concatenates vertices in this same order). Adjacent same-region parts are
  // coalesced into one [start, count] range.
  const regionRanges: Record<string, Array<[number, number]>> = {};
  let cursor = 0;
  for (let i = 0; i < parts.length; i++) {
    const region = partRegions[i];
    const vcount = parts[i].attributes.position.count;
    const ranges = (regionRanges[region] ??= []);
    const last = ranges[ranges.length - 1];
    if (last && last[0] + last[1] === cursor) {
      last[1] += vcount;
    } else {
      ranges.push([cursor, vcount]);
    }
    cursor += vcount;
  }

  // merge → single geometry
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  merged.computeVertexNormals();

  // Per-vertex color attribute, initialized to the base teal everywhere.
  const vtxCount = merged.attributes.position.count;
  const colors = new Float32Array(vtxCount * 3);
  for (let i = 0; i < vtxCount; i++) {
    colors[i * 3] = BASE_COLOR.r;
    colors[i * 3 + 1] = BASE_COLOR.g;
    colors[i * 3 + 2] = BASE_COLOR.b;
  }
  merged.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // center + scale to a consistent size
  merged.computeBoundingBox();
  const box = merged.boundingBox!;
  const center = new THREE.Vector3();
  box.getCenter(center);
  const size = new THREE.Vector3();
  box.getSize(size);
  const scale = 2.5 / Math.max(size.x, size.y, size.z);

  merged.translate(-center.x, -center.y, -center.z);
  merged.scale(scale, scale, scale);

  const regionLocal: Record<string, THREE.Vector3> = {};
  for (const id of Object.keys(regionCentroids)) {
    const v = regionCentroids[id].multiplyScalar(1 / regionCounts[id]);
    v.sub(center).multiplyScalar(scale);
    v.z += 0.12; // float the anchor slightly in front of the column
    regionLocal[id] = v;
  }

  return { geometry: merged, regionLocal, regionRanges };
}

export default function SpineExplorer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

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
    controls.enableZoom = false;
    controls.rotateSpeed = 0.8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.target.set(0, 0, 0);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) controls.autoRotate = false;

    const group = new THREE.Group();
    scene.add(group);

    const solidMat = new THREE.MeshStandardMaterial({
      // White base so per-vertex colors show faithfully
      // (final diffuse = material.color × vertexColor).
      color: 0xffffff,
      vertexColors: true,
      emissive: 0x05323d,
      roughness: 0.72,
      metalness: 0.08,
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x9ff3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    });

    const { geometry, regionLocal, regionRanges } = buildSpine();
    const solid = new THREE.Mesh(geometry, solidMat);
    group.add(solid);
    const wire = new THREE.Mesh(geometry, wireMat);
    wire.scale.setScalar(1.008);
    group.add(wire);
    const pickTarget = solid;

    // Recolor the merged geometry's vertex colors: highlight the selected
    // region's vertex ranges, base teal everywhere else.
    const colorAttr = geometry.attributes.color as THREE.BufferAttribute;
    const recolor = (id: string | null) => {
      const arr = colorAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i] = BASE_COLOR.r;
        arr[i + 1] = BASE_COLOR.g;
        arr[i + 2] = BASE_COLOR.b;
      }
      if (id && regionRanges[id]) {
        for (const [start, count] of regionRanges[id]) {
          for (let v = start; v < start + count; v++) {
            arr[v * 3] = HIGHLIGHT_COLOR.r;
            arr[v * 3 + 1] = HIGHLIGHT_COLOR.g;
            arr[v * 3 + 2] = HIGHLIGHT_COLOR.b;
          }
        }
      }
      colorAttr.needsUpdate = true;
    };

    group.updateMatrixWorld(true);
    setReady(true);

    // Fit the model to the canvas at any aspect — a portrait phone would
    // otherwise crop the column. Pull the camera back so the model's bounding
    // sphere fits the NARROWER of the vertical/horizontal field of view.
    geometry.computeBoundingSphere();
    const modelRadius = geometry.boundingSphere?.radius ?? 1.3;
    let baseDist = BASE_DIST;
    let autoFit = true;
    const fitDist = () => {
      const vFov = (camera.fov * Math.PI) / 180;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (camera.aspect || 1));
      return (modelRadius / Math.sin(Math.min(vFov, hFov) / 2)) * 1.1;
    };
    const setSize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      baseDist = fitDist();
      if (autoFit) camera.position.setLength(baseDist);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    let focusTarget: THREE.Vector3 | null = null;
    let selectedId: string | null = null;
    const tmp = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const pinRay = new THREE.Raycaster();

    api.current.select = (id) => {
      selectedId = id && regionLocal[id] ? id : null;
      recolor(selectedId);
      if (!selectedId) {
        focusTarget = null;
        autoFit = true;
        camera.position.setLength(baseDist);
        controls.autoRotate = !reduce;
        return;
      }
      autoFit = false;
      controls.autoRotate = false;
      const local = regionLocal[selectedId];
      const worldDir = local.clone().applyMatrix4(group.matrixWorld).normalize();
      focusTarget = worldDir.multiplyScalar(baseDist * 0.82);
    };
    api.current.zoom = (factor) => {
      autoFit = false;
      const d = camera.position.length() * factor;
      camera.position.setLength(THREE.MathUtils.clamp(d, baseDist * 0.5, baseDist * 2.2));
    };
    api.current.reset = () => {
      focusTarget = null;
      selectedId = null;
      recolor(null);
      autoFit = true;
      controls.autoRotate = !reduce;
      camera.position.set(0, 0, baseDist);
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
          camDir.copy(worldPos).sub(camera.position);
          const dist = camDir.length();
          pinRay.set(camera.position, camDir.normalize());
          const hit = pinRay.intersectObject(pickTarget, true)[0];
          if (hit && hit.distance < dist - 0.12) occluded = true;

          const onScreen = tmp.z < 1 && !occluded;
          const showPin = onScreen && r.id !== selectedId;
          el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          el.style.opacity = showPin ? '1' : '0';
          el.style.pointerEvents = showPin ? 'auto' : 'none';
        });
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      geometry.dispose();
      solidMat.dispose();
      wireMat.dispose();
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
            Interactive · Spinal anatomy
          </span>
          <h2 className="bx-title">
            Explore the <em>injured spine</em>.
          </h2>
          <p className="bx-sub">
            Drag to rotate. Select a region to see how spinal injury presents — and where chiropractic
            and rehab care fits in a personal-injury case.
          </p>
        </header>

        <div className="bx-stage">
          <div className="bx-canvas" ref={mountRef} />

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

          <aside className={`bx-panel ${active ? 'is-open' : ''}`}>
            {active ? (
              <>
                <span className="bx-panel-tag">{active.blurb}</span>
                <h3>{active.name}</h3>
                <p>{active.relevance}</p>
                <a className="bx-panel-cta" href="/for/chiropractors">
                  Chiropractic & rehab on MediLink
                  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </>
            ) : (
              <div className="bx-panel-empty">
                <span className="bx-panel-hint">{ready ? 'Select a region' : 'Building model…'}</span>
                <p>Five regions, each with how injury there shows up in a personal-injury case.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
