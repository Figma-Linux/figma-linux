import { writable } from "svelte/store";

function createCommunityTabVisible() {
  const { subscribe, update, set } = writable<boolean>(false);

  return {
    subscribe,
    set,
    toggle: () => update((visible) => !visible),
  };
}

export const communityTabVisible = createCommunityTabVisible();
