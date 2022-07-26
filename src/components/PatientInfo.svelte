<script lang="ts">
  import FlexboxRows from "@/components/flexbox-table/Rows.svelte";
  import type { CaseStudy, StageADT, ViewADT } from "@/data/state";
  import ChevronRightIcon from "@/icons/ChevronRightIcon.svelte";
  import CrossIcon from "@/icons/CrossIcon.svelte";
  import type { SplitScreenState } from "@/stores/splitscreen";
  import { mapToBreakpoint } from "@/utils/breakpoints";
  import { datasetFn } from "@/utils/chart";
  import BarChart from "./BarChart.svelte";
  import NavigationMenu from "./NavigationMenu.svelte";

  type $$Props = {
    caseStudy: CaseStudy;
    splitscreen: SplitScreenState;
    view: ViewADT;
    stage: StageADT;
  };
  export let caseStudy: CaseStudy;
  export let splitscreen: SplitScreenState;
  export let view: ViewADT;
  export let stage: StageADT;

  let blockWidth: number = 200;

  $: dashboardBreakpoint = mapToBreakpoint(blockWidth);

  const arrayify = (obj: Object): Array<[string, string]> =>
    Object.entries(obj).map(([rowHeading, rowVal], index) => {
      const cleanedRowHeading = rowHeading.replaceAll("_", " ");
      return [cleanedRowHeading, rowVal.toString()];
    });

  $: baselineCharaceristicsArray = arrayify(caseStudy.baseline_characteristics);
  $: clinicalHistoryArray = arrayify(caseStudy.clinical_history);

  $: label = caseStudy.stages[stage].views[view][0].label;

  const stages: Array<StageADT> = ["baseline", "week24", "week52"];

  const sanitiseStageString = (stage: StageADT) => {
    switch (stage) {
      case "baseline":
        return "baseline";
      case "week24":
        return "week 24";
      case "week52":
        return "week 52";
    }
  };
</script>

