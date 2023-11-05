import { writable } from "svelte/store";

function createTabs() {
  const { subscribe, set, update } = writable<Types.TabFront[]>([]);
  let state: Types.TabFront[] = [];

  subscribe((s) => (state = s));

  return {
    set,
    subscribe,
    addTab: (data: Types.AddTabProps) =>
      update((tabs) =>
        [
          ...tabs,
          {
            id: data.id,
            title: data.title ?? "Figma",
            url: data.url,
            moves: false,
            order: data.order ?? tabs.length + 1,
            focused: data.focused,
            isUsingMicrophone: false,
            isInVoiceCall: false,
            loading: true,
          },
        ].sort((a, b) => (a.order > b.order ? 1 : -1)),
      ),
    deleteTab: (id: number) => update((tabs) => tabs.filter((t) => t.id !== id)),
    clear: () => update((tabs) => (tabs = [])),
    updateTab: (tab: Types.TabFront) =>
      update((tabs) =>
        tabs
          .map((t) => (t.id === tab.id ? { ...t, ...tab } : t))
          .sort((a, b) => (a.order > b.order ? 1 : -1)),
      ),
    getTab: (id: number) => state.find((tab) => tab.id === id),
    getTabByTitle: (title: string) => state.find((tab) => tab.title === title),
  };
}

export const tabs = createTabs();
