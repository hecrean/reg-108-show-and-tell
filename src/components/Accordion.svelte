<script lang="ts">
  import ChevronDownIcon from "@/icons/ChevronDownIcon.svelte";

  export let open: boolean;
  export let heading: string;
  export let content: string;
</script>

<details bind:open>
  <summary class="accordion-row">
    <div class="row-heading">{heading}</div>
    <div class="spacer" />
    <ChevronDownIcon
      on:click={() => {
        open = !open;
      }}
      direction={open ? "down" : "right"}
    />
  </summary>
  <div class="accordion-content">{content}</div>
</details>

<style lang="scss">
  @mixin background($bg) {
    background: $bg;
    &:hover {
      background: darken($bg, 8%);
      /* transition: background 0.1s ease; */
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
  details {
    summary {
      list-style: none;

      &::-webkit-details-marker {
        display: none;
      }
    }
  }

  .accordion-row {
    padding: 0.5rem 1rem;
    @include background(hsl(0, 0%, 97%));
    min-height: 2rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    border-bottom: 2px solid rgba(grey, 0.4);
    align-items: center;
    align-items: center;

    .row-heading {
      text-transform: capitalize;
      font-size: small;
      font-weight: bold;
    }

    .row-data {
      text-transform: capitalize;
      text-align: right;
      font-size: smaller;
    }

    .spacer {
      flex-grow: 1;
    }
  }

  .accordion-content {
    color: grey;
    overflow-y: scroll;
    @include hide-scrollbar();
    transition: 0.25s transform ease;
    width: 100%;
    padding: 1rem 1.5rem;
    font-size: smaller;
  }
</style>
