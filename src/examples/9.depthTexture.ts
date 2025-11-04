import Experience from "../experience/Experience";
import * as THREE from "three";

const vertexShader = `
	varying vec2 vUv;
	void main() {
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		vUv = uv;
	}
`;

const fragmentShader = `
	#include <packing>
	uniform sampler2D uDiffuse;
	uniform sampler2D uDepth;
	uniform float cameraNear;
	uniform float cameraFar;

	varying vec2 vUv;

	void main() {
		float fragCoordZ = texture2D(uDepth, vUv).r;
		float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
		float depth = viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
		vec4 textureColor = texture2D(uDiffuse, vUv);
		gl_FragColor = vec4(vec3(depth), 1.0);
	}
`;

export class Example9 {
  experience: Experience;
  scene: Experience["scene"];
  renderer: Experience["renderer"];
  camera: Experience["camera"];

  resource: Experience["resource"];
  gui: Experience["gui"];

  target: THREE.WebGLRenderTarget;

  postCamera: THREE.OrthographicCamera;
  postMaterial: THREE.ShaderMaterial;
  postScene: THREE.Scene;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.camera = this.experience.camera;
    this.resource = this.experience.resource;
    this.gui = this.experience.gui;
    this.camera.instance.position.set(0, 0, 15);

    this.target = this.setupRenderTarget();

    this.setupScene();

    const { postCamera, postMaterial, postScene } = this.setupPost();
    this.postCamera = postCamera;
    this.postMaterial = postMaterial;
    this.postScene = postScene;
  }

  private setupRenderTarget() {
    if (this.target) this.target.dispose();

    const dpr = this.experience.config.pixelRatio;

    const target = new THREE.WebGLRenderTarget(
      this.experience.config.width * dpr,
      this.experience.config.height * dpr
    );
    target.texture.minFilter = THREE.NearestFilter;
    target.texture.magFilter = THREE.NearestFilter;
    target.texture.generateMipmaps = false;

    target.depthTexture = new THREE.DepthTexture(
      this.experience.config.width * dpr,
      this.experience.config.height * dpr
    );

    return target;
  }

  private setupScene() {
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64);
    const material = new THREE.MeshBasicMaterial({ color: "blue" });

    const count = 50;
    const scale = 5;

    for (let i = 0; i < count; i++) {
      // const r = Math.random() * 2 * Math.PI;
      // const z = Math.random() * 2 - 1;
      // const zScale = Math.sqrt(1 - z * z) * scale;

      const phi = Math.random() * 2 * Math.PI;
      const theta = Math.random() * Math.PI;
      const spherical = new THREE.Spherical(scale, phi, theta);
      const sphericalPosition = new THREE.Vector3().setFromSpherical(spherical);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(sphericalPosition);
      // mesh.position.set(Math.cos(r) * zScale, Math.sin(r) * zScale, z * scale);
      mesh.rotation.set(Math.random(), Math.random(), Math.random());
      this.scene.add(mesh);
    }
  }

  private setupPost() {
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const postMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        cameraNear: { value: this.camera.instance.near },
        cameraFar: { value: this.camera.instance.far },
        uDiffuse: { value: null },
        uDepth: { value: null },
      },
    });

    const postPlane = new THREE.PlaneGeometry(2, 2);
    const postQuad = new THREE.Mesh(postPlane, postMaterial);
    const postScene = new THREE.Scene();
    postScene.add(postQuad);

    return { postCamera, postMaterial, postScene };
  }

  update() {
    this.renderer.instance.setRenderTarget(this.target);
    this.renderer.instance.render(this.scene, this.camera.instance);

    this.postMaterial.uniforms.uDiffuse.value = this.target.texture;
    this.postMaterial.uniforms.uDepth.value = this.target.depthTexture;

    this.renderer.instance.setRenderTarget(null);
    this.renderer.instance.render(this.postScene, this.postCamera);
  }
}
