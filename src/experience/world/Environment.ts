import * as THREE from "three";
import Experience from "../Experience";

export class Environment {
  experience: Experience;
  scene: Experience["scene"];
  renderer: Experience["renderer"];

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;

    this.setBackground();
    this.setAmbientLight();
    this.setDirectionalLight();
  }

  private setBackground() {
    this.scene.background = new THREE.Color(0xbfe3dd);
  }

  private setAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientLight);
  }

  private setDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }
}
