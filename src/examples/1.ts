import gsap from "gsap";
import Experience from "../experience/Experience";
import * as THREE from "three";
import type { Controller } from "lil-gui";

export class Example1 {
  experience: Experience;
  scene: Experience["scene"];
  resource: Experience["resource"];
  model: any;
  mixer: THREE.AnimationMixer;
  gui: Experience["gui"];

  currentBaseAction = "idle";
  allActions: THREE.AnimationAction[] = [];
  baseActions = {
    idle: { weight: 1, action: null },
    walk: { weight: 0, action: null },
    run: { weight: 0, action: null },
  } as Record<string, { weight: number; action: THREE.AnimationAction | null }>;
  additiveActions = {
    sneak_pose: { weight: 0, action: null },
    sad_pose: { weight: 0, action: null },
    agree: { weight: 0, action: null },
    headShake: { weight: 0, action: null },
  } as Record<string, { weight: number; action: THREE.AnimationAction | null }>;
  numAnimations = 0;
  panelSettings: Record<string, (() => void) | number> = {};

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resource = this.experience.resource;
    this.gui = this.experience.gui;

    this.model = this.setModel();
    this.mixer = this.setMixer();

    this.createGUI();
  }

  private setModel() {
    const model = this.resource.items.model;

    model.scene.traverse((child: THREE.Mesh) => {
      if (child.type === "Mesh") {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.scene.add(model.scene);

    // skelton
    const skelton = new THREE.SkeletonHelper(model.scene);
    this.scene.add(skelton);

    return model;
  }

  private setMixer() {
    const mixer = new THREE.AnimationMixer(this.model.scene);
    this.numAnimations = this.model.animations.length;

    console.log(this.model.animations);
    for (let i = 0; i < this.numAnimations; i++) {
      let clip = this.model.animations[i] as THREE.AnimationClip;
      const name = clip.name;

      // base actionsに存在する場合
      if (this.baseActions[name as keyof typeof this.baseActions]) {
        const action = mixer.clipAction(clip);
        this.activateAction(action, name);
        this.baseActions[name].action = action;
        this.allActions.push(action);
      } else if (
        this.additiveActions[name as keyof typeof this.additiveActions]
      ) {
        THREE.AnimationUtils.makeClipAdditive(clip);
        if (name.endsWith("_pose")) {
          clip = THREE.AnimationUtils.subclip(clip, name, 2, 3, 30);
        }
        const action = mixer.clipAction(clip);
        this.activateAction(action, name);
        this.additiveActions[name].action = action;
        this.allActions.push(action);
      }
    }

    return mixer;
  }
  /**　↑ */
  private activateAction(action: THREE.AnimationAction, name: string) {
    const settings = this.baseActions[name] || this.additiveActions[name];
    this.setWeight(action, settings.weight);
    action.play();
  }

  private setWeight(action: THREE.AnimationAction, weight: number) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  }

  private createGUI() {
    const folder1 = this.gui.addFolder("Base Actions");
    const folder2 = this.gui.addFolder("Additive Actions");

    const baseNames = [...Object.keys(this.baseActions)];
    for (const name of baseNames) {
      const settings = this.baseActions[name];
      this.panelSettings[name] = () => {
        const currentSettings = this.baseActions[this.currentBaseAction];
        const currentAction = currentSettings ? currentSettings.action : null;
        const action = settings ? settings.action : null;

        console.log(
          `currentAction: ${currentAction?.getClip().name}, action: ${
            action?.getClip().name
          }`
        );

        if (currentAction !== action) {
          this.prepareCrossFade(
            currentAction as THREE.AnimationAction,
            action as THREE.AnimationAction,
            0.35
          );
          console.log("action");
        }
      };
      folder1.add(this.panelSettings, name);
    }

    for (const name of Object.keys(this.additiveActions)) {
      const settings = this.additiveActions[name];
      this.panelSettings[name] = settings.weight;
      folder2
        .add(this.panelSettings, name, 0.0, 1.0, 0.01)
        .onChange((weight: number) => {
          this.setWeight(settings.action as THREE.AnimationAction, weight);
          settings.weight = weight;
        });
    }
  }
  /** ↑ */
  private prepareCrossFade(
    startAction: THREE.AnimationAction,
    endAction: THREE.AnimationAction,
    duration: number
  ) {
    this.executeCrossFade(startAction, endAction, duration);

    this.currentBaseAction = endAction.getClip().name;
  }

  private executeCrossFade(
    startAction: THREE.AnimationAction,
    endAction: THREE.AnimationAction,
    duration: number
  ) {
    this.setWeight(endAction, 1);
    endAction.time = 0;

    startAction.crossFadeTo(endAction, duration);
  }
}
