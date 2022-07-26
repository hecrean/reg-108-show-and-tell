import type { Action } from './types';

/**
 * Creates panStart, panMove, panEnd events so you can drag elements.
 *
 * Demo: https://svelte.dev/tutorial/actions
 *
 * @example
 * ```svelte
 * <div use:pannable={true} on:panstart on:panmove on:panend>
 * ```
 */
type ScrollOpt = { id: string | null };

export const scrollto: Action<ScrollOpt> = (node, options) => {
	let currOptions: ScrollOpt = options;

	const scroll = ({ id }: ScrollOpt) => {
		if (id) {
			document.getElementById(id)?.scrollIntoView();
		}
	};

	scroll(currOptions);

	return {
		update(options: ScrollOpt): void {
			currOptions = options;
		}
	};
};
