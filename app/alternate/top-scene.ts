import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { topProfile as profile } from './top-profile';

export function createTopScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.55, 1.55, 1.55, -1.55, .1, 30);
  camera.position.set(2.8, 2.7, 6);
  camera.lookAt(0, .85, 0);

  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, .025);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();

  // Fine lathe marks, generated locally; no external image or model assets.
  const grainData = new Uint8Array(256 * 256 * 4);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const i = (y * 256 + x) * 4;
      const value = 164 + Math.sin(y * 2.4) * 9 + Math.sin(x * .21 + y * .73) * 4;
      grainData[i] = grainData[i + 1] = grainData[i + 2] = value;
      grainData[i + 3] = 255;
    }
  }
  const grain = new THREE.DataTexture(grainData, 256, 256);
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.needsUpdate = true;
  const metal = new THREE.MeshStandardMaterial({ color: '#4c5054', metalness: 1, roughness: .38, roughnessMap: grain, bumpMap: grain, bumpScale: .00025, envMapIntensity: 1.25 });
  const geometry = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 128);
  const top = new THREE.Mesh(geometry, metal);
  const pivot = new THREE.Group();
  pivot.add(top);
  scene.add(pivot);

  // A shallow imperfection catches the light once per turn, making the spin legible.
  const seamGeometry = new THREE.TorusGeometry(.85, .002, 5, 96, .13);
  const seamMaterial = new THREE.MeshStandardMaterial({ color: '#56616e', metalness: 1, roughness: .48 });
  const seam = new THREE.Mesh(seamGeometry, seamMaterial);
  seam.rotation.x = Math.PI / 2;
  seam.position.y = .588;
  top.add(seam);

  const key = new THREE.DirectionalLight('#ffffff', 2.5);
  key.position.set(-3, 5, 4);
  scene.add(key, new THREE.HemisphereLight('#dce7f4', '#2d3947', 1.2));
  const rim = new THREE.DirectionalLight('#b7cee9', 2);
  rim.position.set(3, 2, -2);
  scene.add(rim);

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(20,31,44,.5)');
  gradient.addColorStop(.25, 'rgba(20,31,44,.23)');
  gradient.addColorStop(1, 'rgba(20,31,44,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false });
  const shadowGeometry = new THREE.PlaneGeometry(2.6, 2.6);
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -.012;
  scene.add(shadow);

  return {
    resize(width: number) { renderer.setSize(width, width, false); },
    theme(dark: boolean) {
      metal.color.set(dark ? '#626a73' : '#4c5054');
      metal.envMapIntensity = dark ? 1.4 : 1.25;
      shadowMaterial.opacity = dark ? .5 : 1;
    },
    draw(angle: number, tiltX: number, tiltZ: number, viewX: number, viewY: number) {
      pivot.rotation.set(tiltX, 0, tiltZ);
      top.rotation.y = angle;
      // Keep the lowest point on the surface, including the final sideways settle.
      const theta = Math.acos(Math.max(-1, Math.min(1, Math.cos(tiltX) * Math.cos(tiltZ))));
      let lift = 0;
      for (let i = 0; i < profile.length; i++) lift = Math.max(lift, profile[i][0] * Math.sin(theta) - profile[i][1] * Math.cos(theta));
      pivot.position.y = lift;
      shadow.position.x = -Math.sin(tiltZ) * .35;
      shadow.position.z = Math.sin(tiltX) * .35;
      camera.position.set(2.8 + viewX, 2.7 + viewY, 6);
      camera.lookAt(0, .85, 0);
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose(); metal.dispose(); grain.dispose(); environment.dispose();
      seamGeometry.dispose(); seamMaterial.dispose(); shadowGeometry.dispose();
      shadowMaterial.dispose(); shadowTexture.dispose(); renderer.dispose();
    },
  };
}

export type TopScene = ReturnType<typeof createTopScene>;
