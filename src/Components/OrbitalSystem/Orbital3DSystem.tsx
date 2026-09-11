import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { ORBITAL_STATIONS, OrbitalStationConfig } from './orbital3d.config';
import { navigateWithViewTransition } from '../../utils/navigation';
import nasa from '../../Assets/nasa.png';
import { BiRocket, BiImages, BiInfoCircle, BiCompass } from 'react-icons/bi';

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
  const normalizedMouseRef = useRef({ x: 0, y: 0 });
  const stationObjectsRef = useRef<
    {
      group: THREE.Group;
      bodyMesh: THREE.Mesh;
      config: OrbitalStationConfig;
      angle: number;
      orbitSpeed: number;
      verticalPhase: number;
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

    // 2. Camera with cinematic orbital perspective
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    const baseCamPos = new THREE.Vector3(0, 18, 25);
    camera.position.copy(baseCamPos);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer with error guard
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // Fallback defensivo en entornos sin WebGL (JSDOM/tests)
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // 4. Cosmic Particle Field (Polvo Estelar y Constelaciones 3D)
    const starCount = 750;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starScales = new Float32Array(starCount);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 18 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.45; // Plano aplanado galáctico
      starPositions[i + 2] = radius * Math.cos(phi);
      starScales[i / 3] = 0.5 + Math.random() * 1.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.18,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1122, 1.4);
    scene.add(ambientLight);

    // Luz estelar solar central (resplandor vivo)
    const coreLight = new THREE.PointLight(0x22d3ee, 4, 60, 1.2);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Luz secundaria cálida de borde
    const rimLight = new THREE.DirectionalLight(0xa5b4fc, 1.6);
    rimLight.position.set(-15, 25, -10);
    scene.add(rimLight);

    // 6. Central Sun / Core
    const coreGeometry = new THREE.SphereGeometry(2.3, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x020617,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Corona solar translúcida concéntrica
    const coronaGeom = new THREE.RingGeometry(2.7, 3.1, 64);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const coronaRing = new THREE.Mesh(coronaGeom, coronaMat);
    coronaRing.rotation.x = Math.PI / 2;
    scene.add(coronaRing);

    // 7. Concentric 3D Orbit Lines & Celestial Stations
    const stationsList: typeof stationObjectsRef.current = [];

    ORBITAL_STATIONS.forEach((station, idx) => {
      // Trazos orbitales precisos en plano XZ
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
      const points = orbitCurve.getPoints(160);
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );

      const orbitMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(station.color),
        transparent: true,
        opacity: idx === 1 ? 0.3 : 0.45,
      });

      const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      // Grupo del cuerpo celeste
      const stationGroup = new THREE.Group();
      scene.add(stationGroup);

      let bodyMesh: THREE.Mesh;

      if (idx === 1) {
        // Estación Beta: Sonda de exploración espacial con alas solares
        const probeCoreGeom = new THREE.BoxGeometry(station.size * 0.9, station.size * 0.9, station.size * 1.3);
        const probeMat = new THREE.MeshStandardMaterial({
          color: 0x818cf8,
          emissive: 0x3730a3,
          emissiveIntensity: 0.7,
          metalness: 0.9,
          roughness: 0.2,
        });
        bodyMesh = new THREE.Mesh(probeCoreGeom, probeMat);

        // Paneles solares simétricos
        const wingGeom = new THREE.BoxGeometry(station.size * 2.2, 0.05, station.size * 0.6);
        const wingMat = new THREE.MeshStandardMaterial({
          color: 0x1e1b4b,
          emissive: 0x4338ca,
          emissiveIntensity: 0.5,
          metalness: 0.95,
        });
        const wings = new THREE.Mesh(wingGeom, wingMat);
        bodyMesh.add(wings);

        // Baliza emisora en la punta
        const beaconGeom = new THREE.SphereGeometry(0.12, 12, 12);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xa5b4fc });
        const beacon = new THREE.Mesh(beaconGeom, beaconMat);
        beacon.position.set(0, station.size * 0.6, 0);
        bodyMesh.add(beacon);
      } else {
        // Estación Alfa o Gamma: Esferas planetarias de alta fidelidad
        const planetGeom = new THREE.SphereGeometry(station.size, 32, 32);
        const planetMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(station.color),
          emissive: new THREE.Color(station.emissive),
          emissiveIntensity: 0.75,
          roughness: 0.25,
          metalness: 0.7,
        });
        bodyMesh = new THREE.Mesh(planetGeom, planetMat);

        // Atmósfera gaseosa sutil exterior (Fresnel glow)
        const atmosphereGeom = new THREE.SphereGeometry(station.size * 1.15, 24, 24);
        const atmosphereMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(station.color),
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeom, atmosphereMat);
        bodyMesh.add(atmosphere);
      }

      bodyMesh.userData = { stationId: station.id, config: station };
      stationGroup.add(bodyMesh);

      // Anillo planetario para la Estación Gamma
      if (station.hasRing) {
        const ringGeom = new THREE.RingGeometry(station.size * 1.4, station.size * 2.2, 48);
        const ringMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(station.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
          roughness: 0.4,
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        ringMesh.rotation.y = 0.2;
        stationGroup.add(ringMesh);
      }

      // Satélite natural / Luna para la Estación Alfa
      if (station.hasMoon) {
        const moonGeom = new THREE.SphereGeometry(0.18, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({
          color: 0xcffafe,
          roughness: 0.5,
        });
        const moonMesh = new THREE.Mesh(moonGeom, moonMat);
        moonMesh.position.set(station.size * 1.8, 0.3, 0);
        stationGroup.add(moonMesh);
      }

      // Distribución angular inicial balanceada (0°, 120°, 240°)
      const initialAngle = (idx * (2 * Math.PI)) / 3;

      stationsList.push({
        group: stationGroup,
        bodyMesh,
        config: station,
        angle: initialAngle,
        orbitSpeed: station.speed,
        verticalPhase: idx * 1.5,
      });
    });

    stationObjectsRef.current = stationsList;

    // 8. Motion Reduced check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 9. Animation Render Loop con Micro-Parallax
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const currentHovered = isHoveredRef.current;

      // Parallax suave de cámara según posición del cursor
      if (!prefersReducedMotion) {
        const targetCamX = normalizedMouseRef.current.x * 5;
        const targetCamY = 18 - normalizedMouseRef.current.y * 3.5;
        camera.position.x += (targetCamX - camera.position.x) * 0.04;
        camera.position.y += (targetCamY - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        // Giro lento y pacífico del campo estelar
        starField.rotation.y += 0.0003;
        coronaRing.rotation.z += 0.005;

        // Pulso suave de la luz del sol/núcleo
        coreLight.intensity = 3.5 + Math.sin(elapsedTime * 2) * 0.5;
      }

      // Cinemática orbital de cada estación
      stationsList.forEach((item) => {
        const isThisHovered = currentHovered?.id === item.config.id;
        const speedMultiplier = isThisHovered ? 0.12 : 1.0;

        if (!prefersReducedMotion) {
          item.angle += item.orbitSpeed * speedMultiplier;
        }

        // Posición elíptica en el plano espacial con suave oscilación orbital vertical
        const posX = Math.cos(item.angle) * item.config.radius;
        const posZ = Math.sin(item.angle) * item.config.radius;
        const posY = Math.sin(item.angle * 2 + item.verticalPhase) * 0.35;

        item.group.position.set(posX, posY, posZ);

        // Rotación axial propia del planeta/sonda
        if (!prefersReducedMotion) {
          item.bodyMesh.rotation.y += 0.015;
          item.bodyMesh.rotation.z += 0.005;
        }

        // Escalado elástico suave al seleccionar o hacer hover
        const targetScale = isThisHovered ? 1.45 : 1.0;
        item.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.14);
      });

      // Raycasting
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

    // 10. Resize Observer
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

    // 11. Mouse Movement Listeners
    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mousePosRef.current.set(x, y);
      normalizedMouseRef.current = { x, y };
    };

    const handlePointerLeave = () => {
      mousePosRef.current.set(-9999, -9999);
      normalizedMouseRef.current = { x: 0, y: 0 };
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

      scene.clear();
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      coronaGeom.dispose();
      coronaMat.dispose();
    };
  }, [handleNavigateStation, focusedStationId]);

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
        className="relative w-full h-[380px] sm:h-[480px] lg:h-[520px] flex items-center justify-center overflow-visible"
      >
        {/* Canvas WebGL */}
        <canvas ref={canvasRef} className="w-full h-full block touch-none" />

        {/* Central NASA Emblem Pod */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-center z-10">
          <div className="relative flex items-center justify-center w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-slate-950/85 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-md">
            <div
              className="absolute inset-[-3px] rounded-full border border-dashed border-cyan-400/30 animate-spin motion-reduce:animate-none"
              style={{ animationDuration: '14s' }}
            />
            <img
              src={nasa}
              alt="NASA"
              className="w-10 h-10 sm:w-13 sm:h-13 object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            />
          </div>
        </div>
      </div>

      {/* Human-Centered Interactive Card */}
      <div className="w-full max-w-lg px-4 -mt-2 mb-6 z-20">
        <div
          className={`rounded-2xl border transition-all duration-300 backdrop-blur-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            hoveredStation
              ? 'bg-slate-950/90 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
              : 'bg-slate-950/60 border-slate-800/80 shadow-hud-panel'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <BiCompass
                className={`w-4 h-4 ${
                  hoveredStation ? 'text-cyan-400 animate-spin' : 'text-slate-500'
                }`}
                style={{ animationDuration: '8s' }}
              />
              <span className="text-[11px] font-mono tracking-wider text-cyan-400 font-semibold uppercase">
                {hoveredStation ? hoveredStation.name : 'Exploración Orbital'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              {hoveredStation ? hoveredStation.designation : 'Selecciona un destino celeste'}
            </h2>
            <p className="text-xs text-slate-300 font-normal leading-relaxed max-w-sm">
              {hoveredStation
                ? hoveredStation.description
                : 'Toca o haz clic sobre los planetas en órbita para navegar.'}
            </p>
          </div>

          {/* Action Trigger */}
          {hoveredStation ? (
            <button
              type="button"
              onClick={() => handleNavigateStation(hoveredStation)}
              className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center space-x-2 shadow-glow-cyan hover:shadow-glow-cyan-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 active:scale-95 cursor-pointer flex-shrink-0"
            >
              <span>Explorar</span>
              <BiRocket className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 border border-slate-800 px-3 py-2 rounded-xl bg-slate-900/40">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>3 destinos activos</span>
            </div>
          )}
        </div>
      </div>

      {/* Accessible Keyboard & Touch Navigation Controls (WCAG 2.1 AA & Touch Targets >= 48px) */}
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
              className={`min-h-[48px] px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 active:scale-95 ${
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
