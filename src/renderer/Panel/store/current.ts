import { writable } from "svelte/store";

function createCurrent() {
  const { subscribe, set } = writable<number>(0);

  return {
    subscribe,
    set,
  };
}

export const currentTab = createCurrent();
