import { writable } from "svelte/store";

export function createSidebarStore(initial: boolean) {
  const isOpen = writable<boolean>(initial);
  const { set, update } = isOpen;
  return {
    isOpen,
    open: () => set(true),
    close: () => set(false),
    toggle: () => update((n) => !n),
  };
}
