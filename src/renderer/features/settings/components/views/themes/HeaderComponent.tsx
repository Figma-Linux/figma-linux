import { Flex } from 'Shared/components/ui/containers';
import { Spinner } from 'Shared/components/ui/containers';
import { Button } from 'Shared/components/ui/buttons';
import { Sync } from 'Shared/components/icons';
import { themesLoadedStore } from '../../../stores';

export function ThemesHeaderComponent() {
  const api = window.settingsAPI;

  const onThemeSync = () => {
    api.syncThemes();
    themesLoadedStore.set(false);
  };

  return (
    <Flex>
      <Button
        onClick={onThemeSync}
        size={32}
        round={3}
        margin="0 4px 0 0"
        hoverBgColor="var(--borders)"
      >
        <Spinner spin={!themesLoadedStore.get()}>
          <Sync color="var(--text)" />
        </Spinner>
      </Button>
      <Flex width="10px" />
    </Flex>
  );
}
