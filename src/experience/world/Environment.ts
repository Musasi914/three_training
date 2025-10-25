import Experience from "../Experience";
import * as THREE from "three";
export class Environment {
  experience: Experience;
  scene: Experience["scene"];
  renderer: Experience["renderer"];

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;

    // this.setBackground();
    this.setAmbientLight();
    // this.setDirectionalLight();
    this.setSpotLight();
  }

  // private setBackground() {
  //   this.scene.background = new THREE.Color(0xbfe3dd);
  // }

  private setAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0xcccccc, 2);
    this.scene.add(ambientLight);
  }

  private setDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);
  }

  private setSpotLight() {
    const spotLight = new THREE.SpotLight(0xffffff, 60);
    this.scene.add(spotLight);
  }
}
