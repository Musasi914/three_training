import gsap from "gsap";
import Experience from "../experience/Experience";
import * as THREE from "three";

const vertexShader = `
  uniform float progress;
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
  }
`;
const fragmentShader = `
  varying vec2 vUv;
  void main() {
    vec3 color = vec3(0.9, 0.9, 0.9);
    
    // ページの端にグラデーション効果を追加
    float edge = smoothstep(-0.1, 0.1, vUv.x) * smoothstep(1.1, 0.9, vUv.x);
    color *= 0.5 + edge * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`;
export class Book {
  experience: Experience;
  scene: Experience["scene"];

  book: THREE.Group;

  // book config
  bookWidth = 0.8;
  bookHeight = 1.1;
  coverWidth = 0.05;
  coverThickness = 0.01;

  // cover
  coverLeft: THREE.Group;
  coverRight: THREE.Group;
  coverFront: THREE.Group;
  coverFrontAndLeft: THREE.Group;
  coverMaterial: THREE.MeshBasicMaterial;

  // page
  pageCount = 12;
  leftPageMaterial: THREE.ShaderMaterial;
  rightPageMaterial: THREE.ShaderMaterial;
  leftPagesPivotList: THREE.Group[] = [];
  leftPages: THREE.Group;
  rightPages: THREE.Group;
  pages: THREE.Group;

  animationProgress = { value: 0 };
  isAnimating = false;
  isOpen = false;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;

    this.book = new THREE.Group();

    // cover
    this.coverLeft = new THREE.Group();
    this.coverRight = new THREE.Group();
    this.coverFront = new THREE.Group();
    this.coverFrontAndLeft = new THREE.Group();
    this.coverMaterial = new THREE.MeshBasicMaterial({ color: 0xffddbb });
    this.createCover();

    // page
    this.leftPagesPivotList = [];

    const { leftPageMaterial, rightPageMaterial } = this.createPageMaterials();
    this.leftPageMaterial = leftPageMaterial;
    this.rightPageMaterial = rightPageMaterial;

    this.leftPages = new THREE.Group();
    this.rightPages = new THREE.Group();
    this.pages = new THREE.Group();

    this.createPages();
  }

  private createCover() {
    this.createCoverFront();
    this.createCoverLeft();
    this.createCoverRight();

    this.scene.add(this.book);
  }
  private createCoverFront() {
    const coverFrontGeometry = new THREE.BoxGeometry(
      this.coverThickness,
      this.bookHeight,
      this.coverWidth
    );
    const coverFront = new THREE.Mesh(coverFrontGeometry, this.coverMaterial);
    this.coverFront.add(coverFront);
    this.coverFrontAndLeft.add(this.coverFront);
    this.book.add(this.coverFrontAndLeft);
  }
  private createCoverLeft() {
    const coverLeftGeometry = new THREE.BoxGeometry(
      this.bookWidth,
      this.bookHeight,
      this.coverThickness
    );
    const coverLeft = new THREE.Mesh(coverLeftGeometry, this.coverMaterial);
    coverLeft.position.set(this.bookWidth / 2, 0, 0);
    this.coverLeft.add(coverLeft);
    this.coverLeft.position.set(
      0,
      0,
      this.coverWidth / 2 - this.coverThickness / 2
    );
    this.coverFrontAndLeft.add(this.coverLeft);
    this.book.add(this.coverFrontAndLeft);
  }
  private createCoverRight() {
    const coverRightGeometry = new THREE.BoxGeometry(
      this.bookWidth,
      this.bookHeight,
      this.coverThickness
    );
    const coverRight = new THREE.Mesh(coverRightGeometry, this.coverMaterial);
    coverRight.position.set(
      this.bookWidth / 2,
      0,
      -(this.coverWidth / 2 - this.coverThickness / 2)
    );
    this.coverRight.add(coverRight);
    this.book.add(this.coverRight);
  }

  private createPageMaterials() {
    const leftPageMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        isLeftSide: { value: true },
        progress: { value: 0.0 },
      },
      side: THREE.DoubleSide,
    });
    const rightPageMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        isLeftSide: { value: false },
        progress: { value: 0.0 },
      },
      side: THREE.DoubleSide,
    });
    return { leftPageMaterial, rightPageMaterial };
  }
  private createPages() {
    const leftPageGeometry = new THREE.PlaneGeometry(
      this.bookWidth,
      this.bookHeight,
      16,
      16
    );
    const rightPageGeometry = new THREE.PlaneGeometry(
      this.bookWidth - this.coverWidth / 2,
      this.bookHeight,
      16,
      16
    );
    for (let i = 0; i < this.pageCount; i++) {
      if (i <= this.pageCount / 2) {
        // left page
        const leftOnePage = new THREE.Mesh(
          leftPageGeometry,
          this.leftPageMaterial
        );
        leftOnePage.position.x = this.bookWidth / 2;
        const leftOnePageGroup = new THREE.Group();
        leftOnePageGroup.add(leftOnePage);
        this.leftPagesPivotList.push(leftOnePageGroup);
        this.leftPages.add(leftOnePageGroup);
      } else {
        // right page
        const rightPage = new THREE.Mesh(
          rightPageGeometry,
          this.rightPageMaterial
        );
        rightPage.position.x = this.bookWidth / 2 - this.coverWidth / 4;
        this.rightPages.add(rightPage);
      }
    }

    this.book.add(this.leftPages);
    this.book.add(this.rightPages);
  }

  animate() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    gsap.to(this.animationProgress, {
      value: this.isOpen ? 0 : 1,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        this.animateCover();
      },
      onStart: () => {
        this.animatePages();
      },
      onComplete: () => {
        this.isAnimating = false;
        this.isOpen = !this.isOpen;
      },
    });
  }
  private animateCover() {
    // coverleft
    this.coverLeft.rotation.y = -(this.animationProgress.value * Math.PI) / 2;
    // coverfrontandleft
    this.coverFrontAndLeft.rotation.y =
      -(this.animationProgress.value * Math.PI) / 2;
    // coverFrontAndLeftの位置を移動
    this.coverFrontAndLeft.position.set(
      0,
      0,
      this.animationProgress.value *
        -(this.coverWidth / 2 - this.coverThickness / 2)
    );
  }
  private animatePages() {
    for (let i = 0; i < this.leftPagesPivotList.length; i++) {
      const leftPagePivot = this.leftPagesPivotList[i];
      gsap.to(leftPagePivot.rotation, {
        y: this.isOpen ? 0 : -Math.PI,
        delay: this.isOpen ? 0 : i * 0.05,
        duration: this.isOpen ? 0.85 : 1,
        ease: "power2.inOut",
        onUpdate: () => {
          (
            (leftPagePivot.children[0] as THREE.Mesh)
              .material as THREE.ShaderMaterial
          ).uniforms.progress.value = this.animationProgress.value;
        },
      });
    }
  }
}
