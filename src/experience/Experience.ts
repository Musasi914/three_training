import { Camera } from "./base/Camera";
import { Renderer } from "./base/Renderer";
import { Size } from "./utils/Size";
import { Time } from "./utils/Time";
import * as THREE from "three";
import { World } from "./world/World";
import { GUI } from "lil-gui";
import { Resource } from "./base/Resource";
import { sources } from "./source";
import { Environment } from "./world/Environment";

export default class Experience {
  static instance: Experience;
  static getInstance(): Experience {
    return this.instance;
  }

  canvasWrapper: HTMLDivElement;
  config: {
    width: number;
    height: number;
    pixelRatio: number;
  };
  size: Size;
  time: Time;
  gui: GUI;
  scene: THREE.Scene;
  camera: Camera;
  renderer: Renderer;
  resource: Resource;
  environment: Environment;
  world: World;

  constructor(canvasWrapper: HTMLDivElement) {
    Experience.instance = this;
    this.canvasWrapper = canvasWrapper;

    this.size = new Size();
    this.time = new Time();
    this.gui = new GUI();

    this.config = this.setConfig();

    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.resource = new Resource(sources);

    this.environment = new Environment();
    this.world = new World();

    this.size.on("resize", this.resize.bind(this));
    this.time.on("tick", this.update.bind(this));
  }

  private setConfig() {
    const boundingBox = this.canvasWrapper.getBoundingClientRect();
    return {
      width: boundingBox.width,
      height: boundingBox.height,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    };
  }

  private resize() {
    this.config = this.setConfig();

    this.camera.resize();
    this.renderer.resize();
  }

  private update() {
    this.camera.update();
    this.renderer.update();
    this.world.update();
  }
}
