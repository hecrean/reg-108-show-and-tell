<!-- Grid that changes it configuration contingent on its context -->
<script lang="ts">
	import { mapToBreakpoint } from '@/utils/breakpoints';

	let blockWidth: number = 20;

	$: gridBreakpoint = mapToBreakpoint(blockWidth);
</script>

<div class="grid-layout" data-layout={gridBreakpoint} bind:clientWidth={blockWidth}>
	<slot />
</div>

<style lang="scss">
	.grid-layout {
		width: 100%;
		height: 100%;
		display: grid;
		align-items: center;
		justify-items: center;

		&[data-layout='xxxs'],
		&[data-layout='xxs'],
		&[data-layout='xs'] {
			margin-top: 0;
			grid-template-columns: repeat(1, minmax(0, 1fr));
			column-gap: 1rem;
		}
		&[data-layout='sm'] {
			margin-top: 0;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: 1.5rem;
		}
		&[data-layout='md'] {
			margin-top: 0;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			column-gap: 2rem;
		}
		&[data-layout='lg'] {
			margin-top: 0;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			column-gap: 2rem;
		}

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
</style>
