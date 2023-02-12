import { writable } from "svelte/store";

function createTabView() {
  const { subscribe, update, set } = writable<string | undefined>();

  return {
    set,
    subscribe,
    reset: () => set(undefined),
  };
}

export const tabView = createTabView();
