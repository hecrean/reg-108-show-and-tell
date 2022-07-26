<script lang="ts">
  import IconButton from "@/components/IconButton.svelte";
  //assets:
  import ArrowUpIcon from "@/icons/ArrowUpIcon.svelte";
  //Actions
  import { outclick } from "@/actions";
  //Transitions
  import { fade } from "svelte/transition";

  let footerExpanded = false;
</script>

<!------------  Footer ----------------------------->

<footer
  data-expanded={footerExpanded}
  use:outclick={() => (footerExpanded = false)}
  on:click|preventDefault={() => {
    footerExpanded = !footerExpanded;
  }}
>
  <div class:flex-row={true} style:max-height={"60px"}>
    <IconButton color={"blue"}>
      <div class:arrow={true} class:arrow-flipped={footerExpanded}>
        <ArrowUpIcon />
      </div></IconButton
    >
    <strong class:isi-msg={true}> Important Safety Information </strong>
  </div>
  {#if footerExpanded}
    <p style:padding="2rem">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
  {/if}
</footer>
{#if footerExpanded}
  <div class="fullscreen-cover" transition:fade />
{/if}

<style lang="scss">
  @import "../styles/typography";

  $footer-height: 60px;

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

  footer {
    @include background(hsl(193, 64%, 80%));
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 11;
    width: 100%;

    overflow-y: none;

    /* box-shadow: inset 0px 3px 1px 2px rgba(0, 0, 0, 0.1); */
    transition: height 0.6s, max-height 0.6s;

    &[data-expanded="false"] {
      transition: height 0.6s, max-height 0.6s;
      height: $footer-height;
      max-height: $footer-height;
    }

    &[data-expanded="true"] {
      transition: height 0.6s, max-height 0.6s;
      height: 50vh;
      max-height: 50vh;
    }
  }

  .flex-row {
    height: 100%;
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
  .arrow-flipped {
    transition: transform 0.5s ease;
    transform: rotate(0.5turn);
  }

  .isi-msg {
    color: hsl(202, 91%, 23%);
    font-family: $acumin-pro;
    font-weight: 700;
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
</style>
