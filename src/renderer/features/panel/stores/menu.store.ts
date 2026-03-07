import { createSignal } from 'solid-js';

const [isMenuOpen, setIsMenuOpen] = createSignal<boolean>(false);

export const menuStore = {
  get: isMenuOpen,
  set: setIsMenuOpen,
  toggle: () => setIsMenuOpen((prev) => !prev),
};
