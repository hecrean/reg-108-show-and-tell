<script lang="ts">
  type $$Props = {
    open: boolean;
  };
  export let open = false;
</script>

<aside class:open>
  <slot />
</aside>

<style lang="scss">
  @mixin hide-scrollbar() {
    overflow-y: scroll;
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    overflow-x: hidden;
  }
  aside {
    position: absolute;
    padding: 50px 0 80px 0;
    right: -100vw;
    transition: right 0.3s ease-in-out;
    background-color: #e5e7eb;
    width: 100%;
    height: 100%;
    max-height: 100vh;
    max-width: 100vw;
    @include hide-scrollbar();
    /* border-right-width: 2px;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); */
    z-index: 5;
  }

  .open {
    right: 0;
  }
</style>
