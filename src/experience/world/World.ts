import Experience from "../Experience";
import { Example6 } from "../../examples/6.clip";
import { Example7 } from "../../examples/7.bookOpen";
import { Example8 } from "../../examples/8.decals";
import { Example9 } from "../../examples/9.depthTexture";
import { Example10 } from "../../examples/10.ascii";
import { Example11 } from "../../examples/11.framebufferTexture";

export class World {
  experience: Experience;
  scene: Experience["scene"];
  gui: Experience["gui"];
  resource: Experience["resource"];
  // example6: Example6 | null = null;
  // example7: Example7 | null = null;
  // shaderBook: ShaderBook | null = null;
  // example8: Example8 | null = null;
  // example9: Example9 | null = null;
  // example10: Example10 | null = null;
  example11: Example11 | null = null;
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.gui = this.experience.gui;

    this.resource = this.experience.resource;
    console.log("resource", this.resource);
    this.resource.on("ready", () => {
      console.log("resource ready");
      // this.example8 = new Example8();
      // this.example9 = new Example9();
      // this.example10 = new Example10();
      this.example11 = new Example11();
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
    // this.example9?.update();
    // this.example10?.update();
    this.example11?.update();
  }
}
