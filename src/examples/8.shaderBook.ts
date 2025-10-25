import Experience from "../experience/Experience";
import * as THREE from "three";

// 本のパラメータ
const BOOK_WIDTH = 0.8;
const BOOK_HEIGHT = 1.0;
const BOOK_DEPTH = 0.01;
const COVER_WIDTH = 0.1;
const PAGE_COUNT = 12; // ページ数
const PAGE_THICKNESS = 0.001; // 各ページの厚さ

// シェーダー定義
const vertexShader = `
uniform float bendFactor;
uniform float openProgress;
uniform float waveAmplitude;
uniform float isLeftSide; 

varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 pos = position;
    
    // ページの中央部分に山型の変形を作成
    float hump = clamp(1.0 - 4.0 * pow(uv.x - 0.5, 2.0), 0.0, 1.0);
    
    // 開く進行度に応じて変形を計算
    float bending = hump * openProgress * waveAmplitude;
    
    // 左右のページを区別して反対方向に曲げる
    if (isLeftSide > 0.5) {
        bending = -bending;
    }
    
    // Z軸方向に変形を適用
    pos.z += bending * bendFactor;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

const fragmentShader = `
varying vec2 vUv;

void main() {
    vec3 color = vec3(0.92, 0.92, 0.92);
    
    // ページの端にグラデーション効果を追加
    float edge = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.05, 0.9, vUv.x);
    color *= 0.9 + 0.1 * edge;
    
    gl_FragColor = vec4(color, 1.0);
}`;

export class ShaderBook {
  experience: Experience;
  scene: Experience["scene"];
  camera: Experience["camera"];
  renderer: Experience["renderer"];
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;

  // 本の要素
  book!: THREE.Group;
  leftPageGroup!: THREE.Group;
  rightPageGroup!: THREE.Group;
  pages: THREE.Group[] = [];
  leftPagesPivotList: THREE.Group[] = [];

  // アニメーション制御
  isOpen: boolean = false;
  animationProgress: number = 0;
  targetProgress: number = 0;

  // シェーダー関連
  pageUniforms: any;
  leftPageMaterial!: THREE.ShaderMaterial;
  rightPageMaterial!: THREE.ShaderMaterial;
  pageGeometry!: THREE.PlaneGeometry;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.renderer = this.experience.renderer;

    // デバッグ用の軸ヘルパー
    const axisHelper = new THREE.AxesHelper(1);
    this.scene.add(axisHelper);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // シェーダーのユニフォームを初期化
    this.initShaderUniforms();

    // 本を作成
    this.createBook();
    this.setupEventListeners();
  }

  private initShaderUniforms() {
    this.pageUniforms = {
      bendFactor: { value: 0.5 },
      openProgress: { value: 0.0 },
      waveAmplitude: { value: 0.3 },
    };
  }

  private createBook() {
    // 本のグループを作成
    this.book = new THREE.Group();

    // ページのジオメトリを作成（高解像度の平面）
    this.pageGeometry = new THREE.PlaneGeometry(
      BOOK_WIDTH,
      BOOK_HEIGHT - 0.002,
      16, // 幅の分割数
      16 // 高さの分割数
    );

    // シェーダーマテリアルを作成
    this.createShaderMaterials();

    // ページを作成
    this.createPages();

    // 本をシーンに追加
    this.book.position.set(0, 0, 0);
    this.scene.add(this.book);
  }

  private createShaderMaterials() {
    // 左ページ用マテリアル
    this.leftPageMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...this.pageUniforms,
        isLeftSide: { value: 1.0 },
      },
      side: THREE.DoubleSide,
      // transparent: true,
      // opacity: 0.95,
    });

    // 右ページ用マテリアル
    this.rightPageMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...this.pageUniforms,
        isLeftSide: { value: 0.0 },
      },
      side: THREE.DoubleSide,
      // transparent: true,
      // opacity: 0.95,
    });
  }

  private createPages() {
    // 左ページグループ
    this.leftPageGroup = new THREE.Group();
    // this.leftPageGroup.position.set(0, 0, 0);
    // this.leftPageGroup.rotation.y = Math.PI / 2;

    // 右ページグループ
    this.rightPageGroup = new THREE.Group();
    // this.rightPageGroup.position.set(0, BOOK_HEIGHT / 2, BOOK_DEPTH / 2);
    // this.rightPageGroup.rotation.y = Math.PI / 2;

    // 各ページを作成
    for (let i = 0; i < PAGE_COUNT; i++) {
      if (i < PAGE_COUNT / 2) {
        // 右ページ
        const pageMesh = new THREE.Mesh(
          this.pageGeometry,
          this.rightPageMaterial
        );
        pageMesh.castShadow = true;
        pageMesh.receiveShadow = true;

        const pageOffset = (i - (PAGE_COUNT - 1) / 2) * PAGE_THICKNESS;
        pageMesh.position.set(0, 0, pageOffset);

        this.rightPageGroup.add(pageMesh);
      } else {
        // 左ページ
        const pageMesh = new THREE.Mesh(
          this.pageGeometry,
          this.leftPageMaterial
        );
        pageMesh.castShadow = true;
        pageMesh.receiveShadow = true;

        const pageOffset = (i - (PAGE_COUNT - 1) / 2) * PAGE_THICKNESS;
        pageMesh.position.set(
          BOOK_DEPTH / 2,
          0,
          pageOffset + PAGE_THICKNESS / -2
        );

        // 左ページ用のピボットグループ
        const pivotGroup = new THREE.Group();
        pivotGroup.position.set(
          -BOOK_DEPTH,
          BOOK_HEIGHT / 2,
          PAGE_THICKNESS / 2
        );
        pivotGroup.add(pageMesh);

        this.leftPageGroup.add(pivotGroup);
        this.leftPagesPivotList.push(pivotGroup);
      }
    }

    // グループを本に追加
    this.book.add(this.leftPageGroup);
    this.book.add(this.rightPageGroup);
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
      this.book.children,
      true
    );

    if (intersects.length > 0) {
      this.toggleBook();
    }
  }

  private toggleBook() {
    this.isOpen = !this.isOpen;
    this.targetProgress = this.isOpen ? 1 : 0;
  }

  update() {
    // アニメーション進行
    const speed = 0.01;
    this.animationProgress +=
      (this.targetProgress - this.animationProgress) * speed;

    // シェーダーのユニフォームを更新
    this.leftPageMaterial.uniforms.openProgress.value = this.animationProgress;
    this.rightPageMaterial.uniforms.openProgress.value = this.animationProgress;

    // 左ページのアニメーション
    this.animateLeftPages();
  }

  private animateLeftPages() {
    // 表紙が開き始めてからページがめくられるように遅延を設定
    const pageAnimationStart = 0.2;
    const pageAnimationProgress = Math.max(
      0,
      (this.animationProgress - pageAnimationStart) / (1 - pageAnimationStart)
    );

    this.leftPagesPivotList.forEach((pivotGroup, index) => {
      // 各ページのアニメーション開始タイミングをずらす
      const pageDelay = (index / (this.leftPagesPivotList.length - 1)) * 0.3;
      const pageProgress = Math.max(
        0,
        Math.min(1, (pageAnimationProgress - pageDelay) / 0.15)
      );

      if (pageProgress > 0) {
        // ページがめくられる角度（180度まで）
        const pageAngle = pageProgress * Math.PI;
        pivotGroup.rotation.y = -pageAngle;

        // ページがめくられるときに少し前に移動
        const pageOffset = pageProgress * 0.1;
        pivotGroup.position.x = -BOOK_DEPTH + pageOffset;
      }
    });
  }
}
