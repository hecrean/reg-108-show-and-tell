import { writable } from "svelte/store";
import type { Hotspot } from "@/data/state";
import { Camera, Matrix4, Renderer, Vector3 } from "three";

//https://discourse.threejs.org/t/reconstruct-world-position-in-screen-space-from-depth-buffer/5532

// const sp = () => {

// // Position in normalized screen coords: ADD CAMERA
// gl_Position = projectionMatrix * viewMatrix * worldPosition;
// }

const screenspacePosition = (
  position: Vector3,
  viewProjectionMatrix: Matrix4,
  canvasWidth: number,
  canvasHeight: number
) => {
  /**
   *  * uniform mat4 modelMatrix; ✅ 			// = object.matrixWorld
   * uniform mat4 modelViewMatrix; ✅ 	// = camera.matrixWorldInverse * object.matrixWorld
   * uniform mat4 projectionMatrix; ✅ 	// = camera.projectionMatrix
   * uniform mat4 viewMatrix; ✅				// = camera.matrixWorldInverse
   * uniform mat3 normalMatrix; ✅			// = inverse transpose of modelViewMatrix
   * uniform vec3 cameraPosition; ✅
   */
  const worldspaceCoordinates = position.clone();
  worldspaceCoordinates.applyMatrix4(viewProjectionMatrix);

  const widthHalf = canvasWidth / 2;
  const heightHalf = canvasHeight / 2;

  const screenSpaceCoords = new Vector3(
    worldspaceCoordinates.x * widthHalf + widthHalf,
    -(worldspaceCoordinates.y * heightHalf) + heightHalf
  );
  return screenSpaceCoords;
};

const createHotspotsStore = () => {
  const { subscribe, set, update } = writable<Array<Hotspot>>([]);

  return {
    subscribe,
    set,
    update,
    updatePositions: (camera: Camera, renderer: Renderer) => {
      return update((hotspots) =>
        hotspots.map((hotspot) => ({
          ...hotspot,
          screenspaceCoordinates: screenspacePosition(
            hotspot.worldspaceCoordinates,
            camera.projectionMatrixInverse,
            renderer.domElement.width,
            renderer.domElement.height
          ),
        }))
      );
    },
    reset: () => set([]),
    setHotspots: (hs: Array<Hotspot>) => set(hs),
  };
};

const hotspotsStore = createHotspotsStore();

export { hotspotsStore };

// element.style.transform = 'translate(-50%,-50%) translate(' + ( _vector.x * _widthHalf + _widthHalf ) + 'px,' + ( - _vector.y * _heightHalf + _heightHalf ) + 'px)';
