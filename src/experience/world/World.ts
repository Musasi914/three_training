import { Example1 } from "../../examples/1";
import Experience from "../Experience";
import * as THREE from "three";
export class World {
  experience: Experience;
  scene: Experience["scene"];
  gui: Experience["gui"];
  resource: Experience["resource"];
  example1: Example1 | null = null;
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.gui = this.experience.gui;

    this.resource = this.experience.resource;
    this.resource.on("ready", () => {
      this.example1 = new Example1();
    });
  }

  update() {
    this.example1?.mixer.update(this.experience.time.delta);
  }
}
