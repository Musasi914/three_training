import { Example1Ex } from "../../examples/1-ex";
import Experience from "../Experience";
export class World {
  experience: Experience;
  scene: Experience["scene"];
  gui: Experience["gui"];
  resource: Experience["resource"];
  example1Ex: Example1Ex | null = null;
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.gui = this.experience.gui;

    this.resource = this.experience.resource;
    this.resource.on("ready", () => {
      this.example1Ex = new Example1Ex();
    });
  }

  update() {
    // this.example1?.mixer.update(this.experience.time.delta);
    // this.example2?.update();
    // this.example3?.update();
    // this.example4?.update();
    this.example1Ex?.mixer.update(this.experience.time.delta);
  }
}
