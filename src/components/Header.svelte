<script lang="ts">
  import Modal from "@/components/Modal.svelte";
  import { router } from "tinro";

  type HeaderVariant = "mininal" | "full-fat";

  interface $$Props extends Partial<HTMLButtonElement> {
    variant?: HeaderVariant;
  }

  export let variant: HeaderVariant = "full-fat";
</script>

<!------------   Header ----------------------------->

<div class:filling-container={true}>
  <div class:header-inner={true}>
    <button
      class:eylea-logo-home-button={true}
      on:click={() => {
        router.goto("/");
      }}
      ><img
        src={"./branding/eylea-logo-condensed.png"}
        class:eylea-logo-image={true}
        alt="eylea logo"
      /></button
    >

    {#if variant === "full-fat"}
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
          <button class:header-button={true} on:click={() => {}}>
            REFERENCES</button
          >
        </svelte:fragment>
        <div slot="content">
          <h1>References</h1>
        </div>
      </Modal>
    {/if}
  </div>
</div>

<style lang="scss">
  @import "../styles/typography";
  @import "../styles/breakpoints";

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

  $header-height: 60px;

  .filling-container {
    z-index: 99;
    width: 100%;
    height: 100%;
    display: grid;
    justify-content: center;
    transition: background-color 0.3s ease;

    @include respond-below(sm) {
    }
    @include respond-above(sm) {
    }
  }

  .eylea-logo-home-button {
    height: 100%;

    @include hover-svg(hsl(193, 64%, 80%));
  }
  .eylea-logo-image {
    max-height: $header-height;
    padding: 8px 8px 8px 0px;
  }

  .header-button {
    font-family: $acumin-pro-condensed;
    font-weight: bold;
    border: none;
    background-color: transparent;
    cursor: pointer;
    /* push towards baseline in y direction*/
    align-self: flex-end;

    border-radius: 10px 10px 0 0; /* top-left top-right bottom-right bottom-left.*/
    border-color: none;
    padding: 5px 15px;
    margin: 0 5px;
    min-width: 140px;
    min-height: 44px;
    text-align: center;
    line-height: 1.1;

    @include respond-below(sm) {
      min-width: 40px;

      margin: 0 1px;
      font-size: small;
      padding: 5px 5px;
    }

    @include explicit-background(rgb(19, 68, 107), rgb(86, 145, 171));
    color: white;
  }

  .header-inner {
    display: flex;
    flex-direction: row;
    justify-items: flex-end;
    min-width: min(700px, 70vw);
    max-width: 75vh;

    @include respond-below(sm) {
      width: 100%;
    }
    @include respond-above(sm) {
    }
  }

  .spacer {
    flex-grow: 1;
  }
</style>
