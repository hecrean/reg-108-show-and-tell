import type { XFadeMaterial } from "@/lib/three/materials/XFadeMaterial";
import { animate } from "@/lib/three/transitions";
import {
  Mesh,
  PlaneBufferGeometry,
  Texture,
  TextureLoader,
  Vector2,
} from "three";

class ImagePlane extends Mesh<PlaneBufferGeometry, XFadeMaterial> {
  offset: Vector2;
  distanceZ: number;
  aspectRatio: number;

  updateDiffuseMapTexture: (diffuseMap: Texture) => void;
  updateAspectRatio: (aspectRatio: number) => void;
  crossfadeImageSync: (
    textureLoader: TextureLoader,
    url1: string,
    url2: string,
    displacmentTextureUrl: string
  ) => void;
  crossfadeImage: (
    textureLoader: TextureLoader,
    url1: string,
    image1Mirrored: boolean,
    url2: string,
    image2Mirrored: boolean,
    displacmentTextureUrl: string,
    duration: number
  ) => Promise<void>;

  constructor(
    material: XFadeMaterial,
    aspectRatio: number,
    offset: Vector2,
    distanceZ: number
  ) {
    super(new PlaneBufferGeometry(1, 1 / aspectRatio), material);
    this.aspectRatio = aspectRatio;
    this.offset = offset;
    this.distanceZ = distanceZ;

    this.updateDiffuseMapTexture = (diffuseMap: Texture): void => {
      this.material.uDiffuseTexture1 = diffuseMap;
      this.material.needsUpdate = true;
    };
    this.updateAspectRatio = (aspectRatio: number): void => {
      this.aspectRatio = aspectRatio;
      this.geometry = new PlaneBufferGeometry(1, 1 / aspectRatio);
    };
    this.crossfadeImageSync = (
      textureLoader: TextureLoader,
      url1: string,
      url2: string,
      displacmentTextureUrl: string
    ) => {
      const tex1 = textureLoader.load(url1);
      const tex2 = textureLoader.load(url2);
      const displacementTexture = textureLoader.load(displacmentTextureUrl);
      this.material.uDiffuseTexture1 = tex1;
      this.material.uDiffuseTexture2 = tex2;
      this.material.uDispMap = displacementTexture;
    };
    this.crossfadeImage = async (
      textureLoader: TextureLoader,
      url1: string,
      image1Mirrored: boolean,
      url2: string,
      image2Mirrored: boolean,
      displacmentTextureUrl: string,
      duration = 5000
    ) => {
      const tex1 = textureLoader.load(url1);
      const tex2 = textureLoader.load(url2);
      // const displacementTexture = textureLoader.load(displacmentTextureUrl);

      // When disp = 0, uDiffuseTexture1 will be full visible. When disp = 1, uDiffuseTexture2 will be fully visible. 0 < disp < 1 will be an interplation between those states
      this.material.uDiffuseTexture2 = tex2;
      this.material.uTexture1Mirrored = image1Mirrored;
      this.material.uTexture2Mirrored = image2Mirrored;

      await animate({
        from: { disp: 0 },
        to: { disp: 1 },
        duration: duration,
        easeFn: "easeInCubic",
        onTick: ({ disp }) => {
          this.material.uDispFactor = disp;
          this.material.needsUpdate = true;
        },
      }).then(
        () => {
          this.material.uDiffuseTexture1 = tex2;
          // this.material.uDispMap = displacementTexture;
          this.material.uDispFactor = 0;
        },
        () => {}
      );
    };
  }
}

export { ImagePlane };
