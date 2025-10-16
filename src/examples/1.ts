import Experience from "../experience/Experience";
import * as THREE from "three";

export class Example1 {
  experience: Experience;
  scene: Experience["scene"];
  resource: Experience["resource"];
  model: any;
  mixer: THREE.AnimationMixer;
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resource = this.experience.resource;

    this.model = this.setModel();
    this.mixer = this.setMixer();
  }

  private setModel() {
    const model = this.resource.items.tokyoModel;
    model.scene.scale.set(0.01, 0.01, 0.01);

    model.scene.traverse((child: THREE.Mesh) => {
      if (child.type === "Mesh") {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.scene.add(model.scene);
    return model;
  }

  private setMixer() {
    const mixer = new THREE.AnimationMixer(this.model.scene);

    console.log(this.model.animations);
    console.log(mixer);
    // アニメーションが存在するかチェック
    mixer.clipAction(this.model.animations[0]).play();

    return mixer;
  }
}
