import Experience from "../experience/Experience";
import * as THREE from "three";

export class Example8 {
  experience: Experience;
  scene: Experience["scene"];
  resource: Experience["resource"];
  gui: Experience["gui"];

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resource = this.experience.resource;
    this.gui = this.experience.gui;
  }
}
