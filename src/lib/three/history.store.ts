import type { StageADT, ViewADT } from "@/data/state";
import { writable } from "svelte/store";

// export const createStack = <T>(store: Writable<T>) => {
// 	const array = new Array<T>();

// 	return derived(store, ($value) => {
// 		const items = [$value, ...array.slice(0, -1)];
// 		return {
// 			items,
// 			storedItems: items.length,
// 			lastTwo: (): [T, T] =>
// 				items.length >= 2
// 					? [items[items.length - 1], items[items.length - 2]]
// 					: [items[items.length - 1], items[items.length - 1]]
// 		};
// 	});
// };

export const transitionHistory = (
  initial: [view: ViewADT, stage: StageADT]
) => {
  const { update, subscribe } = writable<{
    prev: [view: ViewADT, stage: StageADT];
    curr: [view: ViewADT, stage: StageADT];
  }>({ prev: initial, curr: initial });

  return {
    subscribe,
    add: (view: ViewADT, stage: StageADT) =>
      update((v) => ({ prev: v.curr, curr: [view, stage] })),
  };
};
