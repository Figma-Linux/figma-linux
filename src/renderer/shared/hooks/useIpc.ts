import { onCleanup, onMount } from 'solid-js';

export function useIpcListener<T>(
  subscribe: (callback: (data: T) => void) => () => void,
  handler: (data: T) => void
) {
  let unsubscribe: (() => void) | undefined;

  onMount(() => {
    unsubscribe = subscribe(handler);
  });

  onCleanup(() => {
    unsubscribe?.();
  });
}
