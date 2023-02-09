import { writable } from "svelte/store";

function createIsMenuOpen() {
  const { subscribe, update, set } = writable<boolean>(false);

  return {
    subscribe,
    set,
    toggle: () => update((isOpen) => !isOpen),
  };
}

export const isMenuOpen = createIsMenuOpen();
