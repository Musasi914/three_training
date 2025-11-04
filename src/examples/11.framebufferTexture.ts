import Experience from "../experience/Experience";
import * as THREE from "three";

export class Example11 {
  experience: Experience;
  scene: Experience["scene"];
  renderer: Experience["renderer"];
  camera: Experience["camera"];
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.camera = this.experience.camera;
    this.setModel();
  }

  private setModel() {
    const model = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    this.scene.add(model);
  }

  update() {
    this.renderer.instance.render(this.scene, this.camera.instance);
  }
}