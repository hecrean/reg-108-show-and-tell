<!-- Transition.svelte -->
<script>
  import { router } from "tinro";
</script>

{#key $router.path}
  <div class:page-transition={false} class:container={true}>
    <slot />
  </div>
{/key}

<style lang="scss">
  .page-transition {
    animation: fade-in 0.6s ease-in-out;
    -webkit-animation: fade-in 0.8s linear forwards;
  }
  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overscroll-behavior-y: none;
  }

  /* @-webkit-keyframes fade-in {
    0% {
      filter: brightness(0%);
    }
    20% {
      filter: brightness(20%);
    }
    40% {
      filter: brightness(40%);
    }
    60% {
      filter: brightness(60%);
    }
    80% {
      filter: brightness(80%);
    }
    100% {
      filter: brightness(100%);
    }
  } */

  @keyframes fade-in {
    0% {
      filter: brightness(20%);
    }
    20% {
      filter: brightness(30%);
    }
    40% {
      filter: brightness(40%);
    }
    60% {
      filter: brightness(60%);
    }
    80% {
      filter: brightness(80%);
    }
    100% {
      filter: brightness(100%);
    }
  }
</style>
