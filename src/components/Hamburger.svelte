<script>
  export let open = false;
</script>

<button class:open on:click={() => (open = !open)}>
  <svg width="32" height="24">
    <line id="top" x1="0" y1="2" x2="32" y2="2" />
    <line id="middle" x1="0" y1="12" x2="32" y2="12" />
    <line id="bottom" x1="0" y1="22" x2="32" y2="22" />
  </svg>
</button>

<style lang="scss">
  @import "../styles/color";
  @mixin background($bg) {
    background: $bg;
    &:hover {
      background: darken($bg, 8%);
      filter: brightness(85%);
      transition: background 0.3s ease;
    }
    &:active {
      background: darken($bg, 25%);
      filter: brightness(85%);
    }
  }
  @mixin text-color($color) {
    color: $color;
    &:hover {
      color: lighten($color, 25%);
      transition: color 0.3s ease;
    }
    &:active {
      color: lighten($color, 50%);
    }
  }

  svg {
    // min-height: 24px;
    transition: transform 0.3s ease-in-out;
  }

  svg line {
    stroke: currentColor;
    stroke-width: 3;
    transition: transform 0.3s ease-in-out;
  }

  button {
    display: inline-block;
    border: none;
    pointer-events: all;
    z-index: 20;
    @include background(transparent);
    @include text-color(black);
    cursor: pointer;
    height: 2rem;
    width: 2rem;
    // margin: 1rem 1rem;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .open svg {
    transform: scale(0.7);
  }

  .open #top {
    transform: translate(6px, 0px) rotate(45deg);
  }

  .open #middle {
    opacity: 0;
  }

  .open #bottom {
    transform: translate(-12px, 9px) rotate(-45deg);
  }
</style>
