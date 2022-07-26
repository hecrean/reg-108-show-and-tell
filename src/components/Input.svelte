<script lang="ts">
	let value: string = '';
</script>

<input type="search" placeholder="Add Case Studies..." bind:value class:activated={!!value} />

<style lang="scss">
	/**
        Attach a 'search engine' type component to the search bar: 
        -   
    */
	input[type='search'] {
		width: 100%;
		padding: 12px 20px;
		margin: 8px 0;
		box-sizing: border-box;
		background-color: transparent;
	}

	.activated {
		/* border-bottom: 2px solid white; */
		color: white;
		/* -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.1), 0 0 3px rgba(0, 0, 0, 0.1);
		-moz-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.1), 0 0 3px rgba(0, 0, 0, 0.1);
		box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.1), 0 0 3px;*/
	}
</style>
