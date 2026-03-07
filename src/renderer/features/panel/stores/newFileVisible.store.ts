import { createSignal } from 'solid-js';

const [newFileVisible, setNewFileVisible] = createSignal<boolean>(true);

export const newFileVisibleStore = {
  get: newFileVisible,
  set: setNewFileVisible,
  toggle: () => setNewFileVisible((prev) => !prev),
};
