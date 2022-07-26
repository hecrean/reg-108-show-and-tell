<script lang="ts">
  import type { Dataset } from "@/utils/chart";
  import { SvelteComponentTyped } from "svelte";

  type $$Props = {
    dataset: Dataset;
  };

  export class Table extends SvelteComponentTyped<$$Props> {}

  export let dataset: Dataset;

  const { x: xUnit, y: yUnit } = dataset.units;
</script>

<table>
  <!-- {#if showHeadings}
		<thead>
			{#each colIds as colId}
				<tr>
					<th scope="col" />
					<th scope="col" headers={colId}>{colId}</th>
				</tr>
			{/each}
		</thead>
	{/if} -->
  <tbody>
    {#each dataset.points as { x, y }}
      <tr>
        <th scope="row" headers={`${x}`}>{x} {xUnit}</th>
        <td headers={`${y}`}>
          <span class:pill={true} style:--dataset-color={dataset.meta.color}
            >{y}</span
          >
          <span> {yUnit}</span>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  @import "../styles/color";

  @mixin background($bg) {
    background: $bg;
    &:hover {
      background: darken($bg, 8%);
      transition: background 0.3s ease;
    }
    &:active {
      background: darken($bg, 25%);
    }
  }

  .pill {
    color: $white;
    border-radius: 10px;
    padding: 0 10px;
    margin: 0 2px;
    background-color: var(--dataset-color);
    &:hover {
      filter: brightness(85%);
      transition: background-color 0.3s ease;
    }
    &:active {
      filter: brightness(85%);
    }
  }

  table {
    color: $base-grey;
    margin-top: 1rem;
    margin: 0;
    padding: 0;
    width: 100%;
    border: none;
    border-collapse: collapse;
  }

  tr {
    @include background(hsl(0, 0%, 97%));
  }

  th,
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    white-space: normal;
    padding: 0.5rem 1rem;
    vertical-align: middle;
    text-transform: capitalize;
    font-size: small;
  }

  th {
    text-align: left;
    &[scope="col"] {
    }
    &[scope="row"] {
    }
    &[scope="colgroup"] {
    }
  }

  tbody {
    tr {
      min-height: 2rem;
      border-collapse: separate;
      border-bottom: 2px solid rgba($base-grey, 0.6);
    }
    td {
      text-align: right;
      font-size: smaller;
    }
  }
</style>
