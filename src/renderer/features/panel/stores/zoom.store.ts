import { createSignal } from 'solid-js';

const [panelZoom, setPanelZoom] = createSignal<number>(1);

export const panelZoomStore = {
  get: panelZoom,
  set: setPanelZoom,
};
