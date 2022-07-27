import { writable } from "svelte/store";

export function holyGrailStore(
  sidebarInitiallyOpen: boolean,
  initialHeaderHeight: number
) {
  const sidebarIsOpen = writable<boolean>(sidebarInitiallyOpen);
  const headerHeight = writable<string>(`${initialHeaderHeight}px`);
  return {
    sidebarIsOpen,
    headerHeight,
    openSidebar: () => sidebarIsOpen.set(true),
    closeSidebar: () => sidebarIsOpen.set(false),
    toggleSidebar: () => sidebarIsOpen.update((n) => !n),
    setHeaderHeight: (h: number) => headerHeight.set(`${h}px`),
  };
}
