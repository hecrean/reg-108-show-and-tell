<script lang="ts">
  import IconButton from "@/components/IconButton.svelte";
  import Modal from "@/components/Modal.svelte";
  import ChevronRightIcon from "@/icons/ChevronRightIcon.svelte";

  import VideoWithOverlay from "@/components/VideoWithOverlay.svelte";
  import { router } from "tinro";

  let width: number;
  let height: number;
</script>

<div
  class:three-col-grid-layout={true}
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <div class:central-grid-col={true}>
    <div class="flex-col" class:fade-in={false}>
      <div class:button-layout={true}>
        <Modal>
          <svelte:fragment slot="trigger" let:toggle>
            <VideoWithOverlay
              url="./button-loop-videos/Reg108 Button1.mp4"
              on:click={toggle}
            >
              <p>WATCH THE ANIMATION</p>
              <IconButton bgColor={"rgb(245,206,70"}>
                <ChevronRightIcon />{" "}
              </IconButton>
            </VideoWithOverlay>
          </svelte:fragment>
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

        <VideoWithOverlay
          url="./button-loop-videos/Reg108 Button2.mp4"
          on:click={() => {
            router.goto("/case-studies");
          }}
        >
          <p>SEE THE CASE STUDIES</p>
          <IconButton bgColor={"rgb(245,206,70"}>
            <ChevronRightIcon />{" "}
          </IconButton>
        </VideoWithOverlay>
      </div>

      <p style:padding={"2rem"}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../styles/breakpoints";

  .fullpage-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .three-col-grid-layout {
    padding-top: 2rem;
    width: 100%;
    /* Take the remaining height */
    flex-direction: column;
    flex-grow: 1;
    display: grid;
    justify-items: center;
    align-items: center;

    /*
      On large screens, it will take up 65ch width. On smaller screens,
      where there isn't enough horizontal space for 65 characters,
      it is clamped to 100% of the available container width
      */
    grid-template-columns:
      1fr
      #{"min(140ch, calc(100% - 64px))"}
      1fr;
    // grid-template-columns: 1fr 100fr 1fr;
    // grid-column-gap: 32px;
    grid-column-gap: 0px;
    grid-auto-rows: min-content;
  }

  .central-grid-col {
    grid-column: 2 / 3;
    width: 100%;
  }

  .button-layout {
    @include respond-below(xs) {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    @include respond-above(xs) {
      display: flex;
      flex-direction: row;
      width: 100%;
    }
  }

  .fade-in {
    animation: fade-in 1s ease 1s forwards;
    opacity: 0;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
