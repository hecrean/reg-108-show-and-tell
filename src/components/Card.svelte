<script lang="ts">
  import type { CaseStudy } from "@/data/state";
  import { caseStudyStore } from "@/stores/case-studies";

  type $$Props = {
    caseStudy: CaseStudy;
  };

  export let caseStudy: CaseStudy;

  $: rows = Object.entries(caseStudy.baseline_characteristics);

  const cleanText = (str: string) => str.replace(/[_]/g, " ");
</script>

<a
  class="flex-item"
  href="/case-study/{caseStudy.id}"
  data-disabled={!caseStudy.enabled}
  on:click={() => {
    caseStudyStore.set(caseStudy);
  }}
>
  <div class="stack" style:--accent-color={caseStudy.colorId}>
    <div class="avatar-block">
      <div class="avatar-wrapper">
        <img class="avatar-img" src={caseStudy.profile_picture} />
      </div>
    </div>
    <div class="label">{`Case ${caseStudy.id}`}</div>
    <div class="content-block">
      {#each rows as [key, val]}
        <div class="table-row">
          <div class="row-heading">{cleanText(key)}</div>
          <div class="spacer" />
          <div class="row-data">{val}</div>
        </div>
      {/each}
    </div>
  </div>
</a>

<style lang="scss">
  @use "sass:math";
  @import "../styles/color";

  @mixin drop-shadow($color) {
    &:hover {
      filter: drop-shadow(16px 16px 20px $eylea-blue) invert(0%);
    }
    &:active {
      filter: drop-shadow(16px 16px 20px $eylea-blue) invert(0%);
    }
  }

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

  a {
    &[data-disabled="true"] {
      pointer-events: none;
      filter: grayscale(80%) blur(5px);
    }
    text-decoration: none;
    margin: 10px;
  }

  .stack {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    aspect-ratio: 3/4;
    background-color: hsl(0, 0%, 97%);
    border-radius: 10px;
    // @include drop-shadow(var(--accent-color));
    &:hover {
      .avatar-block {
        filter: brightness(85%);
      }
    }
  }

  .avatar-block {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: linear-gradient(var(--accent-color) 40%, hsl(0, 8%, 84%));
    padding: 10px 10px;

    .avatar-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      overflow: hidden;
      user-select: none;
      aspect-ratio: 1;
      max-width: 8rem;
      border-radius: 100%;
      border: none;
      margin-bottom: 8px;

      .avatar-img {
        // -webkit-filter: drop-shadow(5px 5px 5px #222);
        // filter: drop-shadow(5px 5px 5px #222);
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
      }
    }
  }

  .label {
    text-transform: uppercase;
    z-index: 1;
    margin: -10px auto;
    width: 80px;
    text-align: center;
    border-radius: 10px;
    background-color: hsl(0, 0%, 100%);
    color: $eylea-blue;
    font-weight: bold;
    /* offset-x | offset-y | blur-radius | spread-radius | color */
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  }

  .content-block {
    padding: 1rem 2rem;
  }

  .table-row {
    margin: 5px 0;
    @include background(hsl(0, 0%, 100%));
    border-radius: 10px;
    border: none;
    min-height: 2rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
    align-items: center;
    color: grey;

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
</style>
