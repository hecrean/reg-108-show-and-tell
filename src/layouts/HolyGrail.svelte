<script context="module" lang="ts">
  import { holyGrailStore } from "@/stores/holy-grail.store";
  const store = holyGrailStore(false, 60);
</script>

<script lang="ts">
  const {
    sidebarIsOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    headerHeight,
  } = store;
</script>

<div class:v-stack={true}>
  <!-- <aside class:sidebar-is-open={$sidebarIsOpen}>
    <slot name="right-aside" {store} />
  </aside> -->
  <header style:--header-height={$headerHeight}>
    <slot name="header" {store} />
  </header>
  <main>
    <slot name="main" {store} />
  </main>
</div>

<style lang="scss">
  $header-height: var(--header-height);

  .v-stack {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    flex-flow: column wrap;
    height: 100%;
    max-height: 100vh;
    width: 100%;
    background-color: white;
  }

  header {
    background-color: rgb(171, 222, 237);
    width: 100%;
    height: $header-height;
    /* max-height: $header-height; */
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.18);
    z-index: 99;
  }

  main {
    width: 100%;
    flex: 1 0 auto;
    max-height: calc(100vh - $header-height);
    padding-bottom: $header-height;
    overflow-y: scroll;
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
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
    z-index: 5;
  }

  .sidebar-is-open {
    right: 0;
  }
</style>
