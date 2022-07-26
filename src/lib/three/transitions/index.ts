import { DisplacementMap } from "@/data/displacement-maps";
import type { ThreeState } from "@/lib/three/three-api";
import { tween } from "shifty";
import type { EaseFn } from "./ease";
import { EasingFunctions } from "./ease";
// Simple wrapper for the shift tween fn.
interface Animation<T> {
  from: T;
  to: T;
  duration: number;
  easeFn: EaseFn;
  onTick: (props: T) => void;
}
const animate = <T>({ from, to, duration, easeFn, onTick }: Animation<T>) =>
  tween({
    from: from,
    to: to,
    duration: duration,
    easing: EasingFunctions[easeFn],
    render: onTick,
  });

export { animate };

////////////////////////////////////////////////////////////////////////

const noop: () => void = () => {};

const planeDisplaceOutTask = async (
  { textureLoader, object3dHandles: { plane } }: ThreeState,
  url1: string,
  url2: string
) => {
  const tex1 = textureLoader.load(url1);
  const tex2 = textureLoader.load(url2);
  const displacementTexture = textureLoader.load(DisplacementMap.COSMOLOGICAL);

  await animate({
    from: { disp: 0 },
    to: { disp: 0.3 },
    duration: 600,
    easeFn: "easeInCubic",
    onTick: ({ disp }) => {
      plane.material.uDispFactor = disp;
      plane.material.needsUpdate = true;
    },
  }).then(() => {
    plane.material.uDiffuseTexture1 = tex1;
    plane.material.uDiffuseTexture2 = tex2;
    plane.material.uDispMap = displacementTexture;
  }, noop);
};

const planeDisplaceInTask = async ({
  object3dHandles: { plane },
}: ThreeState) => {
  await animate({
    from: { disp: 0.3 },
    to: { disp: 0 },
    duration: 600,
    easeFn: "easeInOutQuad",
    onTick: ({ disp }) => {
      plane.material.uDispFactor = disp;
      plane.material.needsUpdate = true;
    },
  }).then(noop, noop);
};

export const planeTransition = {
  DISPLACE_IN: planeDisplaceInTask,
  DISPLACE_OUT: planeDisplaceOutTask,
  // FADE_OUT: fadeOutTransition,
  // ZOOM_IN: zoomInTransition,
  // ZOOM_FROM_IN: zoomFromInTransition,
  // ZOOM_OUT: zoomOutTransition,
  // ZOOM_FROM_OUT: zoomFromOutTransition,
} as const;

export type PlaneTransitions = typeof planeTransition;
export type PlaneTransitionFnId = keyof PlaneTransitions;

const fullscreenGlitcDecreaseTask = async ({
  passes: { glitchPass },
}: ThreeState) => {
  await animate({
    from: { byp: 0 },
    to: { byp: 2 },
    duration: 200,
    easeFn: "easeInOutQuad",
    onTick: ({ byp }) => {},
  }).then(() => {
    glitchPass.uniforms.byp.value = 2;
  }, noop);
};

const fullscreenGlitchIncreaseTask = async ({
  passes: { glitchPass },
}: ThreeState) => {
  await animate({
    from: { byp: 2 },
    to: { byp: 0 },
    duration: 200,
    easeFn: "easeInOutQuad",
    onTick: ({ byp }) => {},
  }).then(() => {
    glitchPass.uniforms.byp.value = 0;
  }, noop);
};

export const fullscreenTransition = {
  GLITCH_DECREASE: fullscreenGlitcDecreaseTask,
  GLITCH_INCREASE: fullscreenGlitchIncreaseTask,
  // FADE_OUT: fadeOutTransition,
  // ZOOM_IN: zoomInTransition,
  // ZOOM_FROM_IN: zoomFromInTransition,
  // ZOOM_OUT: zoomOutTransition,
  // ZOOM_FROM_OUT: zoomFromOutTransition,
} as const;

export type FullscreenTransition = typeof fullscreenTransition;
export type FullscreenTransitionFnId = keyof FullscreenTransition;

export const transitions = { ...planeTransition, ...fullscreenTransition };

export type TransitionFnId = PlaneTransitionFnId | FullscreenTransitionFnId;
