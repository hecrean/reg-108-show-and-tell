<script lang="ts">
	type Vec2 = { x: number; y: number };

	export let coords: Vec2;
	export let size: Vec2;
	export let color: string;
</script>

<g transform={`translate(${coords.x * size.x} ${coords.y * size.y})`}>
	<path d={'M0 8L8 0L0 -8L-8 0Z'} stroke-width={2} stroke={color} fill="transparent" />
</g>
