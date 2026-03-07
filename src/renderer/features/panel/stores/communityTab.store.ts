import { createSignal } from 'solid-js';

const [communityTabVisible, setCommunityTabVisible] = createSignal<boolean>(false);

export const communityTabStore = {
  get: communityTabVisible,
  set: setCommunityTabVisible,
  toggle: () => setCommunityTabVisible((prev) => !prev),
};
