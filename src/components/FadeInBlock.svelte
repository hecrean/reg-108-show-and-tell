<script lang="ts">
	import { Observable } from 'rxjs';
	import { onMount } from 'svelte';

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
	let isIntersecting: boolean = false;

	onMount(() => {
		const intersectionObserver$ = intersectionObserver(sectionEl);

		const subscription = intersectionObserver$.subscribe((o) => {
			isIntersecting = o.isIntersecting;
		});

		return () => subscription.unsubscribe();
	});
</script>

<div
	bind:this={sectionEl}
	class:block={true}
	class:relative={true}
	class:opacity-transition={true}
	is-intersecting={isIntersecting}
>
	<div class:transform-transition={true} is-intersecting={isIntersecting}>
		<div class:flex-container={true}>
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	.block {
		width: 100%;
		z-index: 200;
	}

	.opacity-transition {
		&[is-intersecting='true'] {
			opacity: 1;
			transition-timing-function: linear;
			transition-duration: 1s;
			transition-property: opacity;
		}
		&[is-intersecting='false'] {
			opacity: 0;
		}
	}
	.transform-transition {
		&[is-intersecting='true'] {
			transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
			transition-duration: 5s;
			transition-property: transform;
			transform: translateX(0) translateY(0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);
		}
		&[is-intersecting='false'] {
			transform: translateX(0) translateY(100px) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);
		}
	}
	.relative {
		position: relative;
	}
	.absolute {
		position: absolute;
		right: 0;
		left: 0;
		top: 0;
	}
	.flex-container {
		width: 100%;
		display: flex;
		align-items: center;
		justify-items: center;
		text-align: center;
	}
</style>
