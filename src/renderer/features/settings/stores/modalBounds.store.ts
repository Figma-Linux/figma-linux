import { createSignal } from 'solid-js';

const [modalBounds, setModalBounds] = createSignal<DOMRect | undefined>(undefined);

export const modalBoundsStore = {
  get: modalBounds,
  set: setModalBounds,
};
