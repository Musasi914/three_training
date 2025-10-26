import * as THREE from "three";
import Experience from "../experience/Experience";

export class Example6 {
  experience: Experience;
  scene: Experience["scene"];
  renderer: Experience["renderer"];

  spotLight: THREE.SpotLight;

  localPlane: THREE.Plane;
  globalPlane: THREE.Plane;

  material: THREE.MeshPhongMaterial;
  geometry: THREE.BoxGeometry;
  mesh: THREE.Mesh;

  // ground: THREE.Mesh;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;

    this.experience.camera.instance.position.set(0, 3, 5);

    this.spotLight = this.setSpotLight();

    const { localPlane, globalPlane } = this.createClippingPlanes();
    this.localPlane = localPlane;
    this.globalPlane = globalPlane;

    this.material = new THREE.MeshPhongMaterial({
      color: 0x80ee10,
      shininess: 100,
      side: THREE.DoubleSide,

      clippingPlanes: [this.localPlane],
      clipShadows: true,

      alphaToCoverage: true,
    });
    this.geometry = new THREE.BoxGeometry(20, 20, 20);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = 0.8;
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);

    // this.ground = this.setGround();

    this.renderer.instance.localClippingEnabled = true;
    this.renderer.instance.clippingPlanes = [];

    this.setGUI();
  }

  private setSpotLight() {
    const spotLight = new THREE.SpotLight(0xffffff, 60);
    spotLight.position.set(2, 3, 3);
    spotLight.castShadow = true;
    spotLight.penumbra = 0.2;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 3;
    spotLight.shadow.camera.far = 10;
    spotLight.shadow.camera.fov = 30;
    this.scene.add(spotLight);

    return spotLight;
  }

  private createClippingPlanes() {
    const localPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.8);
    const globalPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.1);
    return { localPlane, globalPlane };
  }

  private setGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshPhongMaterial({ color: 0xa0adaf, shininess: 150 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    return ground;
  }

  private setGUI() {
    const gui = this.experience.gui;

    // local clipping
    const folderLocal = gui.addFolder("Local Clipping");
    folderLocal
      .add(this.renderer.instance, "localClippingEnabled")
      .onChange((v: boolean) => {
        this.renderer.instance.localClippingEnabled = v;
      })
      .name("enabled");

    folderLocal.add(this.material, "clipShadows").onChange((v: boolean) => {
      this.material.clipShadows = v;
    });

    folderLocal
      .add(this.localPlane, "constant", 0.3, 1.25)
      .onChange((v: number) => {
        this.localPlane.constant = v;
      });

    // global clipping
    const tmp = {
      boolean: false,
    };
    const folderGlobal = gui.addFolder("Global Clipping");
    folderGlobal
      .add(tmp, "boolean")
      .onChange((v: boolean) => {
        this.renderer.instance.clippingPlanes = v ? [this.globalPlane] : [];
      })
      .name("enabled");

    folderGlobal
      .add(this.globalPlane, "constant", -1.25, 1.25)
      .onChange((v: number) => {
        this.globalPlane.constant = v;
      });
  }

  update() {
    this.mesh.rotation.x = this.experience.time.current * 0.0005;
    this.mesh.rotation.y = this.experience.time.current * 0.0002;
  }
}
