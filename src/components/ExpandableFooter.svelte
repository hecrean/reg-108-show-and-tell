<script lang="ts">
  import { outclick } from "@/actions";
  import ArrowUpIcon from "@/icons/ArrowUpIcon.svelte";
  import { fade } from "svelte/transition";
  import IconButton from "./IconButton.svelte";

  export let expanded = false;
</script>

<footer
  class:expanded
  use:outclick={() => (expanded = false)}
  on:click|preventDefault={() => {
    expanded = !expanded;
  }}
>
  <div class:flex-row={true}>
    <IconButton color={"blue"}>
      <div class="arrow" class:arrow-flipped={expanded}>
        <ArrowUpIcon />
      </div></IconButton
    >
    <strong class="isi-msg"> Important Safety Information </strong>
  </div>
  {#if expanded}
    <slot />
  {/if}
</footer>
{#if expanded}
  <div class="fullscreen-cover" in:fade />
{/if}

<style lang="scss">
  @mixin background($bg) {
    background-color: $bg;
    background: $bg;
    &:hover {
      background: darken($bg, 8%);
      transition: background 0.3s ease;
    }
    &:active {
      background: darken($bg, 25%);
    }
  }
  @mixin color($color) {
    color: $color;
    &:hover {
      color: darken($color, 25%);
      transition: color 0.3s ease;
    }
    &:active {
      color: darken($color, 25%);
    }
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: center;
  }

  .arrow {
    border-radius: 100%;
    padding: 2px;
    background-color: hsl(199, 34%, 51%);
    @include color(white);
  }
  .isi-msg {
    color: hsl(202, 91%, 23%);
  }

  .arrow-flipped {
    transition: transform 0.5s ease;
    transform: rotate(0.5turn);
  }

  .fullscreen-cover {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    opacity: 0.7;
    z-index: 10;
    background-color: grey;
  }
  footer {
    @include background(hsl(193, 64%, 80%));
    z-index: 11;
    /* position: absolute;
    bottom: 0;
    left: 0;
    right: 0; */
    width: 100%;
    height: 60px;
    max-height: 60px;
    overflow-y: none;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);

    transition: height 0.3s ease-in-out;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .expanded {
    transition: height 0.3s ease-in-out;
    height: 50vh;
    max-height: 50vh;
  }
</style>
