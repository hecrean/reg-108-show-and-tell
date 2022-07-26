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
      <div class="view-btns-container" slot="foreground-bottom">
        {#each views as v}
          <button on:click={() => (view = v)} data-active={view === v}>
            <div class={"circle"} data-active={view === v} />
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

  @mixin background($bg) {
    background: $bg;
    &:hover {
      filter: brightness(85%);
      transition: background 0.3s ease;
    }
    &:active {
      filter: brightness(85%);
    }
  }

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
    align-items: center;
    justify-content: center;
    width: 100%;

    // &:not(:hover) {
    //   transition: all 0.2s;
    //   opacity: 0.2;
    // }
  }

  @mixin circle($width, $color) {
    width: $width;
    height: $width;
    background: $color;
    -webkit-border-radius: math.div($width, 2);
    -moz-border-radius: math.div($width, 2);
    border-radius: math.div($width, 2);
  }

  .circle {
    &[data-active="true"] {
      @include circle(60px, rgb(203, 213, 225));
    }
    &[data-active="false"] {
      @include circle(60px, rgb(162, 171, 187));
    }
  }

  button {
    font-family: $acumin-pro-condensed;

    font-size: small;
    @include background(rgba(white, 0.6));
    color: rgb(152, 146, 145);

    &[data-active="true"] {
      @include background(hsl(202, 100%, 21%));
      color: rgb(241, 245, 249);
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
</style>
