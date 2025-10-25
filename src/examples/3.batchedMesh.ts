import Experience from "../experience/Experience";
import * as THREE from "three";
import { diffuseColor, directionToColor, normalView } from "three/tsl";

export class Example3 {
  experience: Experience;
  scene: Experience["scene"];
  resource: Experience["resource"];

  mesh: THREE.BatchedMesh | null;
  material: THREE.MeshBasicNodeMaterial | null;
  position: THREE.Vector3 = new THREE.Vector3();
  rotation: THREE.Euler = new THREE.Euler();
  quaternion: THREE.Quaternion = new THREE.Quaternion();
  scale: THREE.Vector3 = new THREE.Vector3();
  matrix: THREE.Matrix4 = new THREE.Matrix4();
  euler: THREE.Euler = new THREE.Euler();
  MAX_GEOMETRY_COUNT = 20000;
  api = {
    webgpu: true,
    count: 512,
    dynamic: 512,
    sortObjects: true,
    perObjectFrustumCulled: true,
    opacity: 1,
    useCustomSort: true,
  } as const;
  geometries = [
    new THREE.ConeGeometry(1, 2),
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.SphereGeometry(1, 16, 8),
  ];
  ids: number[] = [];

  _options = null;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resource = this.experience.resource;

    this.material = null;
    this.mesh = null;

    this.initBatchedMesh();
  }

  private initBatchedMesh() {
    const geometryCount = this.api.count;
    const vertexCount = this.geometries.length * 216;
    const indexCount = this.geometries.length * 512;

    this.mesh = new THREE.BatchedMesh(
      geometryCount,
      vertexCount,
      indexCount,
      this.createMaterial()
    );
    this.mesh.userData.rotationSpeeds = [];
    this.mesh.frustumCulled = false;

    const geometryIds = [
      this.mesh.addGeometry(this.geometries[0]),
      this.mesh.addGeometry(this.geometries[1]),
      this.mesh.addGeometry(this.geometries[2]),
    ];

    for (let i = 0; i < this.api.count; i++) {
      const id = this.mesh.addInstance(geometryIds[i % geometryIds.length]);
      this.mesh.setMatrixAt(id, this.randomizeMatrix());
      this.mesh.setColorAt(id, new THREE.Color(Math.random() * 0xffffff));

      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationFromEuler(this.randomizeRotationSpeed());
      this.mesh.userData.rotationSpeeds.push(rotationMatrix);

      this.ids.push(id);
    }

    this.scene.add(this.mesh);
  }

  private randomizeMatrix() {
    this.position.set(
      Math.random() * 40 - 20,
      Math.random() * 40 - 20,
      Math.random() * 40 - 20
    );
    this.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    this.quaternion.setFromEuler(this.rotation);
    this.scale.x = this.scale.y = this.scale.z = 0.5 + Math.random() * 0.5;

    return this.matrix.compose(this.position, this.quaternion, this.scale);
  }
  private randomizeRotationSpeed() {
    this.rotation.x = Math.random() * 0.01;
    this.rotation.y = Math.random() * 0.01;
    this.rotation.z = Math.random() * 0.01;
    return this.rotation;
  }

  private createMaterial() {
    if (!this.material) {
      // TSLを使用するにはMeshStandardMaterialを使用する必要がある
      this.material = new THREE.MeshBasicNodeMaterial();

      // TSLノードを設定
      this.material.outputNode = diffuseColor.mul(
        directionToColor(normalView).y.add(0.5)
      );
    }

    return this.material;
  }

  update() {
    this.animateMeshes();

    // if (this.mesh?.isBatchedMesh) {
    //   this.mesh.sortObjects = true;
    //   this.mesh.perObjectFrustumCulled = true;
    // }
  }

  private animateMeshes() {
    const loopNum = Math.min(this.api.count, this.api.dynamic);
    for (let i = 0; i < loopNum; i++) {
      const rotationMatrix = this.mesh?.userData.rotationSpeeds[i];
      const id = this.ids[i];

      this.mesh?.getMatrixAt(id, this.matrix);
      this.matrix.multiply(rotationMatrix);
      this.mesh?.setMatrixAt(id, this.matrix);
    }
  }
}
