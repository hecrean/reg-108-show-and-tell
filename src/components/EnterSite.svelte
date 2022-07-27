<script lang="ts">
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import { fade } from "svelte/transition";

  import { router } from "tinro";

  // export let posterUrl: `./${string}.${"jpg" | "jpeg" | "png"}`;
  export let videoUrl: `./${string}.mp4`;

  let videoFinished: boolean = false;

  let videoEl: HTMLVideoElement;

  const waitFor = async () => {
    await new Promise((f) => setTimeout(f, 2000)); // simulate delay
  };

  const progress = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });
</script>

<div class:container={true}>
  {#await waitFor()}
    <!-- <progress value={$progress} /> -->
  {:then _}
    <button
      on:click={() => {
        console.log("clicked");
        videoEl.play();
      }}
    >
      Enter Site</button
    >
    <video
      bind:this={videoEl}
      autoplay={true}
      in:fade
      on:ended={() => {
        router.goto("/case-studies");
      }}
    >
      <source src={videoUrl} type="video/mp4" />
      <track kind="captions" />
      Sorry, your browser doesn't support embedded videos.
    </video>
  {:catch error}
    <p style:color={"red"}>{error.message}</p>
  {/await}
</div>

<style lang="scss">
  .container {
    display: relative;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    background: white;
  }
  button {
    z-index: 5;
    pointer-events: all;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 100px;
    background-color: red;
    color: white;
    &:hover {
      color: black;
    }
  }

  video {
    opacity: 1;
    display: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  progress {
    z-index: 1;
    display: absolute;
    width: 100%;
    bottom: 5vh;
  }

  .fade-out {
    animation: fade-out 0.6s ease-in-out;
    -webkit-animation: fade-out 0.8s linear forwards;
  }

  @-webkit-keyframes fade-out {
    0% {
      /* filter: brightness(100%); */
      opacity: 1;
    }
    100% {
      /* filter: brightness(0%); */
      opacity: 0;
    }
  }

  @keyframes fade-out {
    0% {
      /* filter: brightness(100%); */
      opacity: 1;
    }
    100% {
      /* filter: brightness(0%); */
      opacity: 0;
    }
  }
</style>
