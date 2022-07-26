<script context="module" lang="ts">
  // for passing focus on to the next Modal in the queue.
  // A module context level object is shared among all its component instances. [Read More Here](https://svelte.dev/tutorial/sharing-code)
  const modalList = [];
</script>

<script lang="ts">
  import { booleanStore } from "@/stores/modal.store";

  const store = booleanStore(false);

  const { isOpen, open, close, toggle } = store;

  function keydown(e: KeyboardEvent) {
    e.stopPropagation();
    if (e.key === "Escape") {
      close();
    }
  }
  function transitionend(e: TransitionEvent) {
    const node = e.target as HTMLElement;
    node.focus();
  }
  function modalAction(node: HTMLElement) {
    const returnFn = [];
    // for accessibility
    if (document.body.style.overflow !== "hidden") {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      returnFn.push(() => {
        document.body.style.overflow = original;
      });
    }
    node.addEventListener("keydown", keydown);
    node.addEventListener("transitionend", transitionend);
    node.focus();
    modalList.push(node);
    returnFn.push(() => {
      node.removeEventListener("keydown", keydown);
      node.removeEventListener("transitionend", transitionend);
      modalList.pop();
      // Optional chaining to guard against empty array.
      modalList[modalList.length - 1]?.focus();
    });
    return {
      destroy: () => returnFn.forEach((fn) => fn()),
    };
  }
</script>

<slot name="trigger" {open} {toggle}>
  <!-- fallback trigger to open the modal -->
  <button on:click={open}>Open</button>
</slot>
{#if $isOpen}
  <div class="modal" use:modalAction tabindex="0">
    <div class="backdrop" on:click={close} />

    <div class="content-wrapper">
      <slot name="header" {store}>
        <!-- fallback -->
      </slot>

      <div class="content">
        <slot name="content" {store} />
      </div>

      <slot name="footer" {store}>
        <!-- fallback -->
      </slot>
    </div>
  </div>
{/if}

<style lang="scss">
  .modal {
    z-index: 999;
    position: fixed;
    padding: 0;
    margin: 0;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    &:not(:focus-within) {
      transition: opacity 0.6s;
      opacity: 0.99;
    }
  }
  .backdrop {
    background-color: rgba(hsl(194, 65%, 80%), 0.7);
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .content-wrapper {
    z-index: 10;
    max-width: 80vw;
    max-height: 80vh;
    border-radius: 0.3rem;
    overflow: hidden;
    aspect-ratio: 16/9;
  }
  .content {
    width: 100%;
    height: 100%;
  }

  h1 {
    opacity: 0.5;
  }
</style>
