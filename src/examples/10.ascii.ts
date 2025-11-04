import { AsciiEffect } from "three/examples/jsm/Addons.js";
import Experience from "../experience/Experience";
import * as THREE from "three";

export class Example10 {
  experience: Experience;
  scene: Experience["scene"];
  camera: Experience["camera"];
  renderer: Experience["renderer"];

  effect: AsciiEffect;
  sphere: THREE.Mesh;
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.camera.instance.far = 1000;
    this.camera.instance.position.set(0, 150, 500);
    this.renderer = this.experience.renderer;

    this.sphere = this.setModel();

    this.effect = this.setEffect();
  }

  private setModel() {
    const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
    pointLight1.position.set(500, 500, 500);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
    pointLight2.position.set(-500, -500, -500);
    this.scene.add(pointLight2);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(200, 20, 10), new THREE.MeshPhongMaterial({ flatShading: true }));
    this.scene.add(sphere);

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ color: 0xe0e0e0 }));
    plane.position.y = -200;
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);

    return sphere;
  }

  private setEffect() {
    const effect = new AsciiEffect(this.renderer.instance,' .:-=+*#%@', {invert: true});
    effect.setSize(this.experience.config.width * this.experience.config.pixelRatio, this.experience.config.height * this.experience.config.pixelRatio);
    effect.domElement.style.backgroundColor = "black";
    effect.domElement.style.color = 'white';
    this.experience.canvasWrapper.appendChild(effect.domElement);
    
    return effect;
  }

  update() {
    this.sphere.position.y = Math.abs(Math.sin(this.experience.time.current * 0.001)) * 200;
    this.sphere.rotation.y += 0.003;
    this.sphere.rotation.x += 0.003;
    this.effect.render(this.scene, this.camera.instance);
  }
}