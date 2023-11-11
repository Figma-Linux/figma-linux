import { writable } from "svelte/store";

function createPanelZoom() {
  const { subscribe, update, set } = writable<number>(1);

  return {
    subscribe,
    update,
    set,
  };
}

export const panelZoom = createPanelZoom();
