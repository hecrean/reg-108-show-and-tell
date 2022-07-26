<script lang="ts">
  // ! note: `$$Props` is currently an experimental feature
  // to expose types for props, you won't use in this component,
  // but you want to pass on to child-components via `$$restProps`
  interface $$Props extends Partial<HTMLButtonElement> {
    bgColor?: string;
    color?: string;
  }
  export let bgColor: string = "transparent";
  export let color = "#000";
</script>

<button {...$$restProps} style:--bg-color={bgColor} style:--color={color}>
  <slot />
</button>

<style lang="scss">
  @import "../styles/color";
  @mixin background($bg) {
    background: $bg;
    &:hover {
      filter: brightness(85%);
      transition: background 0.3s ease;
    }
    &:active {
      filter: brightness(85%);
    }
  }

  button {
    color: var(--color);

    display: inline-block;
    border: none;
    pointer-events: all;
    @include background(var(--bg-color));
    cursor: pointer;
    height: 3rem;
    width: 3rem;
    border-radius: 100%;
    padding: 1rem 0.5rem;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
</style>
