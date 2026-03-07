import { createMemo } from 'solid-js';
import { Range, CheckBox, TextInput, List } from 'Shared/components/ui/inputs';
import { Text, Label } from 'Shared/components/ui/text';
import { Flex, FlexItem } from 'Shared/components/ui/containers';
import { ButtonTool, SecondaryButton } from 'Shared/components/ui/buttons';
import { Folder } from 'Shared/components/icons';
import { Line } from 'Shared/components/ui/text';
import { TOPPANELHEIGHT } from 'Const';
import { settingsStore, modalBoundsStore } from '../../../stores';
import { DirectoryListItem } from './DirectoryListItem';
import { SwitchListItem } from './SwitchListItem';
import styles from './GeneralView.module.css';

interface GeneralViewProps {
  zIndex: number;
  onSetTabViewIndex?: (detail: { index: number }) => void;
}

export function GeneralView(props: GeneralViewProps) {
  const api = window.settingsAPI;

  const items = createMemo(() =>
    settingsStore.get().app.fontDirs.map((dir) => ({
      id: dir.hashCode?.() || dir.length,
      text: dir,
      item: DirectoryListItem,
    }))
  );

  const switchItems = createMemo(() =>
    settingsStore.get().app.commandSwitches.map((item, index) => ({
      id: index,
      text: item.switch,
      itemArgs: { item },
      item: SwitchListItem,
    }))
  );

  const onChangeExportPath = async () => {
    const directory = await api.selectExportDirectory();
    if (!directory) return;
    settingsStore.update((s) => {
      s.app.exportDir = directory;
    });
  };

  const onItemRemoveClick = (item: { id: number | string }) => {
    settingsStore.update((s) => {
      s.app.fontDirs = s.app.fontDirs.filter((dir) => (dir.hashCode?.() || dir.length) !== item.id);
    });
  };

  const onSwitchItemRemoveClick = (item: { id: number | string }) => {
    settingsStore.update((s) => {
      s.app.commandSwitches = s.app.commandSwitches.filter((_, idx) => idx !== item.id);
    });
  };

  const onAddDirectory = async () => {
    const directory = await api.selectExportDirectory();
    if (!directory) return;
    settingsStore.update((s) => {
      s.app.fontDirs.push(directory);
    });
  };

  const onAddSwitch = () => {
    settingsStore.update((s) => {
      s.app.commandSwitches.push({ switch: '', value: '' });
    });
  };

  const onClearList = () => {
    settingsStore.update((s) => {
      s.app.fontDirs = [];
    });
  };

  const onClearSwitchList = () => {
    settingsStore.update((s) => {
      s.app.commandSwitches = [];
    });
  };

  const bodyHeight = createMemo(() => {
    const bounds = modalBoundsStore.get();
    return bounds ? bounds.height - 94 : 0;
  });

  const onScaleFigmaUIChange = (value: number) => {
    settingsStore.update((s) => {
      s.ui.scaleFigmaUI = value;
    });
    api.updateFigmaUiScale(value);
  };

  const onScalePanelChange = (value: number) => {
    settingsStore.update((s) => {
      s.ui.scalePanel = value;
      s.app.panelHeight = Math.floor(TOPPANELHEIGHT * value);
    });
    api.updatePanelScale(value);
  };

  return (
    <div class={styles.container} style={{ 'z-index': props.zIndex, height: `${bodyHeight()}px` }}>
      <Flex>
        <Flex direction="column" width="-webkit-fill-available">
          <Label>Scale UI</Label>
          <Range
            value={settingsStore.get().ui.scaleFigmaUI}
            min={0.5}
            max={1.5}
            step={0.05}
            onValueChange={onScaleFigmaUIChange}
          />
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Text padding="8px 0 0 0">
              {Math.floor(settingsStore.get().ui.scaleFigmaUI * 100)}%
            </Text>
          </Flex>
        </Flex>
        <Flex width="120px" />
        <Flex direction="column" width="-webkit-fill-available">
          <Label>Scale Tabs</Label>
          <Range
            value={settingsStore.get().ui.scalePanel}
            min={0.5}
            max={1.5}
            step={0.05}
            onValueChange={onScalePanelChange}
          />
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Text padding="8px 0 0 0">
              {Math.floor(settingsStore.get().ui.scalePanel * 100)}%
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex height="50px" />
      <Line />
      <Flex height="40px" />

      <Flex>
        <Flex direction="column" width="-webkit-fill-available">
          <Label>Main settings</Label>
          <CheckBox
            checked={settingsStore.get().app.saveLastOpenedTabs}
            text="Save the last opened tabs"
            onCheckedChange={(checked) =>
              settingsStore.update((s) => {
                s.app.saveLastOpenedTabs = checked;
              })
            }
          />
          <CheckBox
            checked={settingsStore.get().app.enableColorSpaceSrgb}
            text="Enable color space sRGB"
            onCheckedChange={(checked) =>
              settingsStore.update((s) => {
                s.app.enableColorSpaceSrgb = checked;
              })
            }
          />
          <CheckBox
            checked={settingsStore.get().app.visibleNewProjectBtn}
            text="Show new project button"
            onCheckedChange={(checked) =>
              settingsStore.update((s) => {
                s.app.visibleNewProjectBtn = checked;
              })
            }
          />
          <CheckBox
            checked={settingsStore.get().app.useZenity}
            text="Use Zenity for Dialogs"
            onCheckedChange={(checked) =>
              settingsStore.update((s) => {
                s.app.useZenity = checked;
              })
            }
          />
          <CheckBox
            checked={settingsStore.get().app.useOldPreviewer}
            text="Use old Previewer in ThemeCreator"
            onCheckedChange={(checked) =>
              settingsStore.update((s) => {
                s.app.useOldPreviewer = checked;
              })
            }
          />
          <CheckBox
            checked={settingsStore.get().app.disableThemes}
            text="Disable themes"
            onCheckedChange={(checked) =>
              settingsStore.update((s) => {
                s.app.disableThemes = checked;
              })
            }
          />
        </Flex>
        <Flex width="120px" />
        <Flex direction="column" width="-webkit-fill-available">
          <Label>Export files to</Label>
          <Flex>
            <FlexItem grow={1}>
              <TextInput
                value={settingsStore.get().app.exportDir}
                onValueChange={(value) =>
                  settingsStore.update((s) => {
                    s.app.exportDir = value;
                  })
                }
              >
                <ButtonTool normalBgColor="transparent" onClick={onChangeExportPath}>
                  <Folder color="var(--text)" size="18" />
                </ButtonTool>
              </TextInput>
            </FlexItem>
            <Flex width="20px" />
            <SecondaryButton onClick={onChangeExportPath}>Change</SecondaryButton>
          </Flex>
        </Flex>
      </Flex>

      <Flex height="50px" />
      <Line />
      <Flex height="40px" />

      <Flex>
        <Flex direction="column" width="-webkit-fill-available">
          <Label>Font directories</Label>
          <List items={items() as any} onItemRemoveClick={onItemRemoveClick as any} height="160px" />
          <Flex height="10px" />
          <Flex>
            <FlexItem grow={1} />
            <SecondaryButton onClick={onClearList}>Clear list</SecondaryButton>
            <Flex width="10px" />
            <SecondaryButton onClick={onAddDirectory}>Add directory</SecondaryButton>
          </Flex>
        </Flex>
        <Flex width="120px" />
        <Flex direction="column" width="-webkit-fill-available">
          <Label>Chromium command line switches</Label>
          <List
            items={switchItems() as any}
            onItemRemoveClick={onSwitchItemRemoveClick as any}
            height="160px"
          />
          <Flex height="10px" />
          <Flex>
            <FlexItem grow={1} />
            <SecondaryButton onClick={onClearSwitchList}>Clear list</SecondaryButton>
            <Flex width="10px" />
            <SecondaryButton onClick={onAddSwitch}>Add Switch</SecondaryButton>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
