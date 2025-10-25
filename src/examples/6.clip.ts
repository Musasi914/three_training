import * as THREE from "three";
import Experience from "../experience/Experience";

export class Example6 {
  experience: Experience;
  scene: Experience["scene"];
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }
}
