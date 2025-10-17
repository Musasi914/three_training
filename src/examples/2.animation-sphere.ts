import * as THREE from "three";
import Experience from "../experience/Experience";
import { TransformControls, type GLTF } from "three/examples/jsm/Addons.js";
import {
  CCDIKHelper,
  CCDIKSolver,
} from "three/addons/animation/CCDIKSolver.js";

export class Example2 {
  experience: Experience;
  scene: Experience["scene"];
  resource: Experience["resource"];
  model: GLTF;
  OOI: Record<string, THREE.Mesh | THREE.Bone | THREE.Group> = {};
  cubeCamera: THREE.CubeCamera | null = null;
  ccdikSolver: CCDIKSolver;
  v0: THREE.Vector3 = new THREE.Vector3();
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resource = this.experience.resource;

    this.model = this.setModel();
    this.setCamera();

    // 腕と球をくっつける
    this.OOI.hand_l.attach(this.OOI.boule);

    this.setBouleMaterial();

    this.ccdikSolver = this.setCCDIKSolver();

    this.setTransformControls();

    console.log(this.OOI.Kira_Shirt_left);
  }

  private setModel() {
    const gltf = this.resource.items.model;
    gltf.scene.traverse((child: THREE.Mesh | THREE.Bone | THREE.Group) => {
      if (
        child.name === "head" ||
        child.name === "lowerarm_l" ||
        child.name === "Upperarm_l" ||
        child.name === "hand_l" ||
        child.name === "target_hand_l" ||
        child.name === "boule" ||
        child.name === "Kira_Shirt_left"
      ) {
        this.OOI[child.name] = child;
      }
    });
    this.scene.add(gltf.scene);
    return gltf;
  }

  private setCamera() {
    const targetPosition = this.OOI.boule.position;
    this.experience.camera.controls.target.set(
      targetPosition.x,
      targetPosition.y,
      targetPosition.z
    );
  }

  private setBouleMaterial() {
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      type: THREE.HalfFloatType,
    });
    this.cubeCamera = new THREE.CubeCamera(0.1, 40, cubeRenderTarget);
    this.scene.add(this.cubeCamera);
    const mirrorSphereMaterial = new THREE.MeshBasicMaterial({
      envMap: cubeRenderTarget.texture,
    });
    (this.OOI.boule as THREE.Mesh).material = mirrorSphereMaterial;
  }

  private setCCDIKSolver() {
    const skelton = this.OOI.Kira_Shirt_left;
    const iks = [
      {
        target: 22,
        effector: 6,
        links: [
          {
            index: 5,
            rotationMin: new THREE.Vector3(1.2, -1.8, -0.4),
            rotationMax: new THREE.Vector3(1.7, -1.1, 0.3),
          },
          {
            index: 4,
            rotationMin: new THREE.Vector3(0.1, -0.7, -1.8),
            rotationMax: new THREE.Vector3(1.1, 0, -1.4),
          },
        ],
      },
    ];
    console.log(skelton);
    const solver = new CCDIKSolver(skelton as THREE.SkinnedMesh, iks);

    return solver;
  }

  private setTransformControls() {
    const transformControls = new TransformControls(
      this.experience.camera.instance,
      this.experience.canvasWrapper
    );
    transformControls.attach(this.OOI.target_hand_l);
    this.scene.add(transformControls.getHelper());

    transformControls.addEventListener(
      "mouseDown",
      () => (this.experience.camera.controls.enabled = false)
    );
    transformControls.addEventListener(
      "mouseUp",
      () => (this.experience.camera.controls.enabled = true)
    );
  }

  update() {
    if (!this.OOI.boule || !this.cubeCamera) return;
    this.OOI.boule.visible = false;
    this.OOI.boule.getWorldPosition(this.cubeCamera.position);
    this.cubeCamera.update(this.experience.renderer.instance, this.scene);
    this.OOI.boule.visible = true;

    this.OOI.boule.getWorldPosition(this.v0);
    this.experience.camera.controls.target.lerp(this.v0, 0.1);

    this.OOI.boule.getWorldPosition(this.v0);
    this.OOI.head.lookAt(this.v0);
    this.OOI.head.rotation.set(
      this.OOI.head.rotation.x,
      this.OOI.head.rotation.y + Math.PI,
      this.OOI.head.rotation.z
    );

    this.ccdikSolver.update();
  }
}
