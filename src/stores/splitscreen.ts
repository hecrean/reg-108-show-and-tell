import { writable } from 'svelte/store';
export type SplitScreenState = 'left-minimised' | 'left-compact' | 'equal';

export const createSplitscreenStore = () => {
	const { update, set, subscribe } = writable<SplitScreenState>('left-compact');

	return {
		subscribe,
		update,
		setLeftMaximised: () => set('left-minimised'),
		setLeftCompact: () => set('left-compact'),
		setLeftMinimised: () => set('left-minimised')
	};
};
