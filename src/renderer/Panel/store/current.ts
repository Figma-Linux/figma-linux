import { writable } from "svelte/store";

function createCurrent() {
  const { subscribe, set } = writable<Types.TabIdType>("mainTab");

  return {
    subscribe,
    set,
  };
}

export const currentTab = createCurrent();
