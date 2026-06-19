'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = '/models/brain.glb';

export default function BrainStage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL unavailable — leave the area empty rather than crash.
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 3.8);

    // Lights — shade the gyri so the folds are visible under the wireframe.
    scene.add(new THREE.AmbientLight(0xdff6fb, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(2, 3, 2.5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x57d0ec, 0.8);
    rim.position.set(-2.5, -1, 1.5);
    scene.add(rim);

    // Shared materials.
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x0c7e98,
      emissive: 0x04222a,
      roughness: 0.82,
      metalness: 0.05,
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xa6f4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });

    const group = new THREE.Group();
    scene.add(group);

    let disposed = false;
    const geometries: THREE.BufferGeometry[] = [];

    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        const root = gltf.scene;

        // Collect meshes FIRST — mutating the tree during traverse() would make
        // it recurse into the wire overlays we add (also meshes) forever.
        const meshes: THREE.Mesh[] = [];
        root.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh) meshes.push(mesh);
        });

        // Re-skin every mesh in teal + add a wireframe overlay just outside it.
        meshes.forEach((mesh) => {
          geometries.push(mesh.geometry as THREE.BufferGeometry);
          mesh.material = solidMat;
          const wire = new THREE.Mesh(mesh.geometry, wireMat);
          wire.scale.setScalar(1.006);
          mesh.add(wire);
        });

        // Normalize: center at origin and scale to a consistent size.
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = 2.6 / Math.max(size.x, size.y, size.z);
        root.scale.setScalar(scale);
        root.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        group.add(root);
      },
      undefined,
      (err) => console.error('BrainStage: failed to load model', err)
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

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let start = 0;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(mount);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return; // pause when scrolled offscreen
      if (!start) start = now;
      const t = (now - start) / 1000;
      if (reduce) {
        group.rotation.y = 0.5;
      } else {
        group.rotation.y = 0.4 + Math.sin(t * 0.16) * 0.6; // gentle sway
        group.rotation.x = Math.sin(t * 0.5) * 0.05;
        group.position.y = Math.sin(t * 0.7) * 0.04;
      }
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      geometries.forEach((g) => g.dispose());
      solidMat.dispose();
      wireMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="brain-stage" ref={mountRef} aria-hidden="true" />;
}
