<!-- 
  @TOO: Bar Chart :
- axes: units and labels
- dashboard container? use css grid, or in extremis a resize observer

- extensions: compare/contrast between data sets. (Perhaps for beta 2.0)




-->
<script lang="ts">
  import { largest, type Dataset } from "@/utils/chart";
  import { scaleLinear } from "d3-scale";

  type $$Props = {
    dataset: Dataset;
  };
  export let dataset: Dataset;

  // let chartEl: HTMLElement;
  let chartWidth: number = 500;
  let chartHeight: number = 200;

  // onMount(() => {
  //   const chartElResize$ = resizeObserver(chartEl);
  //   const subscription = chartElResize$.subscribe((rect: DOMRect) => {
  //     chartWidth = rect.width;
  //     chartHeight = rect.height;
  //   });

  //   return () => subscription.unsubscribe();
  // });

  const padding = { top: 20, right: 15, bottom: 40, left: 15 };

  $: xs = dataset.points.map((p) => p.x);
  $: ys = dataset.points.map((p) => p.y);

  $: yTicks = [0, Math.ceil(Math.max(...ys)) / 2, Math.ceil(Math.max(...ys))];

  $: xScale = scaleLinear()
    .domain([0, xs.length])
    .range([padding.left, chartWidth - padding.right]);

  $: yScale = scaleLinear()
    .domain([0, largest(ys)])
    .range([chartHeight - padding.bottom, padding.top]);

  $: innerWidth = chartWidth - (padding.left + padding.right);

  $: barWidth = innerWidth / xs.length;

  $: isData = dataset.points.length > 0;
</script>

<figure
  class="chart"
  bind:clientWidth={chartWidth}
  bind:clientHeight={chartHeight}
>
  <svg
    viewBox="{0} {0} {chartWidth + padding.right} {chartHeight +
      padding.bottom +
      16}"
  >
    {#if isData}
      <!-- y axis -->
      <g class="axis y-axis">
        {#each yTicks as tick, i}
          {#if i == 0}
            <g
              class="tick tick-{tick}"
              transform="translate(0, {yScale(tick)})"
            >
              <line x2="100%" />
            </g>
          {/if}
        {/each}
      </g>

      <g class="bars">
        {#each dataset.points as { x, y, yType, yAlt }, i}
          <rect
            style:--bar-bg-color={dataset.meta.color}
            x={xScale(i) + 12}
            y={yScale(y)}
            width={barWidth - 12}
            height={yScale(0) - yScale(y)}
          />

          <g
            transform="translate({xScale(i) + barWidth / 2}, {yScale(y) +
              0.5 * (yScale(0) - yScale(y))})"
          >
            <text
              data-bar-text={true}
              text-anchor="middle"
              class:chart-labels={true}
              style:fill="white"
            >
              {#if yType === "enumeration"}
                {`${yAlt} ${dataset.units.y}`}
              {:else if yType === "number"}
                {`${Math.round(y * 10) / 10} ${dataset.units.y}`}
              {:else if yType === "numerical-string"}
                {`${yAlt} ${dataset.units.y}`}
              {/if}
            </text>
          </g>
        {/each}
      </g>

      <!-- x axis -->
      <g class="axis x-axis">
        {#each xs as x, i}
          <g
            class="tick"
            transform="translate({xScale(i)},{chartHeight -
              padding.bottom +
              14})"
          >
            <text
              class:chart-labels={true}
              style:fill="black"
              x={barWidth / 2}
              y={12}
              color="white">{x}</text
            >
          </g>
        {/each}
        <line
          x1="0"
          y1={chartHeight - padding.bottom}
          x2={chartWidth}
          y2={chartHeight - padding.bottom}
          stroke="#fff"
          stroke-width="0.3"
        />
        <text
          class:chart-labels={true}
          style:fill="black"
          x={chartWidth / 2}
          y={chartHeight + 6}
          >{`${dataset.variableNames.x} `} {`(${dataset.units.x})`}</text
        >
      </g>
    {:else}
      <rect
        x="0"
        y="0"
        width={chartWidth}
        height={chartHeight * 0.6}
        fill="rgba(0,0,0,0.08)"
      />
      <text
        data-bar-text={true}
        x={chartWidth / 2}
        y={chartHeight / 2}
        text-anchor="middle"
        style="font-size: 12px;"
      >
        No data available
      </text>
    {/if}
  </svg>

  {#if $$slots.caption}
    <figcaption>
      <slot name="caption" />
    </figcaption>
  {/if}
</figure>

<style lang="scss">
  @import "../styles/typography";

  @import "../styles/color";
  @mixin hover-svg($bg) {
    background: $bg;
    &:hover {
      fill: darken($bg, 8%);
      transition: background 0.3s ease;
    }
    &:active {
      fill: darken($bg, 25%);
    }
  }

  .chart-title {
    font-family: $acumin-pro-condensed;
    font-weight: 600;
    font-size: large;
  }
  .chart-labels {
    font-family: $acumin-pro-semi-condensed;
    font-weight: 300;
    font-size: medium;
    // text-transform: capitalize;
  }
  .chart-axes-label {
    font-family: $acumin-pro-condensed;
  }

  figure {
    background-color: inherit;
    width: 100%;
    height: 100%;
    display: block;
  }
  figcaption {
    padding-top: 0.25rem;
    padding-left: 1rem;

    counter-increment: charts;

    &::before {
      font-size: smaller;
      display: inline-block;
      content: "Fig. " counter(charts);
    }
  }

  h2 {
    text-align: center;
  }

  .chart {
    width: 100%;
    height: 100%;
    max-height: 40vh;
    margin: 0 auto;
  }
  svg {
    position: relative;
    width: 100%;
    height: 100%;

    rect {
      /* @include hover-svg($teal); */
    }
    text {
      font-family: $acumin-pro-semi-condensed;
      pointer-events: none;
      font-size: medium;
      font-size: 16px;
      text-anchor: middle;

      &[data-bar-text="true"] {
        fill: white;
      }
    }
    tspan {
      font: bold 8px sans-serif;
      fill: red;
    }
  }
  .tick {
    font-size: 0.725em;
    font-weight: 200;
    line {
      stroke: grey;
      stroke-dasharray: 2;
    }
    text {
      fill: grey;
      text-anchor: start;
    }
  }
  .tick.tick-0 {
    line {
      stroke-dasharray: 0;
    }
  }
  .x-axis {
    .tick {
      text {
        text-anchor: middle;
      }
    }
  }
  .bars {
    rect {
      fill: var(--bar-bg-color);
      stroke: none;
      opacity: 0.65;
    }
  }
</style>
