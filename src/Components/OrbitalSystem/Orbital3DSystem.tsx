import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { ORBITAL_STATIONS, OrbitalStationConfig } from './orbital3d.config';
import { navigateWithViewTransition } from '../../utils/navigation';

interface Orbital3DSystemProps {
  onHoverStation?: (station: OrbitalStationConfig | null) => void;
  activeStationId?: string | null;
}

export const Orbital3DSystem: React.FC<Orbital3DSystemProps> = ({
  onHoverStation,
  activeStationId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const [hoveredStation, setHoveredStation] = useState<OrbitalStationConfig | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // References for render loop & cleanup
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mousePosRef = useRef(new THREE.Vector2(-9999, -9999));
  const normalizedMouseRef = useRef({ x: 0, y: 0 });

  // State management inside refs to guarantee 0 React re-renders in requestAnimationFrame
  const currentHoveredIdRef = useRef<string | null>(null);
  const activeStationIdRef = useRef<string | null>(null);
  const onHoverCallbackRef = useRef(onHoverStation);

  useEffect(() => {
    onHoverCallbackRef.current = onHoverStation;
  }, [onHoverStation]);

  useEffect(() => {
    activeStationIdRef.current = activeStationId || null;
  }, [activeStationId]);

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

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 800;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with cinematic orbital perspective
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    const baseCamPos = new THREE.Vector3(0, 19, 28);
    camera.position.copy(baseCamPos);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer with error guard for non-WebGL environments (JSDOM/tests)
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // 4. Cosmic Deep-Space Starfield (1,800 estrellas con variación de brillo y profundidad)
    const starCount = 1800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 20 + Math.random() * 110;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.35; // Disco galáctico aplanado
      starPositions[i + 2] = radius * Math.cos(phi);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.14,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5. Lighting: Sol central radiante y luz direccional secundaria suave
    const ambientLight = new THREE.AmbientLight(0x0a1020, 1.1);
    scene.add(ambientLight);

    const sunPointLight = new THREE.PointLight(0x38bdf8, 4.0, 75, 1.2);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 0.85);
    fillLight.position.set(-25, 25, -15);
    scene.add(fillLight);

    // 6. Radiant Sun / Core (Restringido, sobrio, sin bloom excesivo)
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    const coreGeom = new THREE.SphereGeometry(1.9, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.5,
      roughness: 0.15,
      metalness: 0.8,
    });
    const sunCore = new THREE.Mesh(coreGeom, coreMat);
    sunGroup.add(sunCore);

    // Coronas solares sutiles
    const coronaInnerGeom = new THREE.RingGeometry(2.1, 2.6, 64);
    const coronaInnerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const coronaInner = new THREE.Mesh(coronaInnerGeom, coronaInnerMat);
    coronaInner.rotation.x = Math.PI / 2;
    sunGroup.add(coronaInner);

    const coronaOuterGeom = new THREE.RingGeometry(2.6, 3.6, 64);
    const coronaOuterMat = new THREE.MeshBasicMaterial({
      color: 0x0369a1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const coronaOuter = new THREE.Mesh(coronaOuterGeom, coronaOuterMat);
    coronaOuter.rotation.x = Math.PI / 2;
    sunGroup.add(coronaOuter);

    // Retícula polar astronómica tenue en el plano ecuatorial
    const gridReticleGeom = new THREE.RingGeometry(4.2, 4.22, 64);
    const gridReticleMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
    const gridReticle = new THREE.Mesh(gridReticleGeom, gridReticleMat);
    gridReticle.rotation.x = Math.PI / 2;
    scene.add(gridReticle);

    // 7. Planetary Orbits and Celestial Bodies
    const interactiveMeshes: THREE.Mesh[] = [];
    const stationObjects: {
      group: THREE.Group;
      bodyMesh: THREE.Mesh;
      config: OrbitalStationConfig;
      angle: number;
      orbitSpeed: number;
      verticalPhase: number;
      moonGroup?: THREE.Group;
    }[] = [];

    ORBITAL_STATIONS.forEach((station, idx) => {
      // Órbita elíptica tridimensional con inclinación sutil
      const orbitCurve = new THREE.EllipseCurve(
        0,
        0,
        station.radius,
        station.radius * 0.96, // Sutil excentricidad astronómica
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
        opacity: idx === 1 ? 0.22 : 0.32,
      });

      const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
      orbitLine.rotation.x = station.inclination;
      scene.add(orbitLine);

      // Grupo orbital
      const stationGroup = new THREE.Group();
      stationGroup.rotation.x = station.inclination;
      scene.add(stationGroup);

      let bodyMesh: THREE.Mesh;
      let moonGroup: THREE.Group | undefined;

      if (idx === 1) {
        // Sonda Espacial / Observatorio en Órbita Profunda
        const probeBodyGeom = new THREE.BoxGeometry(
          station.size * 0.85,
          station.size * 0.85,
          station.size * 1.3
        );
        const probeMat = new THREE.MeshStandardMaterial({
          color: 0xa5b4fc,
          emissive: 0x312e81,
          emissiveIntensity: 0.8,
          metalness: 0.95,
          roughness: 0.15,
        });
        bodyMesh = new THREE.Mesh(probeBodyGeom, probeMat);

        // Paneles solares simétricos
        const wingGeom = new THREE.BoxGeometry(station.size * 2.3, 0.03, station.size * 0.65);
        const wingMat = new THREE.MeshStandardMaterial({
          color: 0x1e1b4b,
          emissive: 0x3730a3,
          emissiveIntensity: 0.5,
          metalness: 0.9,
        });
        const wings = new THREE.Mesh(wingGeom, wingMat);
        bodyMesh.add(wings);

        // Baliza de telemetría pulsante
        const beaconGeom = new THREE.SphereGeometry(0.1, 12, 12);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xc7d2fe });
        const beacon = new THREE.Mesh(beaconGeom, beaconMat);
        beacon.position.set(0, station.size * 0.65, 0);
        bodyMesh.add(beacon);
      } else {
        // Cuerpos Celestes Esféricos Proporcionados (sin esferas gigantes de caricatura)
        const planetGeom = new THREE.SphereGeometry(station.size, 32, 32);
        const planetMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(station.color),
          emissive: new THREE.Color(station.emissive),
          emissiveIntensity: 0.5,
          roughness: 0.35,
          metalness: 0.5,
        });
        bodyMesh = new THREE.Mesh(planetGeom, planetMat);

        // Atmósfera con tenue brillo Fresnel
        const atmoGeom = new THREE.SphereGeometry(station.size * 1.15, 24, 24);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(station.color),
          transparent: true,
          opacity: 0.18,
          blending: THREE.AdditiveBlending,
        });
        const atmosphere = new THREE.Mesh(atmoGeom, atmoMat);
        bodyMesh.add(atmosphere);

        // Luna orbital en Estación Alfa
        if (station.hasMoon) {
          moonGroup = new THREE.Group();
          stationGroup.add(moonGroup);

          const moonGeom = new THREE.SphereGeometry(0.16, 16, 16);
          const moonMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            emissive: 0x334155,
            emissiveIntensity: 0.3,
            roughness: 0.6,
          });
          const moonMesh = new THREE.Mesh(moonGeom, moonMat);
          moonMesh.position.set(1.2, 0, 0);
          moonGroup.add(moonMesh);

          const moonOrbitGeom = new THREE.BufferGeometry().setFromPoints(
            new THREE.EllipseCurve(0, 0, 1.2, 1.2, 0, 2 * Math.PI, false, 0)
              .getPoints(36)
              .map((p) => new THREE.Vector3(p.x, 0, p.y))
          );
          const moonOrbitMat = new THREE.LineBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.15,
          });
          const moonOrbitLine = new THREE.LineLoop(moonOrbitGeom, moonOrbitMat);
          moonGroup.add(moonOrbitLine);
        }

        // Sistema de anillos en Estación Gamma
        if (station.hasRing) {
          const ringGroup = new THREE.Group();
          ringGroup.rotation.x = Math.PI / 3.2;
          ringGroup.rotation.z = Math.PI / 12;

          const r1Geom = new THREE.RingGeometry(station.size * 1.3, station.size * 1.7, 64);
          const r1Mat = new THREE.MeshBasicMaterial({
            color: 0x34d399,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.38,
            blending: THREE.AdditiveBlending,
          });
          const r1 = new THREE.Mesh(r1Geom, r1Mat);
          ringGroup.add(r1);

          const r2Geom = new THREE.RingGeometry(station.size * 1.8, station.size * 2.3, 64);
          const r2Mat = new THREE.MeshBasicMaterial({
            color: 0x6ee7b7,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
          });
          const r2 = new THREE.Mesh(r2Geom, r2Mat);
          ringGroup.add(r2);

          bodyMesh.add(ringGroup);
        }
      }

      bodyMesh.userData = { stationId: station.id, config: station };
      stationGroup.add(bodyMesh);
      interactiveMeshes.push(bodyMesh);

      const initialAngle = (idx * (2 * Math.PI)) / ORBITAL_STATIONS.length;
      stationGroup.position.x = Math.cos(initialAngle) * station.radius;
      stationGroup.position.z = Math.sin(initialAngle) * (station.radius * 0.96);

      stationObjects.push({
        group: stationGroup,
        bodyMesh,
        config: station,
        angle: initialAngle,
        orbitSpeed: station.speed,
        verticalPhase: idx * 2.3,
        moonGroup,
      });
    });

    // 8. Resize Observer para actualización de proyección y viewport
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth || 600;
      const newHeight = container.clientHeight || 600;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 9. Bucle de Animación Ultra Optimizado (Zero state setters por frame)
    const clock = new THREE.Clock();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Rotación estelar lenta y constante
        starField.rotation.y = elapsedTime * 0.008;

        // Pulso solar tranquilo
        const sunPulse = 1 + Math.sin(elapsedTime * 1.4) * 0.03;
        coronaInner.scale.set(sunPulse, sunPulse, 1);
        sunGroup.rotation.y += 0.003;

        // Parallax de cámara muy sutil y amortiguado (calmado)
        const targetCamX = normalizedMouseRef.current.x * 1.8;
        const targetCamY = baseCamPos.y + normalizedMouseRef.current.y * 1.2;
        camera.position.x += (targetCamX - camera.position.x) * 0.03;
        camera.position.y += (targetCamY - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        // Movimiento orbital de los cuerpos celestes
        stationObjects.forEach((stationObj) => {
          const isHovered =
            currentHoveredIdRef.current === stationObj.config.id ||
            activeStationIdRef.current === stationObj.config.id;

          const currentSpeed = isHovered ? stationObj.orbitSpeed * 0.2 : stationObj.orbitSpeed;
          stationObj.angle += currentSpeed * delta * 50;

          stationObj.group.position.x = Math.cos(stationObj.angle) * stationObj.config.radius;
          stationObj.group.position.z =
            Math.sin(stationObj.angle) * (stationObj.config.radius * 0.96);

          // Oscilación vertical armónica sutil
          stationObj.group.position.y =
            Math.sin(elapsedTime * 1.2 + stationObj.verticalPhase) * 0.35;

          // Rotación axial propia
          stationObj.bodyMesh.rotation.y += 0.01;

          if (stationObj.moonGroup) {
            stationObj.moonGroup.position.copy(stationObj.group.position);
            stationObj.moonGroup.rotation.y += 0.025;
          }

          // Escala suave (restringida a 1.18x para no distorsionar proporciones)
          const targetScale = isHovered ? 1.18 : 1.0;
          stationObj.bodyMesh.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            0.1
          );
        });
      }

      // 10. Raycasting acotado ÚNICAMENTE a los 3 cuerpos celestes interactivos
      raycasterRef.current.setFromCamera(mousePosRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(interactiveMeshes, true);

      let foundConfig: OrbitalStationConfig | null = null;
      let hitMesh: THREE.Object3D | null = null;

      if (intersects.length > 0) {
        let currentObj: THREE.Object3D | null = intersects[0].object;
        while (currentObj && !currentObj.userData?.config) {
          currentObj = currentObj.parent;
        }
        if (currentObj?.userData?.config) {
          foundConfig = currentObj.userData.config;
          hitMesh = currentObj;
        }
      }

      // Detección de cambio de estado: SOLO disparar state de React si hay transición
      const newHitId = foundConfig ? foundConfig.id : activeStationIdRef.current;

      if (newHitId !== currentHoveredIdRef.current) {
        currentHoveredIdRef.current = newHitId;
        const targetStation =
          foundConfig ||
          ORBITAL_STATIONS.find((s) => s.id === activeStationIdRef.current) ||
          null;

        setHoveredStation(targetStation);
        if (onHoverCallbackRef.current) {
          onHoverCallbackRef.current(targetStation);
        }
        canvas.style.cursor = targetStation ? 'pointer' : 'default';
      }

      // Actualizar posición de tooltip 2D proyectada si hay objeto activo
      if (hitMesh && foundConfig) {
        const screenPos = new THREE.Vector3();
        hitMesh.getWorldPosition(screenPos);
        screenPos.project(camera);

        const hw = container.clientWidth / 2;
        const hh = container.clientHeight / 2;
        const x = screenPos.x * hw + hw;
        const y = -(screenPos.y * hh) + hh;
        setTooltipPos({ x, y });
      } else if (!newHitId) {
        setTooltipPos(null);
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 11. Event Listeners
    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current.set(x, y);
      normalizedMouseRef.current = { x, y };
    };

    const handlePointerLeave = () => {
      mousePosRef.current.set(-9999, -9999);
      normalizedMouseRef.current = { x: 0, y: 0 };
      if (!activeStationIdRef.current) {
        currentHoveredIdRef.current = null;
        setHoveredStation(null);
        setTooltipPos(null);
        if (onHoverCallbackRef.current) {
          onHoverCallbackRef.current(null);
        }
      }
    };

    const handleClick = () => {
      if (currentHoveredIdRef.current) {
        const target = ORBITAL_STATIONS.find((s) => s.id === currentHoveredIdRef.current);
        if (target) {
          handleNavigateStation(target);
        }
      }
    };

    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mouseleave', handlePointerLeave);
    canvas.addEventListener('click', handleClick);

    // 12. Limpieza exhaustiva al desmontar
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
      coreGeom.dispose();
      coreMat.dispose();
      coronaInnerGeom.dispose();
      coronaInnerMat.dispose();
      coronaOuterGeom.dispose();
      coronaOuterMat.dispose();
      gridReticleGeom.dispose();
      gridReticleMat.dispose();
    };
  }, [handleNavigateStation]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-visible select-none"
    >
      {/* Canvas WebGL a pantalla completa del contenedor */}
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />

      {/* Scientific Instrumentation Tooltip (Monospace, uppercase, thin borders, restrained) */}
      {hoveredStation && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 10}px`,
          }}
        >
          <div className="bg-slate-950/95 border border-cyan-500/40 px-3.5 py-2.5 font-mono text-[10px] tracking-wider uppercase text-slate-200 shadow-[0_0_25px_rgba(2,6,23,0.95)] backdrop-blur-sm min-w-[200px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
              <span className="text-cyan-400 font-bold">{hoveredStation.code}</span>
              <span className="text-slate-400 text-[9px] tracking-widest">
                {hoveredStation.statusTelemetry}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between space-x-3 text-slate-400">
                <span className="text-slate-500">OBJECT</span>
                <span className="text-white font-medium">{hoveredStation.objectName}</span>
              </div>
              <div className="flex justify-between space-x-3 text-slate-400">
                <span className="text-slate-500">DISTANCE</span>
                <span className="text-cyan-300 font-mono">{hoveredStation.distanceAU}</span>
              </div>
              <div className="flex justify-between space-x-3 text-slate-400">
                <span className="text-slate-500">COORD</span>
                <span className="text-slate-300 font-mono text-[9px]">
                  {hoveredStation.coordinates}
                </span>
              </div>
            </div>
            <div className="mt-2 pt-1 border-t border-slate-800/80 text-[9px] text-cyan-400 font-mono text-right flex items-center justify-end space-x-1">
              <span>EXPLORAR OBJETIVO</span>
              <span>→</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
