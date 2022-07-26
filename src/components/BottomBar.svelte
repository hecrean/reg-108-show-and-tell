<script lang="ts">
	import Hoverable from './Hoverable.svelte';
</script>

<Hoverable let:hovering>
	<aside class:open={hovering}>
		<slot />
	</aside>
</Hoverable>

<style>
	aside {
		position: absolute;
		top: calc(100vh - 2rem);
		background-color: #e5e7eb;
		width: 100%;
		height: 2rem;
		overflow-y: hidden;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		z-index: 5;
	}

	.open {
		bottom: 0;
		height: calc(2rem + 100vh);
	}
</style>
