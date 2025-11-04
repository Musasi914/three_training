import { DecalGeometry, type GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../experience/Experience";
import * as THREE from "three";

export class Example8 {
  experience: Experience;
  scene: Experience["scene"];
  camera: Experience["camera"];
  config: Experience["config"];
  resource: Experience["resource"];
  gui: Experience["gui"];

  decalMaterial: THREE.MeshPhongMaterial;
  line: THREE.Line;
  mesh: THREE.Mesh;

  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  intersection = {
    point: new THREE.Vector3(),
    normal: new THREE.Vector3(),
  };
  position = new THREE.Vector3();
  orientation = new THREE.Euler();
  intersects: THREE.Intersection[] = [];

  mouseHelper: THREE.Mesh;

  decals: THREE.Mesh[] = [];

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.camera.instance.position.set(0, 10, 20);
    this.config = this.experience.config;
    this.resource = this.experience.resource;
    this.gui = this.experience.gui;

    this.decalMaterial = this.setDecalMaterial();

    this.line = this.setLine();

    this.mesh = this.setModel();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.mouseHelper = this.setMouseHelper();

    window.addEventListener("pointerup", (e) => {
      this.checkIntersection(e.clientX, e.clientY);
      if (this.intersects.length > 0) {
        this.shoot();
      }
    });

    window.addEventListener("pointermove", (e: PointerEvent) => {
      this.checkIntersection(e.clientX, e.clientY);
    });
  }

  private setDecalMaterial() {
    const decalMaterial = new THREE.MeshPhongMaterial({
      map: this.resource.items.decalDiffuse,
      normalMap: this.resource.items.decalNormal,
      specular: 0x444444,
      shininess: 30,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    });
    return decalMaterial;
  }

  private setLine() {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);

    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial());
    line.frustumCulled = false;
    this.scene.add(line);
    return line;
  }

  private setModel() {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(10, 4, 16, 64),
      new THREE.MeshPhongMaterial({ color: 0x555555 })
    );
    this.scene.add(mesh);
    return mesh;
  }

  private setMouseHelper() {
    const geometry = new THREE.BoxGeometry(1, 1, 10);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }

  private checkIntersection(x: number, y: number) {
    this.mouse.x = (x / this.config.width) * 2 - 1;
    this.mouse.y = -(y / this.config.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);
    this.intersects = this.raycaster.intersectObjects([this.mesh]);
    if (this.intersects.length > 0) {
      const point = this.intersects[0].point;
      const normal = this.intersects[0].normal;
      this.position.copy(point);

      normal?.multiplyScalar(10);
      normal?.add(point);

      this.mouseHelper.position.copy(point);
      this.mouseHelper.lookAt(normal!);

      // // INSERT_YOUR_CODE
      // const positions = this.line.geometry.attributes.position;
      // positions.setXYZ(0, point.x, point.y, point.z);
      // positions.setXYZ(1, normal.x, normal.y, normal.z);
      // positions.needsUpdate = true;
    }
  }

  private shoot() {
    const orientation = this.orientation.copy(this.mouseHelper.rotation);
    orientation.z = Math.random() * Math.PI * 2;

    const geometry = new DecalGeometry(
      this.mesh,
      this.position,
      this.orientation,
      new THREE.Vector3(10, 10, 10)
    );
    const material = this.decalMaterial.clone();
    material.color.setHex(Math.random() * 0xffffff);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = this.decals.length;
    this.scene.add(mesh);
    this.decals.push(mesh);
  }

  // private checkIntersection(x: number, y: number) {
  //   this.mouse.x = (x / this.config.width) * 2 - 1;
  //   this.mouse.y = -(y / this.config.height) * 2 + 1;
  //   this.raycaster.setFromCamera(this.mouse, this.camera.instance);
  //   this.intersects = this.raycaster.intersectObjects(
  //     [this.mesh],
  //     true,
  //     this.intersects
  //   );
  //   if (this.intersects.length > 0) {
  //     if (!this.intersects[0].face) return;

  //     const point = this.intersects[0].point;
  //     this.mouseHelper.position.copy(point);
  //     this.intersection.point.copy(point);

  //     const normalMatrix = new THREE.Matrix3().getNormalMatrix(
  //       this.mesh.matrixWorld
  //     );

  //     const normal = this.intersects[0].face.normal.clone();
  //     normal?.applyNormalMatrix(normalMatrix);
  //     normal?.multiplyScalar(10);
  //     normal?.add(this.intersects[0].point);

  //     this.mouseHelper.lookAt(normal);
  //     this.intersection.normal.copy(this.intersects[0].face.normal);

  //     const positions = this.line.geometry.attributes.position;
  //     positions.setXYZ(0, point.x, point.y, point.z);
  //     positions.setXYZ(1, normal.x, normal.y, normal.z);
  //     positions.needsUpdate = true;

  //     this.intersection.intersects = true;
  //     this.intersects.length = 0;
  //   } else {
  //     this.intersection.intersects = false;
  //   }
  // }

  // private shoot() {
  //   console.log("shoot");
  //   this.position.copy(this.intersection.point);
  //   this.orientation.copy(this.mouseHelper.rotation);

  //   this.orientation.z = Math.random() * Math.PI * 2;

  //   const material = this.decalMaterial.clone();
  //   material.color.setHex(Math.random() * 0xffffff);

  //   const mesh = new THREE.Mesh(
  //     new DecalGeometry(
  //       this.mesh,
  //       this.position,
  //       this.orientation,
  //       new THREE.Vector3(10, 10, 10)
  //     ),
  //     material
  //   );
  //   mesh.renderOrder = this.decals.length;

  //   this.decals.push(mesh);

  //   this.scene.add(mesh);
  // }
}
