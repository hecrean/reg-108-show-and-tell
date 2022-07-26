<script lang="ts">
  import FullscreenCanvas from "@/components/FullscreenCanvas.svelte";

  import PatientInfo from "@/components/PatientInfo.svelte";
  import StageTimeline from "@/components/StageTimeline.svelte";
  import type { CaseStudy, StageADT, ViewADT } from "@/data/state";
  import OverlayLayout from "@/layouts/OverlayLayout.svelte";
  import Splitscreen from "@/layouts/Splitscreen.svelte";
  import type { SplitScreenState } from "@/stores/splitscreen";

  export let selectedCaseStudy: CaseStudy;

  let splitscreen: SplitScreenState = "left-compact";
  let view: ViewADT = "fa";
  let stage: StageADT = "baseline";

  const views: Array<ViewADT> = ["fundus", "oct", "fa"];

  const caseStudySieve = (caseStudy: CaseStudy) =>
    Object.values(caseStudy.stages).reduce(
      (prev, { views: { fa, fundus, oct } }) => [
        ...prev,
        fa[0].url,
        fundus[0].url,
        oct[0].url,
      ],
      new Array<string>()
    );
  $: preloadImageUrls = caseStudySieve(selectedCaseStudy);
</script>

<svelte:head>
  {#each preloadImageUrls as image}
    <link
      rel="preload"
      as="image"
      type="image/jpg"
      href={image}
      crossorigin="anonymous"
    />
  {/each}
</svelte:head>

<Splitscreen bind:splitscreen>
  <PatientInfo
    slot="left"
    caseStudy={selectedCaseStudy}
    bind:view
    bind:stage
    bind:splitscreen
  />
  <!-- {#await preload(src) then _} -->
  <FullscreenCanvas
    slot="right"
    bind:view
    bind:stage
    caseStudy={selectedCaseStudy}
  >
    <OverlayLayout slot="canvas-overlay" let:progress>
      <StageTimeline slot="foreground-top" bind:stage />
      <div class:view-btns-container={true} slot="foreground-bottom">
        {#each views as v}
          <button
            class:icon-button={true}
            on:click={() => (view = v)}
            data-active={view === v}
          >
            <img
              class:icon-svg={true}
              src={`./icons/${v}.svg`}
              data-active={view === v}
            />
            <strong>{v}</strong>
          </button>
        {/each}
      </div>
      <!-- <svelte:fragment slot="bottom">
        <progress value={progress} />
      </svelte:fragment> -->
    </OverlayLayout>
  </FullscreenCanvas>
  <!-- {/await} -->
</Splitscreen>

<style lang="scss">
  @use "sass:math";
  @import "../styles/color";
  @import "../styles//typography";

  // add pulsing transition
  progress {
    border-bottom: 1px red;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .video {
    width: 100%;
    object-fit: contain;
    border-radius: 0.5rem;
  }

  /* @mixin text-color($color) {
		color: $color;
		&:hover {
			color: lighten($color, 25%);
			transition: all 0.3s ease;
		}
		&:active {
			color: lighten($color, 50%);
		}
	} */
  .view-btns-container {
    display: flex;
    flex-direction: row;
    /* align-items: center; */
    /* justify-content: center; */
    width: 100%;
    height: 100%;

    // &:not(:hover) {
    //   transition: all 0.2s;
    //   opacity: 0.2;
    // }
  }

  .icon-button {
    width: 80px;
    height: 80px;
    font-family: $acumin-pro-condensed;
    font-size: small;
    color: $eylea-blue;

    background-color: $light-blue-accent;

    &:hover {
      background: white;
      /* filter: brightness(85%); */
      transition: background-color 0.3s ease;
    }
    &:active {
      /* filter: brightness(85%); */
      background-color: white;
    }

    &[data-active="true"] {
      background-color: white;
      color: $eylea-blue;
    }

    border: none;
    pointer-events: all;
    cursor: pointer;
    border-radius: 10px;
    padding: 8px;
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    margin: 0 5px;

    strong {
      padding: 2px;
    }
  }
  .icon-svg {
    padding: 4px;
    width: 100%;
    height: 100%;
  }
</style>
