import * as THREE from "three/webgpu";
import Experience from "../Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const FOV = 50;
const NEAR = 1e-6;
const FAR = 1e27;
const CAMERA_POSITION: [number, number, number] = [0, 0, 0.00001];

export class Camera {
  instance: THREE.PerspectiveCamera;
  experience: Experience;
  scene: Experience["scene"];
  config: Experience["config"];
  // controls: OrbitControls;
  // controls: MapControls;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.config = this.experience.config;

    this.instance = this.setInstance();
    // this.controls = this.setOrbitControls();
  }

  private setInstance() {
    const camera = new THREE.PerspectiveCamera(
      FOV,
      this.config.width / this.config.height,
      NEAR,
      FAR
    );
    camera.position.set(...CAMERA_POSITION);
    this.scene.add(camera);
    return camera;
  }

  private setOrbitControls() {
    const controls = new OrbitControls(
      this.instance,
      this.experience.canvasWrapper
    );
    controls.enableDamping = true;
    return controls;
  }

  // private setMapControls() {
  //   const controls = new MapControls(
  //     this.instance,
  //     this.experience.canvasWrapper
  //   );
  //   controls.maxPolarAngle = Math.PI / 2;
  //   controls.enableDamping = true;
  //   return controls;
  // }

  resize() {
    this.config = this.experience.config;
    this.instance.aspect = this.config.width / this.config.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    // this.controls.update();
  }
}
