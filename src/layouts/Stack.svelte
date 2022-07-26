<script lang="ts">
</script>

<div class:v-stack={true}>
  <header><slot name="header" /></header>
  <main>
    <slot name="main" />
  </main>
  <slot name="footer" />
</div>

<style lang="scss">
  $header-height: 60px;

  .v-stack {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    flex-flow: column wrap;
    height: 100%;
    width: 100%;
    background-color: white;
  }

  header {
    background-color: rgb(171, 222, 237);
    width: 100%;
    height: $header-height;
    max-height: $header-height;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.18);
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
</style>
