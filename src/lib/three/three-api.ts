import { DisplacementMap } from "@/data/displacement-maps";
import type { Hotspot } from "@/data/state";
import { cssLabel } from "@/lib/three/templates/btn";
import { hotspotsStore } from "@/stores/hotspots";

import { none, Option, some, tapO } from "@/utils/option";
import {
  AmbientLight,
  Color,
  Fog,
  Group,
  LoadingManager,
  PerspectiveCamera,
  Scene,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import {
  AfterimagePass,
  CopyShader,
  EffectComposer,
  FilmPass,
  GlitchPass,
  MaskPass,
  RenderPass,
  ShaderPass,
  UnrealBloomPass,
} from "three-stdlib";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { clamp } from "three/src/math/MathUtils";
import { ImagePlane } from "./components/image-plane";
import { Html } from "./components/three-html/Html";
import { XFadeMaterial } from "./materials/XFadeMaterial";
import type { TransitionFnId } from "./transitions";

type Object3dHandles = {
  ambientLight: AmbientLight;
  plane: ImagePlane;
};
type ResourceHandles = {
  rtTexture: Texture;
};

type PostprocessingPassHandles = {
  renderPass: RenderPass;
  effectCopy: ShaderPass;
  filmPass: FilmPass;
  afterImagePass: AfterimagePass;
  unrealBloomPass: UnrealBloomPass;
  maskPass: MaskPass;
  glitchPass: GlitchPass;
};

export type ThreeState = {
  initialised: boolean;
  object3dHandles: Object3dHandles;
  resourceHandles: ResourceHandles;
  passes: PostprocessingPassHandles;
  cssRenderer: CSS2DRenderer;
  renderer: WebGLRenderer;
  composer: EffectComposer;
  camera: PerspectiveCamera;
  scene: Scene;
  cssGroup: Group;
  mouse: Vector2;
  resolution: Vector2;
  assetManager: LoadingManager;
  textureLoader: TextureLoader;
  canvasProxyEl: HTMLDivElement;
};

const createThreeApi = () => {
  let state: Option<ThreeState> = none;

  return {
    state: () => state,
    init: (
      canvasProxyEl: HTMLDivElement,
      canvasEl: HTMLCanvasElement,
      cssEl: HTMLDivElement
    ) => {
      // scenes :
      const scene = new Scene();
      scene.fog = new Fog(0x000000, 1, 1000);
      const cssGroup = new Group();

      //render targets, planes,
      const canvasWidth = canvasEl.clientWidth;
      const canvasHeight = canvasEl.clientHeight;
      const aspect = canvasWidth / canvasHeight;
      const resolution = new Vector2(canvasWidth, canvasHeight);
      const mouse = new Vector2();

      const rtTexture = new Texture();

      const fov = 50;
      const near = 0.1;
      const far = 50;
      const camera = new PerspectiveCamera(fov, aspect, near, far);

      const renderer = new WebGLRenderer({
        antialias: true,
        canvas: canvasEl,
      });

      const dpr = window?.devicePixelRatio || 1;
      renderer.setPixelRatio(dpr);

      const cssRenderer = new CSS2DRenderer({ element: cssEl });

      // asset manager
      const assetManager = new LoadingManager(
        () => {
          console.log(`Loading complete!`);
        },
        (url: string, loaded: number, total: number) =>
          console.log(`Items loaded: ${loaded}/${total}`),
        (url: string) => {
          console.log(`There was an error loading ` + url);
        }
      );
      const textureLoader = new TextureLoader(assetManager);

      const ambientLight = new AmbientLight(new Color("white"), 1);

      const plane = new ImagePlane(
        new XFadeMaterial({
          uTexture1Mirrored: false,
          uTexture2Mirrored: false,
          uMouse: mouse,
          uResolution: resolution,
          uDiffuseTexture1: Texture.DEFAULT_IMAGE,
          uDiffuseTexture2: Texture.DEFAULT_IMAGE,
          uDispMap: textureLoader.load(DisplacementMap.COSMOLOGICAL),
        }),
        1 / 1,
        new Vector2(0, 0),
        0
      );

      const fovy = (camera.fov * Math.PI) / 180;
      const { width: planeWidth, height: planeHeight } =
        plane.geometry.parameters;
      const zMax = Math.min(
        planeWidth / (2 * camera.aspect * Math.tan(fovy / 2)),
        planeHeight / (2 * Math.tan(fovy / 2))
      );
      camera.position.z = zMax;

      scene.add(ambientLight, plane, cssGroup);

      const renderPass = new RenderPass(scene, camera);
      const effectCopy = new ShaderPass(CopyShader);
      effectCopy.renderToScreen = true;

      const afterImagePass = new AfterimagePass();
      const unrealBloomPass = new UnrealBloomPass(resolution, 1, 1, 1);
      const maskPass = new MaskPass(scene, camera);
      const filmPass = new FilmPass(1, 1, 1, false);
      const glitchPass = new GlitchPass();

      const composer = new EffectComposer(renderer);
      composer.addPass(renderPass);
      composer.addPass(effectCopy);

      state = some({
        initialised: true,
        object3dHandles: {
          ambientLight,
          plane,
        },
        resourceHandles: {
          rtTexture,
        },
        passes: {
          renderPass,
          effectCopy,
          filmPass,
          glitchPass,
          afterImagePass,
          unrealBloomPass,
          maskPass,
        },
        renderer: renderer,
        cssRenderer: cssRenderer,
        cssGroup: cssGroup,
        composer: composer,
        camera: camera,
        scene: scene,

        mouse: mouse,
        resolution: resolution,
        assetManager: assetManager,
        textureLoader: textureLoader,
        canvasProxyEl: canvasProxyEl,
      });
    },
    pan: (dx: number, dy: number) =>
      tapO((state: ThreeState) => {
        const {
          camera,
          object3dHandles: { plane },
        } = state;

        const dragCoefficient = 0.1;

        const fovy = (camera.fov * Math.PI) / 180;
        const X = 2 * camera.aspect * camera.position.z * Math.tan(fovy / 2);
        const Y = 2 * camera.position.z * Math.tan(fovy / 2);

        const { width, height } = plane.geometry.parameters;
        const position = camera.position;

        const _x = clamp(
          position.x + dx,
          -width / 2 + X / 2,
          width / 2 - X / 2
        );
        const _y = clamp(
          position.y + dy,
          -height / 2 + Y / 2,
          height / 2 - Y / 2
        );

        camera.position.set(_x, _y, position.z);
      })(state),
    dolly: (dz: number) =>
      tapO((state: ThreeState) => {
        const {
          camera,
          object3dHandles: { plane },
        } = state;

        const fovy = (camera.fov * Math.PI) / 180;

        const { width: planeWidth, height: planeHeight } =
          plane.geometry.parameters;

        const zMax = Math.min(
          planeWidth / (2 * camera.aspect * Math.tan(fovy / 2)),
          planeHeight / (2 * Math.tan(fovy / 2))
        );
        const z = clamp(camera.position.z + dz, 0.1, zMax);

        const proposedViewsquareWidth =
          2 * camera.aspect * z * Math.tan(fovy / 2);
        const proposedViewsquareHeight = 2 * z * Math.tan(fovy / 2);

        //left
        const leftBound = -planeWidth / 2 + proposedViewsquareWidth / 2;
        if (camera.position.x < leftBound) {
          camera.position.setX(leftBound);
        }
        //right
        const rightBound = planeWidth / 2 - proposedViewsquareWidth / 2;
        if (camera.position.x > rightBound) {
          camera.position.setX(rightBound);
        }
        //bottom
        const bottomBound = -planeHeight / 2 + proposedViewsquareHeight / 2;
        if (camera.position.y < bottomBound) {
          camera.position.setY(bottomBound);
        }
        //top
        const topBound = planeHeight / 2 - proposedViewsquareHeight / 2;
        if (camera.position.y > topBound) {
          camera.position.setY(topBound);
        }

        state.camera.position.setZ(z);
      })(state),
    render: () =>
      tapO((state: ThreeState) => {
        const {
          renderer,
          canvasProxyEl,
          camera,
          composer,
          scene,
          cssRenderer,
          mouse,
          resolution,
          object3dHandles: { plane },
        } = state;

        const canvas = renderer.domElement;

        const needResize =
          Math.round(canvasProxyEl.clientHeight) !==
            Math.round(canvas.height) ||
          Math.round(canvasProxyEl.clientWidth) !== Math.round(canvas.width);

        if (needResize) {
          const aspect = canvasProxyEl.clientWidth / canvasProxyEl.clientHeight;
          camera.aspect = aspect;
          renderer.setSize(
            canvasProxyEl.clientWidth,
            canvasProxyEl.clientHeight
          );
          cssRenderer.setSize(
            canvasProxyEl.clientWidth,
            canvasProxyEl.clientHeight
          );
          composer.setSize(
            canvasProxyEl.clientWidth,
            canvasProxyEl.clientHeight
          );
          camera.updateProjectionMatrix();
        }

        plane.material.uMouse = mouse;
        plane.material.uResolution = resolution;

        hotspotsStore.updatePositions(camera, renderer);

        composer.render();
        cssRenderer.render(scene, camera);
      })(state),
    resize: (w: number, h: number) =>
      tapO((state: ThreeState) => {
        const { camera, renderer, composer } = state;

        const aspect = w / h;
        camera.aspect = aspect;
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        camera.updateProjectionMatrix();
      })(state),
    //https://dev.to/mstn/tap-ts-type-safe-eavesdropping-2jfp
    changePlaneTexture: async (
      url1: string,
      image1Mirrored: boolean,
      url2: string,
      image2Mirrored: boolean,
      displacmentTextureUrl: string,
      aspectRatio: number,
      temporalTransition: Array<TransitionFnId>,
      positionalTransition: Array<TransitionFnId>
    ) =>
      tapO(async (state: ThreeState) => {
        const {
          object3dHandles: { plane },
          textureLoader,
          camera,
        } = state;

        await plane.crossfadeImage(
          textureLoader,
          url1,
          image1Mirrored,
          url2,
          image2Mirrored,
          displacmentTextureUrl,
          500
        );
        plane.updateAspectRatio(aspectRatio);
      })(state),
    fitPlaneToViewport: () =>
      tapO((state: ThreeState) => {
        const {
          object3dHandles: { plane },
          camera,
        } = state;

        const planeSize = plane.geometry.parameters;

        const vFov = (camera.fov * Math.PI) / 180;

        const cameraZForFittingPlaneHeightInFrame =
          planeSize.height / (2 * Math.tan(0.5 * vFov));
        const cameraZForFittingPlaneWidthInFrame =
          planeSize.width / (2 * camera.aspect * Math.tan(0.5 * vFov));

        const z = Math.min(
          Math.min(
            cameraZForFittingPlaneHeightInFrame,
            cameraZForFittingPlaneWidthInFrame
          ),
          camera.position.z
        );

        camera.position.set(0, 0, z);

        camera.updateProjectionMatrix();
      })(state),
    changeHotspots: (hs: Array<Hotspot>, mirrored: boolean) =>
      tapO((state: ThreeState) => {
        const {
          cssGroup,
          object3dHandles: { plane },
          camera,
        } = state;

        cssGroup.clear();
        cssGroup.add(
          ...hs.map(
            (hs, id) =>
              new Html(
                cssLabel(
                  hs.label,
                  hs.labelOffset,
                  hs.labelLength,
                  hs.pointerType
                ),
                plane,
                hs.worldspaceCoordinates.multiply(
                  new Vector3(mirrored ? -1 : 1, 1, 1)
                )
              )
          )
        );
      })(state),
  };
};

// const asyncApi = (store: ReturnType<typeof createThreeStore>) =>
//   derived(store, ($store, update) => update())

export { createThreeApi };

// const threeApi = {
//   pan: (state: ThreeState) => (dx: number, dy: number) => {
//     const {
//       camera,
//       object3dHandles: { plane },
//     } = state;

//     const dragCoefficient = 0.1;

//     const fovy = (camera.fov * Math.PI) / 180;
//     const X = 2 * camera.aspect * camera.position.z * Math.tan(fovy / 2);
//     const Y = 2 * camera.position.z * Math.tan(fovy / 2);

//     const { width, height } = plane.geometry.parameters;
//     const position = camera.position;

//     const _x = clamp(position.x + dx, -width / 2 + X / 2, width / 2 - X / 2);
//     const _y = clamp(position.y + dy, -height / 2 + Y / 2, height / 2 - Y / 2);

//     camera.position.set(_x, _y, position.z);
//   },
//   dolly: (state: ThreeState) => (dz: number) => {
//     const {
//       camera,
//       object3dHandles: { plane },
//     } = state;

//     const fovy = (camera.fov * Math.PI) / 180;

//     const { width: planeWidth, height: planeHeight } =
//       plane.geometry.parameters;

//     const zMax = Math.min(
//       planeWidth / (2 * camera.aspect * Math.tan(fovy / 2)),
//       planeHeight / (2 * Math.tan(fovy / 2))
//     );
//     const z = clamp(camera.position.z + dz, 0.1, zMax);

//     const proposedViewsquareWidth = 2 * camera.aspect * z * Math.tan(fovy / 2);
//     const proposedViewsquareHeight = 2 * z * Math.tan(fovy / 2);

//     //left
//     const leftBound = -planeWidth / 2 + proposedViewsquareWidth / 2;
//     if (camera.position.x < leftBound) {
//       camera.position.setX(leftBound);
//     }
//     //right
//     const rightBound = planeWidth / 2 - proposedViewsquareWidth / 2;
//     if (camera.position.x > rightBound) {
//       camera.position.setX(rightBound);
//     }
//     //bottom
//     const bottomBound = -planeHeight / 2 + proposedViewsquareHeight / 2;
//     if (camera.position.y < bottomBound) {
//       camera.position.setY(bottomBound);
//     }
//     //top
//     const topBound = planeHeight / 2 - proposedViewsquareHeight / 2;
//     if (camera.position.y > topBound) {
//       camera.position.setY(topBound);
//     }

//     state.camera.position.setZ(z);
//   },
//   render: (state: ThreeState) => () => {
//     const {
//       renderer,
//       canvasProxyEl,
//       camera,
//       composer,
//       scene,
//       cssRenderer,
//       mouse,
//       resolution,
//       object3dHandles: { plane },
//     } = state;

//     const canvas = renderer.domElement;

//     const needResize =
//       Math.round(canvasProxyEl.clientHeight) !== Math.round(canvas.height) ||
//       Math.round(canvasProxyEl.clientWidth) !== Math.round(canvas.width);

//     if (needResize) {
//       const aspect = canvasProxyEl.clientWidth / canvasProxyEl.clientHeight;
//       camera.aspect = aspect;
//       renderer.setSize(canvasProxyEl.clientWidth, canvasProxyEl.clientHeight);
//       cssRenderer.setSize(
//         canvasProxyEl.clientWidth,
//         canvasProxyEl.clientHeight
//       );
//       composer.setSize(canvasProxyEl.clientWidth, canvasProxyEl.clientHeight);
//       camera.updateProjectionMatrix();
//     }

//     plane.material.uMouse = mouse;
//     plane.material.uResolution = resolution;

//     composer.render();
//     cssRenderer.render(scene, camera);
//   },
//   resize: (state: ThreeState) => (w: number, h: number) => {
//     const { camera, renderer, composer } = state;

//     const aspect = w / h;
//     camera.aspect = aspect;
//     renderer.setSize(w, h, false);
//     composer.setSize(w, h);
//     camera.updateProjectionMatrix();
//   },
//   changePlaneTexture:
//     (state: ThreeState) =>
//     (
//       url1: string,
//       url2: string,
//       displacmentTextureUrl: string,
//       aspectRatio: number,
//       temporalTransition: Array<TransitionFnId>,
//       positionalTransition: Array<TransitionFnId>
//     ) => {
//       const {
//         object3dHandles: { plane },
//         textureLoader,
//       } = state;

//       plane.crossfadeImageSync(
//         textureLoader,
//         url1,
//         url2,
//         displacmentTextureUrl
//       );
//       plane.updateAspectRatio(aspectRatio);
//     },
//   fitPlaneToViewport: (state: ThreeState) => () => {
//     const {
//       object3dHandles: { plane },
//       camera,
//     } = state;

//     const planeSize = plane.geometry.parameters;

//     const vFov = (camera.fov * Math.PI) / 180;

//     const cameraZForFittingPlaneHeightInFrame =
//       planeSize.height / (2 * Math.tan(0.5 * vFov));
//     const cameraZForFittingPlaneWidthInFrame =
//       planeSize.width / (2 * camera.aspect * Math.tan(0.5 * vFov));

//     const z = Math.min(
//       Math.min(
//         cameraZForFittingPlaneHeightInFrame,
//         cameraZForFittingPlaneWidthInFrame
//       ),
//       camera.position.z
//     );

//     camera.position.set(0, 0, z);

//     camera.updateProjectionMatrix();
//   },
//   changeHotspots: (state: ThreeState) => (hs: Array<Hotspot>) => {
//     const {
//       cssScene,
//       object3dHandles: { plane },
//       camera,
//     } = state;

//     cssScene.clear();
//     cssScene.add(
//       ...hs.map(
//         (hs, id) =>
//           new Html(
//             document.createElement("div"),
//             plane,
//             new Vector3(hs.position[0], hs.position[1], 0)
//           )
//       )
//     );
//   },
// };

// type Entries<T> = {
//   [K in keyof T]: [K, T[K]];
// }[keyof T][];

// const api = () => Object.fromEntries((Object.entries(threeApi) as Entries<typeof threeApi>).map(
//   ([key, fn]) => [key, tapO(threeApi[key])]
// ));
