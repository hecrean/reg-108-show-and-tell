<script lang="ts" context="module">
  import type { StageADT } from "@/data/state";
</script>

<!-- https://svelte.dev/repl/5fc4b5dd5dec49d2be3fa160693372ce?version=3.31.0 -->
<script lang="ts">
  type $$Props = {
    stage: StageADT;
  };
  export let stage: StageADT;
</script>

<div class={"container"}>
  <div class={"timeline"}>
    <!-- <div
      class:start={stage === "baseline"}
      class:middle={stage === "week24"}
      class:end={stage === "week52"}
      data-stage={stage}
    >
      <div style:opacity={0.8} class:dot={true} data-moveable in:fade out:fade />
    </div> -->

    <hr class={"hr"} />

    <div class:start={true}>
      <button
        class:dot={true}
        on:click={() => (stage = "baseline")}
        data-active={stage === "baseline"}
      >
        <img class:svg-icon={true} src="./icons/baseline.svg" />
      </button>
    </div>
    <div class:middle={true}>
      <button
        class:dot={true}
        on:click={() => (stage = "week24")}
        data-active={stage === "week24"}
      >
        <img class:svg-icon={true} src="./icons/week24.svg" />
      </button>
    </div>
    <div class:end={true}>
      <button
        class:dot={true}
        on:click={() => (stage = "week52")}
        data-active={stage === "week52"}
      >
        <img class:svg-icon={true} src="./icons/week52.svg" />
      </button>
    </div>
  </div>
  <div class={"timeline"}>
    <div class:start={true}>
      <button class={"button"} on:click={() => (stage = "baseline")}>
        <span>Baseline</span>
      </button>
    </div>
    <div class:middle={true}>
      <button class={"button"} on:click={() => (stage = "week24")}>
        <span>24 Weeks</span>
      </button>
    </div>
    <div class:end={true}>
      <button class={"button"} on:click={() => (stage = "week52")}>
        <span>52 Weeks</span>
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../styles/typography";

  $white: white;
  $light-blue: hsl(202, 100%, 21%);
  $light-blue-accent: hsl(215, 20%, 65%);
  $timeline-height: 2rem;
  $timeline-pipe-height: 2px;

  .container {
    font-family: $acumin-pro-condensed;
    pointer-events: all;

    font-size: small;
    font-weight: bold;
    text-transform: uppercase;
    margin: 1rem;
    padding: 1rem;
    background-color: rgba($white, 0.4);
    border-radius: 10px;
    display: flex;
    flex-direction: column;

    // &:not(:hover) {
    // 	opacity: 0.2;
    // }
  }

  .button {
    padding: 0rem 8px;
    width: 100%;
    height: 100%;
    color: $light-blue;
    background-color: transparent;
    border: none;
    cursor: pointer;

    // &:hover {
    //   color: $light-blue-accent;
    // }
  }

  .svg-icon {
    width: 100%;
    height: 100%;
  }

  .timeline {
    background-color: transparent;
    width: 100%;
    height: $timeline-height;
    display: grid;
    grid-auto-columns: 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 0px 0px;
    grid-template-areas: "start middle end";
    cursor: pointer;
    justify-content: center;
  }

  .hr {
    background-color: $light-blue-accent;
    color: hsl(214, 32%, 91%);
    grid-column: 1/-1;
    margin: 0;
    padding: 0;
    margin-top: calc(-0.5 * $timeline-height - $timeline-pipe-height);
    justify-items: center;
    align-items: center;
    width: 99%;
    height: 3px;
  }

  @mixin dot() {
    height: $timeline-height;
    width: $timeline-height;
    background-color: $light-blue-accent;
    border-radius: 40px;
    border: none;
    cursor: pointer;
    transition: background-color 0.1s linear 0s;

    &[data-active="true"] {
      background-color: white;
    }

    &:hover {
      background-color: $light-blue;
      transition: background-color 0.1s linear 0s;
    }

    &[data-moveable] {
      transition: background-color 0.1s linear 0s;
      background-color: $light-blue;
      z-index: 20;
    }
  }

  .dot {
    @include dot();
  }

  .start {
    grid-area: start;
    display: grid;
    width: 100%;
    height: 100%;
    justify-items: center;
    align-items: center;
  }

  .middle {
    grid-area: middle;
    display: grid;
    width: 100%;
    height: 100%;
    justify-items: center;
    align-items: center;
  }
  .end {
    grid-area: end;
    display: grid;
    width: 100%;
    height: 100%;
    justify-items: center;
    align-items: center;
  }
</style>
