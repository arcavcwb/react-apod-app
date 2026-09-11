import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { ORBITAL_STATIONS, OrbitalStationConfig } from './orbital3d.config';
import { navigateWithViewTransition } from '../../utils/navigation';
import nasa from '../../Assets/nasa.png';
import { BiRocket, BiImages, BiInfoCircle, BiTargetLock, BiRadioCircleMarked } from 'react-icons/bi';

export const Orbital3DSystem: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const [hoveredStation, setHoveredStation] = useState<OrbitalStationConfig | null>(null);
  const [focusedStationId, setFocusedStationId] = useState<string | null>(null);

  // References for render loop & cleanup
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mousePosRef = useRef(new THREE.Vector2(-9999, -9999));
  const stationObjectsRef = useRef<
    {
      group: THREE.Group;
      bodyMesh: THREE.Mesh;
      config: OrbitalStationConfig;
      angle: number;
      orbitSpeed: number;
    }[]
  >([]);
  const isHoveredRef = useRef<OrbitalStationConfig | null>(null);

  // Synchronize state to ref for animation loop
  useEffect(() => {
    isHoveredRef.current = hoveredStation;
  }, [hoveredStation]);

  const handleNavigateStation = useCallback(
    (station: OrbitalStationConfig) => {
      navigateWithViewTransition(navigate, station.path);
    },
    [navigate]
  );

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with cinematic orbital tilt (Looking down at 45 degrees)
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 20, 24);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // Fallback gracioso en entornos sin soporte WebGL (ej. JSDOM en tests o navegadores sin aceleración)
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    // Central star point light
    const coreLight = new THREE.PointLight(0x22d3ee, 3.5, 50);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Key directional light for specular highlights
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(15, 30, 20);
    scene.add(dirLight);

    // 5. Central NASA Core Pod (3D Sphere Base + Emissive corona)
    const coreGeometry = new THREE.SphereGeometry(2.1, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x020617,
      emissive: 0x0891b2,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Core halo glow ring
    const coreRingGeom = new THREE.RingGeometry(2.6, 2.75, 64);
    const coreRingMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const coreRing = new THREE.Mesh(coreRingGeom, coreRingMat);
    coreRing.rotation.x = Math.PI / 2;
    scene.add(coreRing);

    // 6. Build 3D Orbit Rings & Stations
    const stationsList: typeof stationObjectsRef.current = [];

    ORBITAL_STATIONS.forEach((station, idx) => {
      // Orbit Line Geometry on XZ plane
      const orbitCurve = new THREE.EllipseCurve(
        0,
        0,
        station.radius,
        station.radius,
        0,
        2 * Math.PI,
        false,
        0
      );
      const points = orbitCurve.getPoints(128);
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );

      const orbitMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(station.color),
        transparent: true,
        opacity: idx === 1 ? 0.35 : 0.45,
      });

      const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      // Station Group (Moves along orbit)
      const stationGroup = new THREE.Group();
      scene.add(stationGroup);

      // Celestial Body Mesh
      let bodyGeometry: THREE.BufferGeometry;
      if (idx === 1) {
        // Station Beta (Probe / Geometric Satellite)
        bodyGeometry = new THREE.OctahedronGeometry(station.size, 1);
      } else {
        bodyGeometry = new THREE.SphereGeometry(station.size, 24, 24);
      }

      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(station.color),
        emissive: new THREE.Color(station.emissive),
        emissiveIntensity: 0.8,
        roughness: 0.3,
        metalness: 0.8,
      });

      const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
      bodyMesh.userData = { stationId: station.id, config: station };
      stationGroup.add(bodyMesh);

      // Atmospheric Halo / Ring for Station Gamma
      if (station.hasRing) {
        const ringGeom = new THREE.RingGeometry(station.size * 1.4, station.size * 2.1, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(station.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65,
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        stationGroup.add(ringMesh);
      }

      // Moonlet for Station Alfa
      if (station.hasMoon) {
        const moonGeom = new THREE.SphereGeometry(0.2, 12, 12);
        const moonMat = new THREE.MeshBasicMaterial({ color: 0xa5f3fc });
        const moonMesh = new THREE.Mesh(moonGeom, moonMat);
        moonMesh.position.set(station.size * 1.8, 0.4, 0);
        stationGroup.add(moonMesh);
      }

      // Initial angle distribution (spaced at 0, 120, 240 degrees)
      const initialAngle = (idx * (2 * Math.PI)) / 3;

      stationsList.push({
        group: stationGroup,
        bodyMesh,
        config: station,
        angle: initialAngle,
        orbitSpeed: station.speed,
      });
    });

    stationObjectsRef.current = stationsList;

    // 7. Motion Reduced check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 8. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const currentHovered = isHoveredRef.current;

      // Rotate core ring
      if (!prefersReducedMotion) {
        coreRing.rotation.z += 0.008;
      }

      // Update stations position
      stationsList.forEach((item) => {
        const isThisHovered = currentHovered?.id === item.config.id;

        // Slow down orbit speed significantly when user hovers or focuses
        const speedMultiplier = isThisHovered ? 0.15 : 1.0;

        if (!prefersReducedMotion) {
          item.angle += item.orbitSpeed * speedMultiplier;
        }

        // Position on XZ plane
        item.group.position.x = Math.cos(item.angle) * item.config.radius;
        item.group.position.z = Math.sin(item.angle) * item.config.radius;

        // Body self-rotation
        if (!prefersReducedMotion) {
          item.bodyMesh.rotation.y += 0.02;
          item.bodyMesh.rotation.x += 0.01;
        }

        // Scale up smoothly if hovered or focused
        const targetScale = isThisHovered ? 1.4 : 1.0;
        item.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
      });

      // Raycasting check
      raycasterRef.current.setFromCamera(mousePosRef.current, camera);
      const meshesToTest = stationsList.map((s) => s.bodyMesh);
      const intersects = raycasterRef.current.intersectObjects(meshesToTest, true);

      if (intersects.length > 0) {
        let hitMesh = intersects[0].object;
        while (hitMesh && !hitMesh.userData.config && hitMesh.parent) {
          hitMesh = hitMesh.parent as THREE.Mesh;
        }
        if (hitMesh?.userData.config) {
          const hitConfig = hitMesh.userData.config as OrbitalStationConfig;
          if (isHoveredRef.current?.id !== hitConfig.id) {
            setHoveredStation(hitConfig);
          }
          canvas.style.cursor = 'pointer';
        }
      } else {
        if (isHoveredRef.current && !focusedStationId) {
          setHoveredStation(null);
          canvas.style.cursor = 'default';
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 10. Pointer Movement Listeners
    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePosRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerLeave = () => {
      mousePosRef.current.set(-9999, -9999);
      if (!focusedStationId) {
        setHoveredStation(null);
      }
      canvas.style.cursor = 'default';
    };

    const handleClick = () => {
      if (isHoveredRef.current) {
        handleNavigateStation(isHoveredRef.current);
      }
    };

    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mouseleave', handlePointerLeave);
    canvas.addEventListener('click', handleClick);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mouseleave', handlePointerLeave);
      canvas.removeEventListener('click', handleClick);

      // Dispose three.js resources
      scene.clear();
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      coreRingGeom.dispose();
      coreRingMat.dispose();
    };
  }, [handleNavigateStation, focusedStationId]);

  // Synchronize keyboard focus
  const handleStationFocus = (station: OrbitalStationConfig) => {
    setFocusedStationId(station.id);
    setHoveredStation(station);
  };

  const handleStationBlur = () => {
    setFocusedStationId(null);
    setHoveredStation(null);
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[360px] sm:h-[480px] lg:h-[540px] flex items-center justify-center overflow-visible"
      >
        {/* Canvas WebGL */}
        <canvas ref={canvasRef} className="w-full h-full block touch-none" />

        {/* Central NASA Emblem DOM Pod (Pinned at exact center, retina-sharp) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-center z-10">
          <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-950/90 border border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.5)] backdrop-blur-md">
            <div
              className="absolute inset-[-4px] rounded-full border border-dashed border-cyan-400/40 animate-spin motion-reduce:animate-none"
              style={{ animationDuration: '12s' }}
            />
            <img
              src={nasa}
              alt="NASA Emblem Core"
              className="w-11 h-11 sm:w-14 sm:h-14 object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            />
          </div>
          <span className="mt-2 text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase font-semibold">
            CORE // NASA
          </span>
        </div>

        {/* Telemetría y Retícula Periférica HUD */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-6 text-[10px] font-mono text-cyan-500/60">
          <div className="flex justify-between items-center">
            <span className="flex items-center space-x-1">
              <BiRadioCircleMarked className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>ORBITAL_VIEW_3D // 60 FPS</span>
            </span>
            <span>TILT: +42.0° // PITCH: NOMINAL</span>
          </div>
          <div className="flex justify-between items-center text-[9px] text-slate-500">
            <span>RA 18h 36m // DEC +38° 47'</span>
            <span>MOTOR: THREE.JS WEBGL</span>
          </div>
        </div>
      </div>

      {/* Holographic Interactive HUD Card (Dynamic readout for hovered/focused station) */}
      <div className="w-full max-w-xl px-4 mt-2 mb-6 z-20">
        <div
          className={`rounded-xl border transition-all duration-300 backdrop-blur-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            hoveredStation
              ? 'bg-slate-950/90 border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
              : 'bg-slate-950/60 border-slate-800/80 shadow-hud-panel'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <BiTargetLock
                className={`w-4 h-4 ${
                  hoveredStation ? 'text-cyan-400 animate-spin' : 'text-slate-500'
                }`}
                style={{ animationDuration: '6s' }}
              />
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                {hoveredStation
                  ? `TARGET LOCK: ${hoveredStation.code}`
                  : 'SISTEMA DE NAVEGACIÓN ORBITAL 3D'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              {hoveredStation
                ? hoveredStation.designation
                : 'Selecciona una Estación en Órbita'}
            </h2>
            <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-md">
              {hoveredStation
                ? hoveredStation.description
                : 'Haz clic directamente sobre los cuerpos celestes en órbita o utiliza los accesos rápidos inferiores.'}
            </p>
          </div>

          {/* Action Trigger */}
          {hoveredStation ? (
            <button
              type="button"
              onClick={() => handleNavigateStation(hoveredStation)}
              className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center space-x-2 shadow-glow-cyan hover:shadow-glow-cyan-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 active:scale-95 cursor-pointer flex-shrink-0"
            >
              <span>Ingresar</span>
              <BiRocket className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-cyan-500/70 border border-cyan-500/20 px-3 py-2 rounded-lg bg-cyan-950/20">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>3 ÓRBITAS ACTIVAS</span>
            </div>
          )}
        </div>
      </div>

      {/* Accessible Keyboard & Touch Navigation Controls (WCAG 2.1 AA & Impeccable Touch Floor >= 48px) */}
      <nav
        aria-label="Controles de navegación orbital directa"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl px-4 z-20"
      >
        {ORBITAL_STATIONS.map((station) => {
          const isSelected = hoveredStation?.id === station.id;
          const getIcon = () => {
            if (station.id === 'station-apod') return <BiRocket className="w-4 h-4" />;
            if (station.id === 'station-gallery') return <BiImages className="w-4 h-4" />;
            return <BiInfoCircle className="w-4 h-4" />;
          };

          return (
            <button
              key={station.id}
              type="button"
              onClick={() => handleNavigateStation(station)}
              onMouseEnter={() => setHoveredStation(station)}
              onMouseLeave={() => setHoveredStation(null)}
              onFocus={() => handleStationFocus(station)}
              onBlur={handleStationBlur}
              className={`min-h-[48px] px-4 py-3 rounded-xl border text-xs font-mono font-semibold flex items-center justify-between transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 active:scale-95 ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-glow-cyan'
                  : 'bg-slate-950/70 hover:bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: station.color }}
                />
                <span>{station.name}</span>
              </div>
              <span className="text-slate-400">{getIcon()}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
