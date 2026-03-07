import { createSignal } from 'solid-js';

const [currentTab, setCurrentTab] = createSignal<Types.TabIdType>('mainTab');

export const currentTabStore = {
  get: currentTab,
  set: setCurrentTab,
};
