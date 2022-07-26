<!-- 
svg-canvas: rendered on the screen relative to a finite region (the viewport)
viewport: size is specified by width and height attrs on svg
The supported length unit identifiers in SVG are: em, ex, px, pt, pc, cm, mm, in, and percentages. 
viewbox:
-->
<script lang="ts">
	import { resizeObserver } from '@/utils/resize-observer';
	import { onMount } from 'svelte';

	// type Padding = { top: number, right: number, bottom: number, left: number };

	// type $$Props = {padding: Padding};
	// export let padding: Padding

	let isMounted = false;

	let containerEl: HTMLDivElement;
	let width: number;
	let height: number;
	let left: number;
	let top: number;
	let hovering: boolean = false;

	onMount(() => {
		const chartElResize$ = resizeObserver(containerEl);
		const subscription = chartElResize$.subscribe((rect: DOMRect) => {
			width = rect.width;
			height = rect.height;
			left = rect.left;
			top = rect.top;
		});

		isMounted = true;

		return () => subscription.unsubscribe();
	});

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}
</script>

<div bind:this={containerEl} on:mouseenter={enter} on:mouseleave={leave}>
	{#if isMounted}
		<svg
			width={`${width}px`}
			height={`${height}px`}
			viewBox="0 0 {`${width}px`} {`${height}px`}"
			style:left={`${left}px`}
			style:top={`${top}px`}
			style:width={`${width}px`}
			style:height={`${height}px`}
		>
			<slot {width} {height} {top} {left} {hovering} />
		</svg>
	{/if}
</div>

<style lang="scss">
	.container {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: relative;
	}

	svg {
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>
