<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let url: string;

  const dispatch = createEventDispatcher();

  function onClick() {
    dispatch("click", {
      text: "clicked!",
    });
  }
</script>

<div class="container" on:click={onClick}>
  <img src={url} />
  <div class="overlay"><slot /></div>
</div>

<style lang="scss">
  @import "../styles/color";
  @mixin hover($bg) {
    background: $bg;
    &:hover {
      filter: brightness(0.4);
      transition: background 0.3s ease;
    }
    &:active {
      filter: brightness(0.4);
    }
  }

  .container {
    @include hover(white);
    background-color: transparent;
    z-index: 0;
    position: relative;
    width: 100%;
    margin: 2rem 0 0 0;
    min-height: 200px;
  }

  .overlay {
    color: white;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: all;
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    pointer-events: none;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  img {
    border-radius: 10px;
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    touch-action: none;
    animation: fade-in 1s ease 0.3s forwards;
    background-color: black;
  }
</style>
