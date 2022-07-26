<script lang="ts">
  //assets:
  import Modal from "@/components/Modal.svelte";
  //Actions
  //Transitions

  import { router } from "tinro";

  type HeaderVariant = "minimal" | "fully-featured";
  interface $$Props extends Partial<HTMLButtonElement> {
    variant?: HeaderVariant;
  }

  export let variant: HeaderVariant = "fully-featured";
</script>

<header>
  <!-- contrained with inner elememnt -->
  <div class:header-inner={true}>
    <!-- home button -->
    <button
      class:header-btn-icon={true}
      on:click={() => {
        router.goto("/");
      }}
      ><img src={"./branding/eylea-logo.png"} class:logo-image={true} /></button
    >

    <!-- navigation buttons -->
    {#if variant === "fully-featured"}
      <div class:spacer={true} />

      <Modal>
        <svelte:fragment slot="trigger" let:toggle>
          <button class:header-button={true} on:click={toggle}>
            WATCH THE ANIMATION</button
          >
        </svelte:fragment>
        <div slot="header" />
        <div slot="content">
          <video
            controls
            width="100%"
            poster="./animation-video/animation-video-poster.jpg"
          >
            <source
              src="./animation-video/REG108_Eylea_Preview_576p_220630.mp4"
              type="video/mp4"
            />
            <track kind="captions" />
            Sorry, your browser doesn't support embedded videos.
          </video>
        </div>
      </Modal>
      <button
        class:header-button={true}
        on:click={() => {
          router.goto("/case-studies");
        }}>CASE STUDIES</button
      >
      <Modal>
        <svelte:fragment slot="trigger" let:toggle>
          <button class:header-button={true} on:click={toggle}>
            REFERENCES</button
          >
        </svelte:fragment>
        <div slot="header" />
        <div slot="content">
          <p>References to be added</p>
        </div>
      </Modal>
    {/if}
  </div>
</header>

<style lang="scss">
  $header-height: 60px;

  @import "../../styles/typography";

  @mixin explicit-background($bg, $bg-hovered) {
    background-color: $bg;
    background: $bg;
    &:hover {
      background: $bg-hovered;
      transition: background 0.3s ease;
    }
    &:active {
      background: $bg-hovered;
    }
  }

  @mixin hover-svg($bg) {
    background: $bg;
    &:hover {
      background-color: darken($bg, 8%);
      transition: background 0.3s ease;
    }
    &:active {
      background-color: darken($bg, 25%);
    }
  }

  header {
    z-index: 20;
    width: 100vw;
    height: $header-height;
    display: grid;
    justify-content: center;

    background-color: hsl(193, 64%, 80%);
    &[data-open="true"] {
      background-color: transparent;
    }
    transition: background-color 0.3s ease;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.18);
  }

  .header-inner {
    display: flex;
    flex-direction: row;
    justify-items: flex-end;
    min-width: min(700, 70vw);
    max-width: 75vh;
  }

  .header-btn-icon {
    margin: 0px 12px;
    height: 100%;
    @include hover-svg(hsl(193, 64%, 80%));
  }
  .logo-image {
    height: 60px;
    max-height: 60px;
  }

  .header-button {
    font-weight: bold;
    border: none;
    background-color: transparent;
    font-family: inherit;
    cursor: pointer;
    /* push towards baseline in y direction*/
    align-self: flex-end;

    border-radius: 10px 10px 0 0; /* top-left top-right bottom-right bottom-left.*/
    border-color: none;
    padding: 0.25em 0.75em;
    margin: 0 0.5rem;
    width: 220px;
    min-width: 140px;
    min-height: 44px;
    /* box-shadow: 0 3px 5px rgba(0, 0, 0, 0.18); */
    text-align: center;
    line-height: 1.1;

    @include explicit-background(rgb(19, 68, 107), rgb(86, 145, 171));
    color: white;
  }

  .spacer {
    flex-grow: 1;
  }
</style>
