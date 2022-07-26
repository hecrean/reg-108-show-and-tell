<script lang="ts" context="module">
	import type { StageADT } from '@/data/state';
	import { delay } from 'rxjs';
	import { largest, type Dataset, type NoData } from '@/utils/chart';
	import { resizeObserver } from '@/utils/resize-observer';
	import { scaleLinear } from 'd3-scale';
	import { onMount } from 'svelte';
	import Hoverable from './Hoverable.svelte';
	import Svg from '@/components/svg/Svg.svelte';
	import { clamp } from '@/utils/math';

	type TimelineItem = {
		stage: StageADT;
	};
</script>

<script lang="ts">
	import { fade, draw, scale } from 'svelte/transition';

	type $$Props = {
		timelineItems: Array<TimelineItem>;
		stage: StageADT;
	};
	export let timelineItems: Array<TimelineItem>;
	export let stage: StageADT;

	$: timelineLength = timelineItems.length;

	// let viewbox = `0 0 ${chartWidth + padding.left + padding.right} ${chartHeight + padding.top + padding.bottom}`;

	const SPACE_BETWEEN_CIRCLES = 2;

	let visible = true;
</script>

<Svg let:height let:hovering let:width let:left let:top>
	{#each timelineItems as item, i}
		<g transform="translate({i * (width / timelineLength)} {0})">
			<rect
				width={width / timelineLength}
				{height}
				style:fill={'rgb(0,0,255)'}
				style:stroke-width={1}
				style:stroke={'rgb(0,0,0)'}
			/>
			<circle
				class:circle={true}
				cx={0.5 * (width / timelineLength)}
				cy={'50%'}
				r={0.5 * ((0.3 * width) / timelineLength)}
				on:click={() => (stage = item.stage)}
			/>
			<text x={0.5 * (width / timelineLength)} y={'70%'} style:font-size={clamp(width / 10, 5, 20)}
				>{item.stage}</text
			>
		</g>
	{/each}

	<!-- {#each timelineItems as item, i}
				<g
					transform="translate({padding.left +
						radius +
						i * (diameter + SPACE_BETWEEN_CIRCLES)} {padding.top})"
					opacity="0.8"
					width={2 * radius + SPACE_BETWEEN_CIRCLES}
					height={2 * radius + SPACE_BETWEEN_CIRCLES}
				>
					<circle
						class:circle={true}
						cx={0}
						cy={radius}
						r={radius}
						on:click={() => (stage = item.stage)}
					/>


					<line
						in:draw={{ duration: 1000 }}
						x1={-(radius + SPACE_BETWEEN_CIRCLES / 2)}
						y1={radius}
						x2={-radius}
						y2={radius}
						stroke-width={lineWidth}
					/>
					<line
						in:draw={{ duration: 1000 }}
						x1={+radius}
						y1={radius}
						x2={+(radius + SPACE_BETWEEN_CIRCLES / 2)}
						y2={radius}
						stroke-width={lineWidth}
					/>
				</g>
	{/each} -->
</Svg>

<style lang="scss">
	@import '../styles/color';

	circle {
		pointer-events: all;
		fill: hsl(215, 20%, 65%);
	}
	line {
		stroke: hsl(214, 32%, 91%);
	}

	text {
		font-size: 10px;
		fill: white;
		text-anchor: middle;
		dominant-baseline: middle;
	}

	.circle {
		&:hover {
			fill: hsl(202, 100%, 21%);
		}
	}
</style>
