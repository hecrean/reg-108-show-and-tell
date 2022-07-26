<script lang="ts">
  import type { Hotspot } from "@/data/state";

  export let hotspots: Array<Hotspot>;
</script>

{#each hotspots as hotspot}
  <details
    style:transform={`translateX(${hotspot.screenspaceCoordinates.x}px) translateY(${hotspot.screenspaceCoordinates.y}px)`}
  >
    <summary>{hotspot.label}</summary>
    Label Description
  </details>
{/each}

<style lang="scss">
  details {
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: 0.5em 0.5em 0;

    &[open] {
      padding: 0.5em;

      summary {
        border-bottom: 1px solid #aaa;
        margin-bottom: 0.5em;
      }
    }

    summary {
      font-weight: bold;
      margin: -0.5em -0.5em 0;
      padding: 0.5em;
    }
  }

  details:not([open]) > *:not(summary),
  details:not([open]) > *text* {
    /* any direct child elements other than summary, or any direct child text nodes */
    /* display: none; */
  }
</style>
