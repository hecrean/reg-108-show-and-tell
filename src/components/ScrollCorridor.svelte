<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '@/app/navigation';
	import Loading from '@/components/Loading.svelte';
	import Ring from '@/components/Ring.svelte';
	import { clamp } from '@/utils/math';
	import { Observable } from 'rxjs';
	import { onMount } from 'svelte';
	import { noop } from 'svelte/internal';
	import { fade } from 'svelte/transition';

	/**Props********/
	export let sectionName: string = '';
	export let routeAtEndOfCorridor: string;
	/**************/

	const intersectionObserver = <T extends HTMLElement>(
		element: T,
		options?: IntersectionObserverInit
	): Observable<IntersectionObserverEntry> => {
		return new Observable<IntersectionObserverEntry>((subscriber) => {
			const intersectionObserver = new IntersectionObserver(
				(entries: IntersectionObserverEntry[]) => {
					for (let entry of entries) {
						if (entry.target === element) {
							subscriber.next(entry);
							break;
						}
					}
				},
				options
			);

			intersectionObserver.observe(element);

			return () => {
				intersectionObserver.unobserve(element);
				intersectionObserver.disconnect();
			};
		});
	};

	let sectionEl: HTMLElement;
	let endOfSectionEl: HTMLElement;
	let reachedEndOfSection: boolean = false;
	let windowScrollY: number = 0;
	let windowHeight: number;

	let sectionBoundingRect: DOMRect;

	$: sectionProgressRatio = sectionBoundingRect
		? clamp(
				(windowScrollY - sectionBoundingRect.top) /
					clamp(sectionBoundingRect.height - windowHeight, 0, sectionBoundingRect.height),
				0,
				1
		  )
		: 0;

	$: {
		reachedEndOfSection ? goto(routeAtEndOfCorridor) : noop();
	}

	async function routeToPage(route: string) {
		goto(route);
	}

	// declare a reactive property that will change to `true` when navigation is running
	$: loading = false;

	beforeNavigate(() => {
		loading = true;
	});

	afterNavigate(() => {
		loading = false;
	});

	onMount(() => {
		const endOfSectionIntersectionObserver$ = intersectionObserver(endOfSectionEl);
		const sectionIntersectionObserver$ = intersectionObserver(sectionEl);

		const subscription1 = endOfSectionIntersectionObserver$.subscribe(({ isIntersecting }) => {
			reachedEndOfSection = isIntersecting;
		});

		const subscription2 = sectionIntersectionObserver$.subscribe(({ boundingClientRect }) => {
			sectionBoundingRect = boundingClientRect;
		});

		return () => {
			subscription1.unsubscribe();
			subscription2.unsubscribe();
		};
	});
</script>

<svelte:window bind:scrollY={windowScrollY} bind:innerHeight={windowHeight} />

<section class:scroll-corridor-container={true} bind:this={sectionEl}>
	<div class:fullly-covering-sticky-container={true}>
		<Ring progressionRatio={sectionProgressRatio} radius={80} />
		{#if reachedEndOfSection}
			<div class="modal" transition:fade>
				<Loading />
			</div>
		{/if}
		<div class:bottom-right-overlay={true}>
			<a>{sectionName}</a>
		</div>
	</div>
</section>
<div class="end-of-section" data-is-intersecting={reachedEndOfSection} bind:this={endOfSectionEl} />

<style lang="scss">
	/* header */
	.modal {
		display: grid;
		place-items: center;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(26, 18, 25, 0.63);
		backdrop-filter: blur;
	}

	.end-of-section {
		height: 1px;
		background-color: inherit;
		width: 100%;

		&[data-is-intersecting='true'] {
		}
	}

	.scroll-corridor-container {
		width: 100%;
		position: relative;
		height: 500vh;
		max-width: 1920rem;
		margin-left: auto;
		margin-right: auto;
		box-sizing: content-box;
	}

	.fullly-covering-sticky-container {
		display: flex;
		position: sticky;
		top: 0;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.bottom-right-overlay {
		position: absolute;
		left: 0;
		bottom: 4rem;
		z-index: 20;
		writing-mode: vertical-rl;

		a {
			text-transform: uppercase;
			color: inherit;
		}
	}
</style>
