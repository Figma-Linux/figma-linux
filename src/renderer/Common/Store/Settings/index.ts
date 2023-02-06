import { writable } from "svelte/store";

function createSettings() {
  const { subscribe, update } = writable({});

  return {
    subscribe,
    reset: () => update((current) => (current = undefined)),
    setFocus: (id?: number) => update((current) => (current = id)),
  };
}

export const settings = createSettings();