<article bind:clientWidth={blockWidth}>
  <div class:mask-overlay={true} />
  <div class="avatar-block" style:--avatar-block-color={caseStudy.colorId}>
    <!-- avatar -->
    <div class:flex-row={true}>
      <button
        class="toggle-button"
        on:click|preventDefault={() =>
          splitscreen === "left-compact"
            ? (splitscreen = "equal")
            : (splitscreen = "left-compact")}
      >
        {#if splitscreen === "equal"}
          <CrossIcon />
        {:else}
          <ChevronRightIcon />
        {/if}
      </button>
      <div class="avatar-wrapper">
        <img class="avatar-img" src={caseStudy.profile_picture} />
      </div>
    </div>
  </div>

  <div class="dashboard">
    <!-- <SearchInput /> -->
    <div class="case-study-tokens">
      <!-- <Token
				tag="patient 1"
				avatarUrl="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
				bgColor={caseStudy.colorId}
			/> -->
      <!-- <IconButton><PlusIcon /></IconButton> -->
    </div>

    <NavigationMenu
      headings={[
        "patient overview",
        "Observations",
        "DRSS",
        "EDTRS",
        "Snellen Equivalent",
        "NPDR",
        "CRT",
      ]}
    >
      <svelte:fragment slot="slot-1">
        <!-- <p>
          <Token bgColor={caseStudy.colorId} tag={view} crossShown={false} />
          <Token bgColor={caseStudy.colorId} tag={stage} crossShown={false} />
        </p> -->
        <h4>{view} at {sanitiseStageString(stage)}</h4>
        <p>
          {label}
        </p>
      </svelte:fragment>
      <svelte:fragment slot="slot-0">
        <FlexboxRows rows={baselineCharaceristicsArray} />
        {#each clinicalHistoryArray as [head, val]}
          <FlexboxRows rows={[[head, val, true]]} />
        {/each}
      </svelte:fragment>
      <svelte:fragment slot="slot-2">
        <!-- <Table dataset={datasetFn(caseStudy, stages, "DRSS")} /> -->
        <div class="chart-grid" data-layout={dashboardBreakpoint}>
          <h3 class:chart-title={true}>DRSS</h3>
          <BarChart dataset={datasetFn(caseStudy, stages, "DRSS")} />
        </div>
      </svelte:fragment>
      <svelte:fragment slot="slot-3">
        <!-- <Table dataset={datasetFn(caseStudy, stages, "EDTRS")} /> -->
        <div class="chart-grid" data-layout={dashboardBreakpoint}>
          <h3 class:chart-title={true}>EDTRS</h3>
          <BarChart dataset={datasetFn(caseStudy, stages, "EDTRS")} />
        </div>
      </svelte:fragment>
      <svelte:fragment slot="slot-4">
        <div class="chart-grid" data-layout={dashboardBreakpoint}>
          <h3 class:chart-title={true}>Snellen Equivalent</h3>
          <BarChart
            dataset={datasetFn(caseStudy, stages, "snellen_equivalent")}
          />
        </div>
      </svelte:fragment>
      <svelte:fragment slot="slot-5">
        <!-- <Table dataset={datasetFn(caseStudy, stages, "NPDR_grading")} /> -->
        <div class="chart-grid" data-layout={dashboardBreakpoint}>
          <h3 class:chart-title={true}>NPDR Grading</h3>
          <BarChart dataset={datasetFn(caseStudy, stages, "NPDR_grading")} />
        </div>
      </svelte:fragment>
      <svelte:fragment slot="slot-6">
        <!-- <Table dataset={datasetFn(caseStudy, stages, "CRT")} /> -->
        <div class="chart-grid" data-layout={dashboardBreakpoint}>
          <h3 class:chart-title={true}>CRT</h3>
          <BarChart dataset={datasetFn(caseStudy, stages, "CRT")} />
        </div>
      </svelte:fragment>
    </NavigationMenu>
  </div>
</article>

<style lang="scss">
  @use "sass:math";
  @import "../styles/typography";

  @import "../styles/color";

  p {
    padding: 1rem 2rem;
  }

  h4 {
    padding: 1rem 2rem;
    text-transform: uppercase;
  }

  .chart-title {
    color: $eylea-blue;
    margin: 0 auto;
    font-family: $acumin-pro-condensed;
    font-weight: 600;
    font-size: large;
  }

  .chart-container {
    width: 100%;
    height: 500px;
  }

  article {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    background-color: $base-grey;
  }

  .mask-overlay {
    pointer-events: none;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    min-height: 100%;
    z-index: 2;
    /* background: linear-gradient(to right, transparent 99%, rgba(4, 180, 31, 0.954)); */
  }

  /* utils */
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

  @mixin circle($width) {
    min-width: 1px;
    min-height: 1px;
    width: $width;
    height: $width;
    -webkit-border-radius: math.div($width, 2);
    -moz-border-radius: math.div($width, 2);
    border-radius: math.div($width, 2);
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    flex: 1;
    align-items: center;
    justify-content: center;
  }

  /* avatar */
  .avatar-block {
    $avatar-block-color: var(--avatar-block-color);
    $avatar-block-color-darker: hsl(from $avatar-block-color);

    width: 100%;
    padding: 20px 20px;
    // background: linear-gradient(
    //   $avatar-block-color,
    //   rgba(hsl(0, 0%, 97%), 0.8)
    // );
    background: linear-gradient(
      to bottom,
      $avatar-block-color,
      hsl(0, 0%, 97%)
    );

    .toggle-button {
      z-index: 1;
      margin: 0rem -1rem;
      @include circle(2.5rem);
      // @include background($avatar-block-color);
      @include background(hsl(49, 100%, 50%));
      color: hsl(205, 24%, 51%);
    }

    .avatar-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      overflow: hidden;
      user-select: none;
      width: 8rem;
      height: 8rem;
      border-radius: 100%;
      background-color: $eylea-blue;
      border: none;

      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
      }
    }
  }

  .table {
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    column-gap: 2rem;

    .table-row {
      @include background($white);
      margin-top: 1rem;
      display: flex;
      flex-direction: row;
      color: $light-grey;
      flex-grow: 1;
      padding: 2px 2px;
      border-radius: 12px;
      font-size: small;

      .row-heading {
        padding: 0 20px;
        text-transform: capitalize;
        color: $grey-800;
        align-self: flex-start;
        font-weight: 800;
      }
      .row-data {
        padding: 0 20px;
        text-transform: capitalize;
        font-style: oblique;
        color: $grey-800;
        align-self: flex-end;
      }
      .spacer {
        flex-grow: 1;
      }
    }

    .gobbet {
      margin-top: 1rem;
      padding: 0 20px;
      font-size: small;
      font-style: oblique;
    }
  }

  .dashboard {
    width: 100%;
    flex: 1;
    padding-bottom: 2rem;
    background-color: hsl(0, 0%, 97%);
    /* background-color: inherit; */

    .case-study-tokens {
      display: flex;
      flex-direction: row;
      padding: 0 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .chart-grid {
      counter-reset: charts;

      display: grid;
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: 1rem;
      padding-bottom: 4rem;
      border-bottom-width: 1px;
      border-color: #9ca3af;
      align-content: center;
      justify-content: center;

      &[data-layout="xxxs"],
      &[data-layout="xxs"],
      &[data-layout="xs"],
      &[data-layout="sm"],
      &[data-layout="md"],
      &[data-layout="lg"] {
        margin-top: 0;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        column-gap: 1rem;
      }
      // &[data-layout="md"] {
      //   margin-top: 0;
      //   grid-template-columns: repeat(2, minmax(0, 1fr));
      //   column-gap: 1.5rem;
      // }
      // &[data-layout="lg"] {
      //   margin-top: 0;
      //   grid-template-columns: repeat(3, minmax(0, 1fr));
      //   column-gap: 2rem;
      // }

      .color-white {
        color: #ffffff;
      }

      .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
      }
      .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
    }
  }
</style>
