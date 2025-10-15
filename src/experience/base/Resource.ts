import EventEmitter from "../utils/EventEmitter";
import {
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { CubeTexture, CubeTextureLoader, Texture, TextureLoader } from "three";
import type { Source } from "../source";

/**
 * リソースの読み込みを管理する
 * triggerは "ready"
 */
export class Resource extends EventEmitter {
  loaders: {
    gltfLoader: GLTFLoader;
    textureLoader: TextureLoader;
    cubeTextureLoader: CubeTextureLoader;
  };
  items: Record<string, any>;
  sources: Source[];
  loaded: number;
  allSources: number;

  constructor(sources: Source[]) {
    super();

    this.loaders = this.setLoaders();
    this.items = {};
    this.sources = sources;
    this.loaded = 0;
    this.allSources = this.sources.length;

    this.startLoading();
  }

  private setLoaders() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    return {
      gltfLoader,
      textureLoader: new TextureLoader(),
      cubeTextureLoader: new CubeTextureLoader(),
    };
  }

  private startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case "model":
          this.loaders.gltfLoader.load(source.path as string, (file) => {
            this.sourceLoaded(source, file);
          });
          break;

        case "texture":
          this.loaders.textureLoader.load(source.path as string, (file) => {
            this.sourceLoaded(source, file);
          });
          break;

        case "cubeTexture":
          this.loaders.cubeTextureLoader.load(
            source.path as string[],
            (file) => {
              this.sourceLoaded(source, file);
            }
          );
          break;

        default:
          break;
      }
    }
  }

  private sourceLoaded(source: Source, item: GLTF | Texture | CubeTexture) {
    this.items[source.name] = item;
    this.loaded++;
    if (this.loaded === this.allSources) {
      this.trigger("ready");
    }
  }
}
