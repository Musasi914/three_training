import Experience from "../Experience";
import { Example5 } from "../../examples/5.logarithmicZBuffer";
export class World {
  experience: Experience;
  scene: Experience["scene"];
  gui: Experience["gui"];
  resource: Experience["resource"];
  example5: Example5 | null = null;
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.gui = this.experience.gui;

    this.resource = this.experience.resource;
    this.resource.on("ready", () => {
      this.example5 = new Example5();
    });
  }

  update() {
    // this.example1?.mixer.update(this.experience.time.delta);
    // this.example2?.update();
    // this.example3?.update();
    // this.example4?.update();
    // this.example1Ex?.mixer.update(this.experience.time.delta);
    this.example5?.update();
  }
}
