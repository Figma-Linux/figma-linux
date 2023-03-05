import { writable } from "svelte/store";

function createModalBounds() {
  const { subscribe, set, update } = writable<DOMRect>();

  return {
    subscribe,
    update,
    set,
  };
}

export const modalBounds = createModalBounds();
