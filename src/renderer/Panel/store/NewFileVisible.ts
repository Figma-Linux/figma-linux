import { writable } from "svelte/store";

function createNewFileVisible() {
  const { subscribe, update, set } = writable<boolean>(true);

  return {
    subscribe,
    set,
    toggle: () => update((visible) => !visible),
  };
}

export const newFileVisible = createNewFileVisible();
