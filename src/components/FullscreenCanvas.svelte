<script lang="ts">
  import type { CaseStudy, StageADT, ViewADT } from "@/data/state";
  // import { three, type ThreeApi } from '@/lib/three/three-api.store';

  import { Direction, drag, pointerPosition, wheel } from "@/utils/gesture";
  import { resizeObserver } from "@/utils/resize-observer";
  import { onMount } from "svelte";

  import { DisplacementMap } from "@/data/displacement-maps";
  // import { createThreeStore } from "@/lib/three/three-api.store";
  import { createThreeApi } from "@/lib/three/three-api";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import { writable } from "svelte/store";

  /**
   * props
   */
  export let stage: StageADT;
  export let view: ViewADT;
  export let caseStudy: CaseStudy;

  /** fullscreen canvas*/
  const api = createThreeApi();

  let canvasProxyEl: HTMLDivElement;
  let cssEl: HTMLDivElement;
  let canvasEl: HTMLCanvasElement;

  // let pointer = spring(
  //   { dx: 0, dy: 0 },
  //   {
  //     stiffness: 0.1,
  //     damping: 0.25,
  //   }
  // );

  const history = writable<Array<{ stage: StageADT; view: ViewADT }>>([]);
  $: {
    history.update((history) => [...history, { stage: stage, view: view }]);
  }

  $: currImage = caseStudy["stages"][stage]["views"][view][0];
  $: prevViewAndStage =
    $history.length > 2 ? $history[$history.length - 2] : { stage, view };
  $: prevImage =
    caseStudy["stages"][prevViewAndStage.stage]["views"][
      prevViewAndStage.view
    ][0];

  onMount(() => {
    //canvas observables
    api.init(canvasProxyEl, canvasEl, cssEl);

    api.changePlaneTexture(
      prevImage.url,
      prevImage.mirrored,
      currImage.url,
      currImage.mirrored,
      DisplacementMap.COSMOLOGICAL,
      currImage.aspect_ratio,
      [],
      []
    );
    api.changeHotspots(currImage.hotspots, currImage.mirrored);

    const ro$ = resizeObserver(canvasProxyEl);
    const pointerPosition$ = pointerPosition(canvasEl);
    const drag$ = drag(canvasEl, {
      direction: Direction.All,
      pointers: 1,
      threshold: { distancePointerMoved: { min: -Infinity, max: Infinity } },
    });
    const wheel$ = wheel(canvasEl);

    //subscriptions
    const resizeSub = ro$.subscribe(({ width, height }) => {
      //this is a little hack to keep the image at the right zoom level after resizing the canvas
      api.dolly(0.000000001);
    });

    const pointerPositionSub = pointerPosition$.subscribe(() => {});

    const dragSub = drag$.subscribe(
      ({ value: { dNormalisedDeviceCoords, dt } }) => {
        const DRAG_SCALE_FACTOR = 0.5;

        api.pan(
          -DRAG_SCALE_FACTOR * dNormalisedDeviceCoords.dx,
          -DRAG_SCALE_FACTOR * dNormalisedDeviceCoords.dy
        );
      }
    );

    const wheelSub = wheel$.subscribe(({ event }) => {
      event.stopPropagation();
      api.dolly(0.0005 * event.deltaY);
    });

    //animation loop
    const loop = () => {
      if (api) api.render();
      requestAnimationFrame(loop);
    };
    const frameId = requestAnimationFrame(loop);

    //cleanup
    return () => {
      resizeSub.unsubscribe();
      pointerPositionSub.unsubscribe();
      dragSub.unsubscribe();
      wheelSub.unsubscribe();
      cancelAnimationFrame(frameId);
      // onDestroy(unsubscribeThreeApi);
    };
  });

  $: (async () => {
    await api.changePlaneTexture(
      prevImage.url,
      prevImage.mirrored,
      currImage.url,
      currImage.mirrored,
      DisplacementMap.COSMOLOGICAL,
      currImage.aspect_ratio,
      [],
      []
    );
  })();

  $: {
    view;
    stage;
    api.dolly(0.000000001);
    api.changeHotspots(currImage.hotspots, currImage.mirrored);
  }

  const progress = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });
</script>

<div bind:this={canvasProxyEl} class:canvas-proxy={true}>
  <canvas bind:this={canvasEl} class:webgl-canvas={true} />
  <div bind:this={cssEl} class:css-canvas={true} />
  <div class:canvas-overlay={true} class:animation-reveal={false}>
    <slot name="canvas-overlay" progress={$progress} />
  </div>
</div>

<style lang="scss">
  @mixin covering() {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  @keyframes reveal {
    from {
      background-color: black;
    }
    to {
      background-color: transparent;
    }
  }

  .animation-reveal {
    animation-duration: 1s;
    animation-delay: 0.3s;
    animation-name: reveal;
  }

  .canvas-proxy {
    z-index: 0;
    position: relative;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    background-color: transparent;
    overflow: hidden;
    overscroll-behavior: contain;
    user-select: none;

    &[data-fullscreen="true"] {
      z-index: 100;
      position: absolute;
      @include covering();
      overscroll-behavior: none;
      user-select: none;
      overflow: hidden;
      transition: width 1s ease-in-out;
      overscroll-behavior: contain;
    }
  }
  .canvas-overlay {
    z-index: 3;
    position: absolute;
    @include covering();
    background-color: transparent;
    pointer-events: none;
  }

  .webgl-canvas {
    background-color: black;
    position: absolute;
    @include covering();
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    touch-action: none;

    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }

  .css-canvas {
    position: absolute;
    @include covering();
    height: 100%;
    width: 100%;
    z-index: 3;
    pointer-events: none;
  }
</style>
