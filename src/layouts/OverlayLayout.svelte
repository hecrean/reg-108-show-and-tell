<div class="container">
  <div class="top"><slot name="top" /></div>
  <div class="bottom"><slot name="bottom" /></div>
  <div class="foreground-top"><slot name="foreground-top" /></div>
  <div class="foreground-bottom"><slot name="foreground-bottom" /></div>
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 0px 0px;
    justify-items: center;
    align-items: center;
  }
  .top {
    grid-area: 1 / 1 / 3 / 17;
  }
  .bottom {
    grid-area: 15 / 1 / 17 / 17;
  }
  .foreground-top {
    grid-area: 2 / 5 / 4 / 14;
  }
  .foreground-bottom {
    grid-area: 14 / 5 / 16 / 14;
  }
</style>
