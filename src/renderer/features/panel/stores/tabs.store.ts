import { createSignal } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

const [tabsState, setTabsState] = createStore<Types.TabFront[]>([]);

export const tabsStore = {
  get: () => tabsState,
  set: (tabs: Types.TabFront[]) => setTabsState(tabs),
  addTab: (data: Types.AddTabProps) => {
    setTabsState(
      produce((tabs) => {
        tabs.push({
          id: data.id,
          title: data.title ?? 'Figma',
          url: data.url,
          moves: false,
          order: data.order ?? tabs.length + 1,
          focused: data.focused,
          isUsingMicrophone: false,
          isInVoiceCall: false,
          loading: true,
        });
        tabs.sort((a, b) => (a.order > b.order ? 1 : -1));
      })
    );
  },
  deleteTab: (id: number) => {
    setTabsState((tabs) => tabs.filter((t) => t.id !== id));
  },
  clear: () => {
    setTabsState([]);
  },
  updateTab: (tab: Partial<Types.TabFront> & { id: number }) => {
    setTabsState(
      produce((tabs) => {
        const index = tabs.findIndex((t) => t.id === tab.id);
        if (index !== -1) {
          Object.assign(tabs[index], tab);
        }
        tabs.sort((a, b) => (a.order > b.order ? 1 : -1));
      })
    );
  },
  getTab: (id: number) => tabsState.find((tab) => tab.id === id),
  getTabByTitle: (title: string) => tabsState.find((tab) => tab.title === title),
};
