<script lang="ts">
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";

  export let posterUrl: `./${string}.${"jpg" | "jpeg" | "png"}`;
  export let videoUrl: `./${string}.mp4`;

  const waitFor = async () => {
    return 0;
  };

  const progress = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });
</script>

{#await waitFor()}
  <progress value={$progress} />
{:then _}
  <button on:click|once={() => {}} />
  <video controls poster={posterUrl}>
    <source src={videoUrl} type="video/mp4" />
    <track kind="captions" />
    Sorry, your browser doesn't support embedded videos.
  </video>
{:catch error}
  <p style:color={"red"}>{error.message}</p>
{/await}

<style>
  video {
    width: 100vw;
    height: 100wh;
    position: absolute;
    top: 0;
    left: 0;
  }
  progress {
    display: block;
    width: 100%;
  }
</style>
