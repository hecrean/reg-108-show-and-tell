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
    animation: fade-in 0.3s ease-in-out;
    -webkit-animation: fade-in 0.3s linear forwards;
  }
  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overscroll-behavior-y: none;
  }

  @-webkit-keyframes fade-in {
    0% {
      filter: brightness(0%);
    }
    100% {
      filter: brightness(100%);
    }
  }

  @keyframes fade-in {
    0% {
      filter: brightness(0%);
    }
    100% {
      filter: brightness(100%);
    }
  }
</style>
