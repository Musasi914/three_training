import * as THREE from "three";
import Experience from "../Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const FOV = 45;
const NEAR = 1;
const FAR = 200;
const CAMERA_POSITION: [number, number, number] = [
  0.9728517749133652, 1.1044765132727201, 0.7316689528482836,
];

export class Camera {
  instance: THREE.PerspectiveCamera;
  experience: Experience;
  scene: Experience["scene"];
  config: Experience["config"];
  controls: OrbitControls;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.config = this.experience.config;

    this.instance = this.setInstance();
    this.controls = this.setOrbitControls();
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

  resize() {
    this.config = this.experience.config;
    this.instance.aspect = this.config.width / this.config.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
