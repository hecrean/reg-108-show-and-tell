<script>
	import Hamburger from '@/components/Hamburger.svelte';
	import EyleaLogo from '@/icons/EyleaLogo.svelte';
	
	export let sidebar = false;
</script>

<header data-open={sidebar}>
	<nav class="left-corner">
		<EyleaLogo/>
	</nav>
	<div class:spacer={true}/>
	<nav class="right-corner">
		<Hamburger bind:open={sidebar} />
	</nav>
</header>

<style lang="scss">
	header {
		z-index: 20;
		width: 100vw;
		position: sticky;
		top: 0;
		// z-index: 20;
		height: 60px;
		background-color: hsl(193, 64%, 80%);
		&[data-open=true]{
			background-color: transparent;
		}
		transition: background-color 0.3s ease;

		display: flex;
		flex-direction: row;
		justify-items: center;
		align-items: center;
		padding: 0 1rem;
	}

	.right-corner {
		max-height: 50px;
		
		// padding: 10px 10px 10px 10px;

	}
	.left-corner {
		max-height: 50px;
		aspect-ratio: 1;
	}

	.spacer {
			flex-grow: 1;
		}
</style>
