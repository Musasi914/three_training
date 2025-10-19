import Experience from "../experience/Experience";
import * as THREE from "three/webgpu";

export class Example4 {
  experience: Experience;
  config: Experience["config"];
  scene: Experience["scene"];
  resource: Experience["resource"];
  renderer: THREE.WebGPURenderer;

  cameraPerspective: THREE.PerspectiveCamera;
  cameraPerspectiveHelper: THREE.CameraHelper;
  cameraRig: THREE.Group;
  mesh: THREE.Mesh;

  constructor() {
    this.experience = Experience.getInstance();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resource = this.experience.resource;
    this.renderer = this.experience.renderer.instance;

    const { cameraPerspective, cameraPerspectiveHelper, cameraRig } =
      this.setExample4Camera();
    this.cameraPerspective = cameraPerspective;
    this.cameraPerspectiveHelper = cameraPerspectiveHelper;
    this.cameraRig = cameraRig;
    this.mesh = this.setExample4Objects();

    this.setStars();

    this.renderer.setScissorTest(true);
  }

  private setExample4Camera() {
    const cameraRig = new THREE.Group();
    const cameraPerspective = new THREE.PerspectiveCamera(
      50,
      this.config.width / (this.config.height * 0.5),
      150,
      1200
    );
    const cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective);
    cameraPerspective.rotation.y = Math.PI;
    this.scene.add(cameraPerspectiveHelper);

    cameraRig.add(cameraPerspective);
    this.scene.add(cameraRig);

    return { cameraPerspective, cameraPerspectiveHelper, cameraRig };
  }

  private setExample4Objects() {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(100, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    );
    this.scene.add(mesh);

    const mesh2 = new THREE.Mesh(
      new THREE.SphereGeometry(50, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    );
    mesh2.position.y = 150;
    mesh.add(mesh2);

    const mesh3 = new THREE.Mesh(
      new THREE.SphereGeometry(5, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
    );
    mesh3.position.z = 150;
    this.cameraRig.add(mesh3);

    return mesh;
  }

  private setStars() {
    const geometry = new THREE.BufferGeometry();
    const positoins = [];
    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      positoins.push(x, y, z);
    }
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positoins, 3)
    );
    const material = new THREE.PointsMaterial({ color: 0x888888, size: 0.01 });
    const stars = new THREE.Points(geometry, material);
    this.scene.add(stars);
  }

  update() {
    const r = this.experience.time.current * 0.0005;
    this.mesh.position.x = Math.cos(r) * 700;
    this.mesh.position.y = Math.sin(r) * 700;
    this.mesh.position.z = Math.sin(r) * 700;

    this.mesh.children[0].position.x = Math.cos(10 * r) * 100;
    this.mesh.children[0].position.y = Math.sin(10 * r) * 100;
    this.mesh.children[0].position.z = Math.sin(10 * r) * 100;

    this.cameraRig.lookAt(this.mesh.position);

    this.updateCamera();
  }

  private updateCamera() {
    this.cameraPerspectiveHelper.visible = false;
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setScissor(0, 0, this.config.width, this.config.height / 2);
    this.renderer.setViewport(0, 0, this.config.width, this.config.height / 2);
    this.renderer.renderAsync(this.scene, this.cameraPerspective);

    this.cameraPerspectiveHelper.visible = true;
    this.renderer.setClearColor(0x111111, 1);
    this.renderer.setScissor(
      0,
      this.config.height / 2,
      this.config.width,
      this.config.height / 2
    );
    this.renderer.setViewport(
      0,
      this.config.height / 2,
      this.config.width,
      this.config.height / 2
    );
    this.renderer.renderAsync(this.scene, this.experience.camera.instance);
  }
}
