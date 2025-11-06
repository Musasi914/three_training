import { GeometryUtils } from "three/examples/jsm/Addons.js";
import Experience from "../experience/Experience";
import * as THREE from "three";

export class Example11 {
  experience: Experience;
  scene: Experience["scene"];
  renderer: Experience["renderer"];
  camera: Experience["camera"];
  config: Experience["config"];

  offset = 0;

  dpr:number;
  textureSize: number;

  vector: THREE.Vector2;
  color: THREE.Color;

  cameraOrtho: THREE.OrthographicCamera;
  sceneOrtho : THREE.Scene;

  texture: THREE.FramebufferTexture;

  sprite: THREE.Sprite;
  line: THREE.Line;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.camera = this.experience.camera;
    this.camera.instance.position.z = 20;
    this.config = this.experience.config;

    this.dpr = this.experience.config.pixelRatio;
    this.textureSize = 128 * this.dpr;
    this.vector = new THREE.Vector2();
    this.color = new THREE.Color();

    this.cameraOrtho = new THREE.OrthographicCamera(-this.config.width / 2, this.config.width / 2, this.config.height / 2, -this.config.height / 2, 1, 10);
    this.cameraOrtho.position.z = 10;
    this.sceneOrtho = new THREE.Scene();

    this.line = this.createBuffer();

    this.texture = new THREE.FramebufferTexture(this.textureSize, this.textureSize);

    this.sprite = this.createSprite();

    this.renderer.instance.autoClear = false
  }

  private createBuffer() {
    const points = GeometryUtils.gosper(8);

    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.Float32BufferAttribute(points, 3);
    geometry.setAttribute("position", positionAttribute);
    geometry.center();

    const colorAttribute = new THREE.Float32BufferAttribute(new Float32Array(positionAttribute.array.length), 3);
    colorAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('color', colorAttribute);

    const material = new THREE.LineBasicMaterial({vertexColors: true});

    const line = new THREE.Line(geometry, material);
    line.scale.setScalar(0.05)
    this.scene.add(line);

    return line;
  }

  private createSprite() {
    const spriteMaterial = new THREE.SpriteMaterial({map: this.texture})
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(this.textureSize, this.textureSize, 1);
    
    const halfWidth = this.config.width / 2;
    const halfHeight = this.config.height / 2;
    
    const halfImageWidth = this.textureSize / 2;
    const halfImageHeight = this.textureSize / 2;
    
    sprite.position.set( - halfWidth + halfImageWidth, halfHeight - halfImageHeight, 1 );
    
    this.sceneOrtho.add(sprite);
    return sprite;
  }

  update() {
    const colorAttribute = this.line.geometry.getAttribute('color') as THREE.BufferAttribute;
    this.updateColors(colorAttribute);
    
    this.renderer.instance.clear();
    this.renderer.instance.render(this.scene, this.camera.instance);

    this.vector.x = (this.config.width / 2) - (this.textureSize / 2);
    this.vector.y = (this.config.height / 2) - (this.textureSize / 2);

    this.renderer.instance.copyFramebufferToTexture(this.texture, this.vector);

    this.renderer.instance.clearDepth();
    this.renderer.instance.render(this.sceneOrtho, this.cameraOrtho);
  }

  private updateColors(colorAttribute: THREE.BufferAttribute) {
    const l = colorAttribute.count;

    for(let i = 0; i < l; i++) {
      const h = ((i + this.offset) % l) / l;

      this.color.setHSL(h, 1, 0.5);
      colorAttribute.setX(i, this.color.r);
      colorAttribute.setY(i, this.color.g);
      colorAttribute.setZ(i, this.color.b);
    }
    colorAttribute.needsUpdate = true;
    this.offset -= 25;
  }
}