import { createSignal } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

let idCounter = 0;

const [tabViewState, setTabViewState] = createStore<Types.Dic<string>>({});

export const tabViewStore = {
  get: () => tabViewState,
  createId: () => idCounter++,
  set: (id: number | string, item: string) => {
    setTabViewState(produce((state) => {
      state[id] = item;
    }));
  },
};
