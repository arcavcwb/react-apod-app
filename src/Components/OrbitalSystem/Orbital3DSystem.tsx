import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { ORBITAL_STATIONS, OrbitalStationConfig } from './orbital3d.config';
import { navigateWithViewTransition } from '../../utils/navigation';
import { BiRocket, BiImages, BiInfoCircle } from 'react-icons/bi';

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

  const stationObjectsRef = useRef<
    {
      group: THREE.Group;
      bodyMesh: THREE.Mesh;
      config: OrbitalStationConfig;
      angle: number;
      orbitSpeed: number;
      verticalPhase: number;
      moonGroup?: THREE.Group;
    }[]
  >([]);

  const isHoveredRef = useRef<OrbitalStationConfig | null>(null);
  const activeStationIdRef = useRef<string | null>(null);

  useEffect(() => {
    isHoveredRef.current = hoveredStation;
    if (onHoverStation) {
      onHoverStation(hoveredStation);
    }
  }, [hoveredStation, onHoverStation]);

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

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with cinematic orbital perspective (inclined angle for deep 3D view)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    const baseCamPos = new THREE.Vector3(0, 16, 26);
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

    // 4. Cosmic Starfield (1,000 partículas en profundidad 3D)
    const starCount = 1000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 15 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.4;
      starPositions[i + 2] = radius * Math.cos(phi);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.16,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    // Sol central: luz radiante omnidireccional
    const sunLight = new THREE.PointLight(0x38bdf8, 4.5, 65, 1.2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Luz secundaria cálida de relleno para contraste estético
    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.0);
    fillLight.position.set(-20, 20, -10);
    scene.add(fillLight);

    // 6. Radiant Sun / Core 3D
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    // Núcleo estelar
    const coreGeom = new THREE.SphereGeometry(2.0, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.8,
      roughness: 0.1,
      metalness: 0.8,
    });
    const sunCore = new THREE.Mesh(coreGeom, coreMat);
    sunGroup.add(sunCore);

    // Corona solar interior
    const coronaInnerGeom = new THREE.RingGeometry(2.2, 2.8, 64);
    const coronaInnerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const coronaInner = new THREE.Mesh(coronaInnerGeom, coronaInnerMat);
    coronaInner.rotation.x = Math.PI / 2;
    sunGroup.add(coronaInner);

    // Corona solar media
    const coronaMidGeom = new THREE.RingGeometry(2.8, 3.8, 64);
    const coronaMidMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const coronaMid = new THREE.Mesh(coronaMidGeom, coronaMidMat);
    coronaMid.rotation.x = Math.PI / 2;
    sunGroup.add(coronaMid);

    // Corona solar exterior difusa
    const coronaOuterGeom = new THREE.RingGeometry(3.8, 5.0, 64);
    const coronaOuterMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const coronaOuter = new THREE.Mesh(coronaOuterGeom, coronaOuterMat);
    coronaOuter.rotation.x = Math.PI / 2;
    sunGroup.add(coronaOuter);

    // 7. Planetary Orbits and Bodies
    const stationsList: typeof stationObjectsRef.current = [];

    ORBITAL_STATIONS.forEach((station, idx) => {
      // Líneas orbitales suaves en plano XZ
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
        opacity: idx === 1 ? 0.28 : 0.4,
      });

      const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      // Grupo del cuerpo celeste
      const stationGroup = new THREE.Group();
      scene.add(stationGroup);

      let bodyMesh: THREE.Mesh;
      let moonGroup: THREE.Group | undefined;

      if (idx === 1) {
        // Estación Archivo: Sonda de exploración espacial con paneles solares
        const probeBodyGeom = new THREE.BoxGeometry(
          station.size * 0.9,
          station.size * 0.9,
          station.size * 1.3
        );
        const probeMat = new THREE.MeshStandardMaterial({
          color: 0xa5b4fc,
          emissive: 0x4338ca,
          emissiveIntensity: 0.8,
          metalness: 0.95,
          roughness: 0.15,
        });
        bodyMesh = new THREE.Mesh(probeBodyGeom, probeMat);

        // Paneles solares simétricos
        const wingGeom = new THREE.BoxGeometry(station.size * 2.4, 0.04, station.size * 0.7);
        const wingMat = new THREE.MeshStandardMaterial({
          color: 0x1e1b4b,
          emissive: 0x312e81,
          emissiveIntensity: 0.6,
          metalness: 0.9,
        });
        const wings = new THREE.Mesh(wingGeom, wingMat);
        bodyMesh.add(wings);

        // Baliza pulsante
        const beaconGeom = new THREE.SphereGeometry(0.12, 12, 12);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xc7d2fe });
        const beacon = new THREE.Mesh(beaconGeom, beaconMat);
        beacon.position.set(0, station.size * 0.65, 0);
        bodyMesh.add(beacon);
      } else {
        // Estación Foto de Hoy o Acerca de: Planetas con sombreado rico
        const planetGeom = new THREE.SphereGeometry(station.size, 32, 32);
        const planetMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(station.color),
          emissive: new THREE.Color(station.emissive),
          emissiveIntensity: 0.6,
          roughness: 0.3,
          metalness: 0.6,
        });
        bodyMesh = new THREE.Mesh(planetGeom, planetMat);

        // Atmósfera con brillo exterior suave (Fresnel glow)
        const atmoGeom = new THREE.SphereGeometry(station.size * 1.18, 24, 24);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(station.color),
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
        });
        const atmosphere = new THREE.Mesh(atmoGeom, atmoMat);
        bodyMesh.add(atmosphere);

        // Si tiene luna (Estación Foto de Hoy)
        if (station.hasMoon) {
          moonGroup = new THREE.Group();
          stationGroup.add(moonGroup);

          const moonGeom = new THREE.SphereGeometry(0.18, 16, 16);
          const moonMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            emissive: 0x475569,
            emissiveIntensity: 0.4,
            roughness: 0.5,
          });
          const moonMesh = new THREE.Mesh(moonGeom, moonMat);
          moonMesh.position.set(1.3, 0, 0);
          moonGroup.add(moonMesh);

          // Órbita de la luna
          const moonOrbitGeom = new THREE.BufferGeometry().setFromPoints(
            new THREE.EllipseCurve(0, 0, 1.3, 1.3, 0, 2 * Math.PI, false, 0)
              .getPoints(40)
              .map((p) => new THREE.Vector3(p.x, 0, p.y))
          );
          const moonOrbitMat = new THREE.LineBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.2,
          });
          const moonOrbitLine = new THREE.LineLoop(moonOrbitGeom, moonOrbitMat);
          moonGroup.add(moonOrbitLine);
        }

        // Si tiene anillos (Estación Acerca de)
        if (station.hasRing) {
          const ringGroup = new THREE.Group();
          ringGroup.rotation.x = Math.PI / 3.5;
          ringGroup.rotation.z = Math.PI / 10;

          // Anillo interior
          const r1Geom = new THREE.RingGeometry(station.size * 1.3, station.size * 1.8, 64);
          const r1Mat = new THREE.MeshBasicMaterial({
            color: 0x34d399,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending,
          });
          const r1 = new THREE.Mesh(r1Geom, r1Mat);
          ringGroup.add(r1);

          // Anillo exterior
          const r2Geom = new THREE.RingGeometry(station.size * 1.9, station.size * 2.5, 64);
          const r2Mat = new THREE.MeshBasicMaterial({
            color: 0x6ee7b7,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending,
          });
          const r2 = new THREE.Mesh(r2Geom, r2Mat);
          ringGroup.add(r2);

          bodyMesh.add(ringGroup);
        }
      }

      bodyMesh.userData = { stationId: station.id, config: station };
      stationGroup.add(bodyMesh);

      // Posición orbital inicial
      const initialAngle = (idx * (2 * Math.PI)) / ORBITAL_STATIONS.length;
      stationGroup.position.x = Math.cos(initialAngle) * station.radius;
      stationGroup.position.z = Math.sin(initialAngle) * station.radius;

      stationsList.push({
        group: stationGroup,
        bodyMesh,
        config: station,
        angle: initialAngle,
        orbitSpeed: station.speed,
        verticalPhase: idx * 2.1,
        moonGroup,
      });
    });

    stationObjectsRef.current = stationsList;

    // 8. Dynamic Resize Observer for Container
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth || 500;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 9. Animation Loop
    const clock = new THREE.Clock();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Rotación sutil del campo estelar
      starField.rotation.y = elapsedTime * 0.015;

      // Pulso orgánico de la corona solar
      const sunPulse = 1 + Math.sin(elapsedTime * 2.0) * 0.06;
      coronaInner.scale.set(sunPulse, sunPulse, 1);
      coronaMid.scale.set(sunPulse * 1.02, sunPulse * 1.02, 1);
      sunGroup.rotation.y += 0.005;

      // Parallax reactivo de la cámara con amortiguación suave (lerp)
      const targetCamX = normalizedMouseRef.current.x * 2.8;
      const targetCamY = baseCamPos.y + normalizedMouseRef.current.y * 1.8;
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Actualizar cuerpos orbitales
      stationsList.forEach((stationObj) => {
        const isHovered =
          isHoveredRef.current?.id === stationObj.config.id ||
          activeStationIdRef.current === stationObj.config.id;

        // Desacelerar suavemente en hover para facilitar el clic
        const currentSpeed = isHovered ? stationObj.orbitSpeed * 0.15 : stationObj.orbitSpeed;

        if (!prefersReducedMotion) {
          stationObj.angle += currentSpeed * delta * 60;
        }

        // Posición XZ en órbita
        stationObj.group.position.x = Math.cos(stationObj.angle) * stationObj.config.radius;
        stationObj.group.position.z = Math.sin(stationObj.angle) * stationObj.config.radius;

        // Bobbing vertical armónico suave
        stationObj.group.position.y =
          Math.sin(elapsedTime * 1.5 + stationObj.verticalPhase) * 0.45;

        // Rotación axial propia del cuerpo celeste
        stationObj.bodyMesh.rotation.y += 0.015;

        // Rotación de la luna si existe
        if (stationObj.moonGroup) {
          stationObj.moonGroup.position.copy(stationObj.group.position);
          stationObj.moonGroup.rotation.y += 0.04;
        }

        // Escala con transición en hover
        const targetScale = isHovered ? 1.35 : 1.0;
        stationObj.bodyMesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
      });

      // Raycasting para detección de hover del puntero
      raycasterRef.current.setFromCamera(mousePosRef.current, camera);
      const meshesToIntersect = stationsList.map((s) => s.bodyMesh);
      const intersects = raycasterRef.current.intersectObjects(meshesToIntersect, true);

      if (intersects.length > 0) {
        // Encontrar la malla raíz que contiene userData
        let hitObject: THREE.Object3D | null = intersects[0].object;
        while (hitObject && !hitObject.userData?.config) {
          hitObject = hitObject.parent;
        }

        if (hitObject?.userData?.config) {
          const config: OrbitalStationConfig = hitObject.userData.config;
          setHoveredStation((prev) => (prev?.id === config.id ? prev : config));
          canvas.style.cursor = 'pointer';

          // Proyectar posición 3D a coordenadas de pantalla 2D para tooltip flotante
          const screenPos = hitObject.position.clone();
          hitObject.getWorldPosition(screenPos);
          screenPos.project(camera);

          const hw = container.clientWidth / 2;
          const hh = container.clientHeight / 2;
          const x = screenPos.x * hw + hw;
          const y = -(screenPos.y * hh) + hh;
          setTooltipPos({ x, y });
        }
      } else {
        if (!activeStationIdRef.current) {
          setHoveredStation(null);
          setTooltipPos(null);
        }
        canvas.style.cursor = 'default';
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 10. Event Listeners
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
        setHoveredStation(null);
        setTooltipPos(null);
      }
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
      coreGeom.dispose();
      coreMat.dispose();
      coronaInnerGeom.dispose();
      coronaInnerMat.dispose();
      coronaMidGeom.dispose();
      coronaMidMat.dispose();
      coronaOuterGeom.dispose();
      coronaOuterMat.dispose();
    };
  }, [handleNavigateStation]);

  const getStationIcon = (id: string) => {
    if (id === 'station-apod') return <BiRocket className="w-3.5 h-3.5" />;
    if (id === 'station-gallery') return <BiImages className="w-3.5 h-3.5" />;
    return <BiInfoCircle className="w-3.5 h-3.5" />;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-visible select-none"
    >
      {/* Canvas WebGL a pantalla completa del contenedor */}
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />

      {/* Floating 3D Tooltip al interactuar con cualquier planeta */}
      {hoveredStation && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 transition-opacity duration-200"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 15}px`,
          }}
        >
          <div className="bg-slate-950/90 border border-cyan-400/60 rounded-xl px-3.5 py-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-md flex items-center space-x-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: hoveredStation.color }}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide flex items-center space-x-1.5">
                <span>{hoveredStation.name}</span>
                <span className="text-cyan-300">{getStationIcon(hoveredStation.id)}</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {hoveredStation.designation} • Clic para entrar
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Guía interactiva sutil en la esquina inferior */}
      <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 pointer-events-none hidden sm:flex items-center space-x-2 bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-full backdrop-blur-md text-[11px] text-slate-400 font-normal">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>Haz clic sobre cualquier planeta para navegar</span>
      </div>
    </div>
  );
};
