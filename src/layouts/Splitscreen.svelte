<script lang="ts">
  import type { SplitScreenState } from "@/stores/splitscreen";

  interface $$Props {
    splitscreen: SplitScreenState;
  }
  export let splitscreen: SplitScreenState = "equal";
</script>

<div class:splitscreen={true}>
  <div class:left={true} data-split={splitscreen}>
    <slot name="left" {splitscreen} />
  </div>
  <div class:right={true}><slot name="right" /></div>
</div>

<style lang="scss">
  @import "../styles/color";
  .splitscreen {
    width: 100%;
    height: 100%;

    /* overflow: hidden; */

    display: flex;
    flex-direction: row;

    background-color: transparent;
  }
  .left {
    /* filter: drop-shadow(16px 16px 20px red) invert(0%); */
    /* background: linear-gradient(to right, transparent 80%, red); */

    height: 100%;

    &[data-split="left-minimised"] {
      width: 0%;
      transition: width, 1s;
    }
    &[data-split="left-compact"] {
      width: 25%;
      transition: width, 1s;
    }
    &[data-split="equal"] {
      width: 50%;
      transition: width, 1s;
    }

    overflow-y: scroll;
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .right {
    height: 100%;
    flex-grow: 1;
  }
</style>
