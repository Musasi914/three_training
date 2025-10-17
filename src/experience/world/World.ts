import { Example1 } from "../../examples/1";
import { Example2 } from "../../examples/2.animation-sphere";
import Experience from "../Experience";
import * as THREE from "three";
export class World {
  experience: Experience;
  scene: Experience["scene"];
  gui: Experience["gui"];
  resource: Experience["resource"];
  example2: Example2 | null = null;
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.gui = this.experience.gui;

    this.resource = this.experience.resource;
    this.resource.on("ready", () => {
      this.example2 = new Example2();
    });
  }

  update() {
    // this.example1?.mixer.update(this.experience.time.delta);
    this.example2?.update();
  }
}
