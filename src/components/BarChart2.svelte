<script lang="ts">
  import { booleanStore } from "@/stores/chart-store";

  const store = booleanStore(false);

  const { isOpen, open, close, toggle } = store;
</script>

<slot name="trigger" {open} {close} {toggle}>
  <!-- fallback trigger to open the modal -->
  <button on:mouseenter={open} on:mouseleave={close}>Open</button>
</slot>
{#if $isOpen}{/if}

<style lang="scss">
</style>
