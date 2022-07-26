<script lang="ts">
  import { router } from "tinro";
</script>

<!-- out:fade={{ duration: 300 }}  -->

{#key $router.path}
  <div class:transition-container={true}>
    <slot />
  </div>
{/key}

<style lang="scss">
  .transition-container {
    width: 100%;
    height: 100%;
    background-color: rgb(171, 222, 237);
  }
</style>
