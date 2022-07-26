<script lang="ts">
  import { createEventDispatcher } from "svelte";

  type Direction = "up" | "down" | "left" | "right";

  type $$Props = {
    direction?: Direction;
  };

  export let direction: Direction = "down";

  const dispatch = createEventDispatcher();

  const clickMsg = () => dispatch("click");
</script>

<svg
  on:click|preventDefault={clickMsg}
  data-direction={direction}
  width="15"
  height="15"
  viewBox="0 0 15 15"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  ><path
    d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
    fill="currentColor"
    fill-rule="evenodd"
    clip-rule="evenodd"
  /></svg
>

<style lang="scss">
  svg {
    &[data-direction="down"] {
      transform: rotate(0);
      transition: 0.25s transform ease;
    }
    &[data-direction="left"] {
      transform: rotate(90deg);
      transition: 0.25s transform ease;
    }
    &[data-direction="up"] {
      transform: rotate(180deg);
      transition: 0.25s transform ease;
    }
    &[data-direction="right"] {
      transform: rotate(-90deg);
      transition: 0.25s transform ease;
    }
  }
</style>
