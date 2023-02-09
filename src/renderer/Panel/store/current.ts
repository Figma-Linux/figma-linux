import { writable } from "svelte/store";

function createCurrent() {
  const { subscribe, set } = writable<number | undefined>();

  return {
    subscribe,
    set,
  };
}

export const currentTab = createCurrent();
