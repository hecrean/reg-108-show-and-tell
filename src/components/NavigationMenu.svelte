<script lang="ts" context="module">
</script>

<script lang="ts">
  export let headings: Array<string>;

  let focusedHeadingIdx: number = 0;
</script>

<div class="container">
  <div class="heading-container">
    <div class="overflow-blur-effect" />
    <div class="headings">
      {#each headings as heading, i}
        <span
          class="heading"
          class:focused={focusedHeadingIdx === i}
          on:click={() => (focusedHeadingIdx = i)}>{heading}</span
        >
      {/each}
    </div>
  </div>
  <div class="content">
    {#if focusedHeadingIdx === 0}
      <slot name="slot-0" />
    {/if}
    {#if focusedHeadingIdx === 1}
      <slot name="slot-1" />
    {/if}
    {#if focusedHeadingIdx === 2}
      <slot name="slot-2" />
    {/if}
    {#if focusedHeadingIdx === 3}
      <slot name="slot-3" />
    {/if}
    {#if focusedHeadingIdx === 4}
      <slot name="slot-4" />
    {/if}
    {#if focusedHeadingIdx === 5}
      <slot name="slot-5" />
    {/if}
    {#if focusedHeadingIdx === 6}
      <slot name="slot-6" />
    {/if}
    {#if focusedHeadingIdx === 7}
      <slot name="slot-7" />
    {/if}
    {#if focusedHeadingIdx === 8}
      <slot name="slot-8" />
    {/if}
    {#if focusedHeadingIdx === 9}
      <slot name="slot-9" />
    {/if}
    {#if focusedHeadingIdx === 10}
      <slot name="slot-10" />
    {/if}
  </div>
</div>

<style lang="scss">
  @import "../styles/color";
  @import "../styles/typography";

  @mixin text-color($bg, $bg-hovered) {
    color: $bg;
    &:hover {
      color: $bg-hovered;
      transition: color 0.3s ease;
    }
    &:active {
      color: $bg-hovered;
    }
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: hsl(0, 0%, 97%);
  }
  .heading-container {
    position: relative;
    border-bottom: 2px solid $grey-800;
  }
  .content {
    flex-grow: 1;
  }

  .overflow-blur-effect {
    pointer-events: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    // background-color: #6b7280;
    width: 7rem;
    background: linear-gradient(to right, transparent 60%, hsl(0, 0%, 97%));
  }

  .headings {
    font-family: $acumin-pro-condensed;

    display: flex;
    overflow-x: auto;
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 7rem;
    margin-left: 1.5rem;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }

  .heading {
    display: inline-block;
    padding: 0.25rem 0.5em;
    white-space: pre;
    cursor: pointer;
    text-transform: capitalize;
    background-color: inherit;
    font-weight: 450;
    @include text-color(hsl(194, 65%, 80%), hsl(203, 96%, 22%));
  }

  .focused {
    color: hsl(203, 96%, 22%);
    font-weight: 600;
    transition: font-weight 0.3s ease;
  }
</style>
