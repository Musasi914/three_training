import Experience from "../Experience";
import { Example6 } from "../../examples/6.clip";
import { Example7 } from "../../examples/7.bookOpen";
import { Example8 } from "../../examples/8.decals";

export class World {
  experience: Experience;
  scene: Experience["scene"];
  gui: Experience["gui"];
  resource: Experience["resource"];
  // example6: Example6 | null = null;
  // example7: Example7 | null = null;
  // shaderBook: ShaderBook | null = null;
  example8: Example8 | null = null;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.gui = this.experience.gui;

    this.resource = this.experience.resource;
    console.log("resource", this.resource);
    this.resource.on("ready", () => {
      console.log("resource ready");
      this.example8 = new Example8();
    });

    // Example6をコメントアウトして、Example7を有効化
    // this.example6 = new Example6();
    // this.example7 = new Example7();
    // this.shaderBook = new ShaderBook();
  }

  update() {
    // this.example1?.mixer.update(this.experience.time.delta);
    // this.example2?.update();
    // this.example3?.update();
    // this.example4?.update();
    // this.example1Ex?.mixer.update(this.experience.time.delta);
    // this.example5?.update();
    // this.example6?.update();
    // this.shaderBook?.update();
  }
}
