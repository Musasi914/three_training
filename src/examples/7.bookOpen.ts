import Experience from "../experience/Experience";
import * as THREE from "three";
import { Book } from "./7.one-book";

export class Example7 {
  experience: Experience;
  scene: Experience["scene"];
  camera: Experience["camera"];
  renderer: Experience["renderer"];
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;

  newBook: Book;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.renderer = this.experience.renderer;

    const axisHelper = new THREE.AxesHelper(1);
    this.scene.add(axisHelper);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.setupEventListeners();

    this.newBook = new Book();
  }

  private setupEventListeners() {
    window.addEventListener("click", (event) => {
      this.onMouseClick(event);
    });
  }

  private onMouseClick(event: MouseEvent) {
    // マウス座標を正規化
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // レイキャスターを更新
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);

    // 本との交差をチェック
    const intersects = this.raycaster.intersectObjects(
      [this.newBook.book],
      true
    );

    if (intersects.length > 0) {
      this.newBook.animate();
    }
  }
}
