<script lang="ts">
	export let progressionRatio: number = 0;
	export let radius: number;

	$: circumference = radius * 2 * Math.PI;
	$: offset = (1 - progressionRatio) * circumference;

	$: inverseProgressionRatio = `${Math.round((1 - progressionRatio) * 5)}px`;
</script>

<div class="relative" style="--progression-ratio: {inverseProgressionRatio}">
	<svg viewBox={`0 0 ${4 * radius} ${4 * radius}`}>
		<circle
			stroke-dasharray={`${circumference} ${circumference}`}
			stroke-dashoffset={`${offset}`}
			stroke-width="4"
			fill="transparent"
			r={radius}
			cx={2 * radius}
			cy={2 * radius}
		/>
		<text
			x={2 * radius}
			y={2 * radius}
			fill="#fff"
			text-anchor="middle"
			style="font-size: 30px; font-family: 'Spectral', serif;"
		>
			Case Studies
		</text>
	</svg>
</div>

<style lang="scss">
	$inverse-progression: var(--progression-ratio);
	.relative {
		position: relative;
		padding: 30px;
		height: 30vw;
		width: 30vw;
		/* filter: blur($inverse-progression); */
	}

	svg {
		display: block;
	}

	circle {
		stroke: wheat;
		transition-duration: 0.1s;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
