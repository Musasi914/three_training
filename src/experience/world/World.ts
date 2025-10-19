import { Example1 } from "../../examples/1";
import { Example2 } from "../../examples/2.animation-sphere";
import { Example3 } from "../../examples/3.batchedMesh";
import { Example4 } from "../../examples/4.camera";
import Experience from "../Experience";
import * as THREE from "three/webgpu";
export class World {
  experience: Experience;
  scene: Experience["scene"];
  gui: Experience["gui"];
  resource: Experience["resource"];
  example4: Example4 | null = null;
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.gui = this.experience.gui;

    this.resource = this.experience.resource;
    this.resource.on("ready", () => {});
    this.example4 = new Example4();
  }

  update() {
    // this.example1?.mixer.update(this.experience.time.delta);
    // this.example2?.update();
    // this.example3?.update();
    this.example4?.update();
  }
}
