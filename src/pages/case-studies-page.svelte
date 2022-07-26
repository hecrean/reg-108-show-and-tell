<script lang="ts">
  import Card from "@/components/Card.svelte";
  import { caseStudies } from "@/data/state";
  import { resizeObserver } from "@/utils/resize-observer";
  import { onMount } from "svelte";

  let width: number;
  let height: number;
  let containerEl: HTMLDivElement;

  onMount(() => {
    const chartElResize$ = resizeObserver(containerEl);
    const subscription = chartElResize$.subscribe((rect: DOMRect) => {
      width = rect.width;
      height = rect.height;
    });

    return () => subscription.unsubscribe();
  });
</script>

<div class:container={true} bind:this={containerEl}>
  <div class:flex={true}>
    {#each caseStudies as caseStudy, i}
      <div
        class:item={true}
        data-first={i === 0}
        data-last={i === caseStudies.length - 1}
      >
        <Card {caseStudy} />
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @import "../styles/color";
  @import "../styles/breakpoints";

  @mixin hide-scrollbar() {
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .container {
    width: 100%;
    height: 100%;
    /* background: linear-gradient($white, darken($white, 25%)); */
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    @include respond-below(xs) {
      .flex {
        overflow-y: scroll;
        overflow-x: hidden;
        display: flex;
        /* flex-flow: row wrap; */
        flex-direction: column;
        align-items: center;
      }
      .item {
        &[data-first="true"] {
          margin-top: 40px;
        }
        &[data-last="true"] {
          margin-bottom: 40px;
        }
        flex-grow: 0;
        flex-shrink: 0;
      }
    }
    @include respond-above(xs) {
      .flex {
        overflow-x: scroll;
        overflow-y: hidden;
        display: flex;
        /* flex-flow: row wrap; */
        flex-direction: row;
        align-items: center;
      }
      .item {
        margin: 0 10px;
        &[data-first="true"] {
          margin-left: 80px;
        }
        &[data-last="true"] {
          margin-right: 80px;
        }
        flex-grow: 0;
        flex-shrink: 0;
      }
    }
  }
</style>
