import { writable } from "svelte/store";

function createTabs() {
  const { subscribe, set, update } = writable<Types.TabFront[]>([]);
  let state: Types.TabFront[] = [];

  subscribe((s) => (state = s));

  return {
    set,
    subscribe,
    addTab: (data: Types.AddTabProps) =>
      update((tabs) => [
        ...tabs,
        {
          id: data.id,
          title: data.title ?? "Figma",
          url: data.url,
          moves: false,
          order: tabs.length + 1,
          focused: data.focused,
          isUsingMicrophone: false,
          isInVoiceCall: false,
        },
      ]),
    deleteTab: (id: number) => update((tabs) => tabs.filter((t) => t.id !== id)),
    clear: () => update((tabs) => (tabs = [])),
    updateTab: (tab: Types.TabFront) =>
      update((tabs) =>
        tabs
          .map((t) => (t.id === tab.id ? { ...t, ...tab } : t))
          .sort((a, b) => (a.order > b.order ? 1 : 0)),
      ),
    getTab: (id: number) => state.find((tab) => tab.id === id),
  };
}

export const tabs = createTabs();
