import { Font, TextGeometry } from "three/examples/jsm/Addons.js";
import Experience from "../experience/Experience";
import * as THREE from "three";

const mouse = [0.5, 0.5];
const labeldata = [
  { size: 0.00001, scale: 0.0001, label: "1µm" }, // FIXME - triangulating text fails at this size, so we scale instead
  { size: 0.001, scale: 0.1, label: "1mm" },
  { size: 0.01, scale: 1.0, label: "1cm" },
  { size: 1, scale: 1.0, label: "1m" },
  { size: 10, scale: 1.0, label: "10m" },
  { size: 100, scale: 1.0, label: "100m" },
  { size: 1000, scale: 1.0, label: "1km" },
  { size: 10000, scale: 1.0, label: "10km" },
  { size: 3400000, scale: 1.0, label: " 3,400Km" },
  { size: 12000000, scale: 1.0, label: "12,000km" },
  { size: 1400000000, scale: 1.0, label: "1,400,000km" },
  { size: 7.47e12, scale: 1.0, label: " 50Au" },
  { size: 9.4605284e15, scale: 1.0, label: "1 light year" },
  { size: 3.08567758e16, scale: 1.0, label: "1 parsec" },
  { size: 1e19, scale: 1.0, label: "1000 light years" },
];
let zoomPos = 100;
const minZoom = labeldata[0].size * labeldata[0].scale;
const maxZoom =
  labeldata[labeldata.length - 1].size *
  labeldata[labeldata.length - 1].scale *
  100;

export class Example5 {
  experience: Experience;
  scene: Experience["scene"];
  camera: THREE.PerspectiveCamera;

  font: Font;

  minZoomSpeed = 0.015;
  zoomSpeed = 0.015;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.font = this.experience.resource.items.font;

    this.setData();
    this.update();

    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("wheel", this.onMouseWheel.bind(this));
  }

  private setData() {
    const materialArgs = {
      color: new THREE.Color(0xffffff),
      specular: new THREE.Color(0x050505),
      shininess: 50,
      emissive: new THREE.Color(0x000000),
    };
    const geometry = new THREE.SphereGeometry(0.5, 24, 12);

    for (const data of labeldata) {
      const labelgeo = new TextGeometry(data.label, {
        font: this.font,
        size: data.size,
        depth: data.size / 2,
      });

      labelgeo.computeBoundingSphere();
      labelgeo.translate(-labelgeo.boundingSphere!.radius, 0, 0);

      materialArgs.color = new THREE.Color().setHSL(Math.random(), 0.5, 0.5);

      const material = new THREE.MeshPhongMaterial(materialArgs);

      const group = new THREE.Group();
      group.position.z = -data.size * data.scale;
      this.scene.add(group);

      const textMesh = new THREE.Mesh(labelgeo, material);
      textMesh.scale.set(data.scale, data.scale, data.scale);
      group.add(textMesh);

      const dotMesh = new THREE.Mesh(geometry, material);
      dotMesh.scale.multiplyScalar(data.scale * data.size);
      dotMesh.position.y = (-data.size / 2) * data.scale;
      group.add(dotMesh);
    }
  }

  private onMouseMove(e: MouseEvent) {
    mouse[0] = e.clientX / this.experience.config.width;
    mouse[1] = e.clientY / this.experience.config.height;
  }

  private onMouseWheel(e: WheelEvent) {
    const amount = e.deltaY;

    const dir = (amount / Math.abs(amount)) * 2;

    this.zoomSpeed = dir / 10;
    this.minZoomSpeed = 0.001;
  }

  update() {
    let damping = Math.abs(this.zoomSpeed) > this.minZoomSpeed ? 0.95 : 1;

    const zoom = THREE.MathUtils.clamp(
      Math.pow(Math.E, zoomPos),
      minZoom,
      maxZoom
    );
    zoomPos = Math.log(zoom);

    if (
      (zoom === minZoom && this.zoomSpeed < 0) ||
      (zoom === maxZoom && this.zoomSpeed > 0)
    ) {
      damping = 0.85;
    }

    zoomPos += this.zoomSpeed;
    this.zoomSpeed *= damping;

    this.camera.position.x = Math.sin(0.5 * Math.PI * (mouse[0] - 0.5)) * zoom;
    this.camera.position.y = Math.sin(0.25 * Math.PI * (mouse[1] - 0.5)) * zoom;
    this.camera.position.z = Math.cos(0.5 * Math.PI * (mouse[0] - 0.5)) * zoom;
    this.camera.lookAt(this.scene.position);
  }
}
