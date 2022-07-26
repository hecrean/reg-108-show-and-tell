<script lang="ts">
  import Hoverable from "@/components/Hoverable.svelte";
  import Accordion from "../Accordion.svelte";
  type RowItem = [heading: string, value: string];
  type RowAccordionItem = [
    summary: string,
    detail: string,
    defaultOpen: boolean
  ];
  export let rows: Array<RowItem | RowAccordionItem>;
</script>

<div class="container">
  {#each rows as [head, val, open]}
    {#if typeof open === "boolean"}
      <Hoverable let:hovering>
        <Accordion bind:open heading={head} content={val} />
      </Hoverable>
    {:else}
      <div class="accordion-row">
        <div class="row-heading">{head}</div>
        <div class="spacer" />
        <div class="row-data">{val}</div>
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  @import "../../styles/color";

  @mixin background($bg) {
    background: $bg;
    &:hover {
      background: darken($bg, 8%);
      transition: background 0.3s ease;
    }
    &:active {
      background: darken($bg, 25%);
    }
  }
  @mixin hide-scrollbar {
    scrollbar-width: none; /* For Firefox */
    -ms-overflow-style: none; /* For Internet Explorer and Edge */
    &::-webkit-scrollbar {
      width: 0px; /* For Chrome, Safari, and Opera */
    }
  }

  .container {
    color: $base-grey;
    margin-top: 1rem;
    margin: 0;
    padding: 0;
    width: 100%;
  }

  .accordion-row {
    @include background(hsl(0, 0%, 97%));
    min-height: 2rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    border-bottom: 2px solid rgba($base-grey, 0.4);
    align-items: center;
    align-items: center;

    .row-heading {
      padding: 0.5rem 1rem;
      text-transform: capitalize;
      font-size: small;
      font-weight: bold;
    }

    .row-data {
      padding: 0.5rem 1rem;
      padding: 0 20px;
      text-transform: capitalize;
      text-align: right;
      font-size: smaller;
    }

    .spacer {
      flex-grow: 1;
    }
  }

  .accordion-content {
    color: $grey-600;
    overflow-y: scroll;
    @include hide-scrollbar();
    transition: 0.8s transform ease;
    width: 100%;
    padding: 1rem 1.5rem;
    font-size: smaller;
  }

  // Animations
  @keyframes sweep-through-brand-colors {
    // 0% {
    //   background-color: $deep-blue;
    // }
    // 10% {
    //   background-color: $eylea-blue;
    // }
    // 20% {
    //   background-color: $light-blue;
    // }
    // 30% {
    //   background-color: $light-blue-accent;
    // }
    // 40% {
    //   background-color: $teal;
    // }
    // 50% {
    //   background-color: $teal-accent-1;
    // }
    // 60% {
    //   background-color: $teal-accent-2;
    // }
    // 70% {
    //   background-color: $dark-teal;
    // }
    // 80% {
    //   background-color: $dark-grey;
    // }
    // 90% {
    //   background-color: $light-grey;
    // }
    // 100% {
    //   background-color: $violet;
    // }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }

    25% {
      transform: scale(1.015);
    }

    50% {
      transform: scale(1);
    }
  }
</style>
