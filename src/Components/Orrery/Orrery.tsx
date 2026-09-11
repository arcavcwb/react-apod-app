import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { STATIONS, StationId } from './orrery.config';

// Atlas palette (mirrors the CSS tokens): starlight bodies, graticule orbits, red light on the active one.
const STAR = 0xf2f0ea;
const COPY = 0xd9d6ce;
const LINE = 0x66666d;
const RED = 0xff5a47;

interface OrreryProps {
  activeId: StationId | null;
  onHover: (id: StationId | null) => void;
}

/** Decorative 3D navigator. The accessible navigation is the link list beside it. */
const Orrery: React.FC<OrreryProps> = ({ activeId, onHover }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  // The render loop reads these refs, so React never re-renders per frame.
  const activeRef = useRef(activeId);
  const hoverRef = useRef<StationId | null>(null);
  const onHoverRef = useRef(onHover);
  const navigateRef = useRef(navigate);
  const invalidateRef = useRef<() => void>(() => {});

  useEffect(() => {
    onHoverRef.current = onHover;
    navigateRef.current = navigate;
  }, [onHover, navigate]);

  useEffect(() => {
    activeRef.current = activeId;
    invalidateRef.current();
  }, [activeId]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return; // No WebGL: the link list still works.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 400);
    const baseCam = new THREE.Vector3(0, 19, 28);
    camera.position.copy(baseCam);
    camera.lookAt(0, 0, 0);

    // Field-edition sky: white points on black, like the atlas plates.
    const starPositions = new Float32Array(1600 * 3);
    for (let i = 0; i < starPositions.length; i += 3) {
      const r = 30 + Math.random() * 110;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
      starPositions[i + 2] = r * Math.cos(phi);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: STAR, size: 0.12, transparent: true, opacity: 0.55 })
    );
    scene.add(stars);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const sunLight = new THREE.PointLight(0xffffff, 60, 0, 1.6);
    scene.add(sunLight);

    const sun = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 32), new THREE.MeshBasicMaterial({ color: STAR }));
    scene.add(sun);

    const bodies = STATIONS.map((station, i) => {
      const orbit = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          new THREE.EllipseCurve(0, 0, station.radius, station.radius * 0.96).getPoints(160).map((p) => new THREE.Vector3(p.x, 0, p.y))
        ),
        new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.7 })
      );
      orbit.rotation.x = station.inclination;
      scene.add(orbit);

      const group = new THREE.Group();
      group.rotation.x = station.inclination;
      scene.add(group);

      const material = new THREE.MeshStandardMaterial({ color: COPY, roughness: 0.85, metalness: 0, emissive: RED, emissiveIntensity: 0 });
      const body =
        station.kind === 'probe'
          ? new THREE.Mesh(new THREE.BoxGeometry(station.size * 0.8, station.size * 0.8, station.size * 1.2), material)
          : new THREE.Mesh(new THREE.SphereGeometry(station.size, 32, 32), material);

      if (station.kind === 'probe') {
        const wings = new THREE.Mesh(
          new THREE.BoxGeometry(station.size * 2.6, 0.03, station.size * 0.6),
          new THREE.MeshStandardMaterial({ color: LINE, roughness: 0.6 })
        );
        body.add(wings);
      }
      if (station.hasRing) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(station.size * 1.4, station.size * 2.1, 64),
          new THREE.MeshBasicMaterial({ color: COPY, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
        );
        ring.rotation.x = Math.PI / 2.6;
        body.add(ring);
      }
      let moon: THREE.Group | undefined;
      if (station.hasMoon) {
        moon = new THREE.Group();
        const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial({ color: COPY, roughness: 0.9 }));
        moonMesh.position.x = 1.2;
        moon.add(moonMesh);
        body.add(moon);
      }

      body.userData.id = station.id;
      group.add(body);
      return { station, group, body, material, orbit, moon, angle: (i * Math.PI * 2) / STATIONS.length, scale: 1 };
    });

    const pointer = new THREE.Vector2(-9, -9);
    const parallax = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const timer = new THREE.Timer();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let visible = false;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      camera.aspect = w / h;
      // Pull the camera back so the outer orbit stays in frame, more on narrow screens.
      camera.position.setLength(baseCam.length() * Math.max(1.45, 1.8 / camera.aspect));
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      invalidate();
    };

    const setHover = (id: StationId | null) => {
      if (id === hoverRef.current) return;
      hoverRef.current = id;
      canvas.style.cursor = id ? 'pointer' : 'default';
      onHoverRef.current(id);
    };

    const draw = (dt: number, elapsed: number) => {
      const lit = hoverRef.current ?? activeRef.current;
      stars.rotation.y = elapsed * 0.006;
      camera.position.x += (parallax.x * 1.6 - camera.position.x) * 0.04;
      camera.lookAt(0, 0, 0);

      for (const b of bodies) {
        const isLit = b.station.id === lit;
        b.angle += b.station.speed * dt * (isLit ? 0.25 : 1);
        b.group.position.set(Math.cos(b.angle) * b.station.radius, 0, Math.sin(b.angle) * b.station.radius * 0.96);
        b.body.rotation.y += dt * 0.5;
        if (b.moon) b.moon.rotation.y += dt * 1.4;
        b.scale += ((isLit ? 1.3 : 1) - b.scale) * Math.min(1, dt * 8);
        b.body.scale.setScalar(b.scale);
        b.material.emissiveIntensity = isLit ? 0.9 : 0;
        (b.orbit.material as THREE.LineBasicMaterial).color.setHex(isLit ? RED : LINE);
      }

      setHover(pick());
      renderer.render(scene, camera);
    };

    const meshes = bodies.map((b) => b.body);
    function pick(): StationId | null {
      raycaster.setFromCamera(pointer, camera);
      let target: THREE.Object3D | null = raycaster.intersectObjects(meshes, true)[0]?.object ?? null;
      while (target && !target.userData.id) target = target.parent;
      return (target?.userData.id as StationId | undefined) ?? null;
    }

    const loop = (time: number) => {
      timer.update(time);
      draw(Math.min(timer.getDelta(), 0.1), timer.getElapsed());
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frame || !visible || document.hidden) return;
      if (reducedMotion) {
        draw(0, 0);
        return;
      }
      timer.reset();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    // With reduced motion there is no loop: redraw once whenever something changes.
    function invalidate() {
      if (reducedMotion && visible) draw(0, 0);
    }
    invalidateRef.current = invalidate;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(container);
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      if (!reducedMotion) parallax.x = pointer.x;
      invalidate();
    };
    const onPointerLeave = () => {
      pointer.set(-9, -9);
      parallax.x = 0;
      invalidate();
    };
    // A tap may arrive with no pointermove before it, so pick at the click position itself.
    const onClick = (e: MouseEvent) => {
      onPointerMove(e as PointerEvent);
      const station = STATIONS.find((s) => s.id === pick());
      if (station) navigateRef.current(station.path);
    };
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('click', onClick);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('click', onClick);
      invalidateRef.current = () => {};
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
    </div>
  );
};

export default Orrery;
