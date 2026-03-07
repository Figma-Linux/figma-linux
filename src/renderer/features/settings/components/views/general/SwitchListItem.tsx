import { createSignal } from 'solid-js';
import { ButtonTool } from 'Shared/components/ui/buttons';
import { Trash } from 'Shared/components/icons';
import { Flex, FlexItem } from 'Shared/components/ui/containers';
import { TextInput } from 'Shared/components/ui/inputs';
import styles from './SwitchListItem.module.css';

interface SwitchListItemProps {
  text?: string;
  item: Types.CommandSwitch;
  disabled?: boolean;
  onItemClick?: () => void;
  onItemRemoveClick?: () => void;
}

export function SwitchListItem(props: SwitchListItemProps) {
  const [switchValue, setSwitchValue] = createSignal(props.item.switch ?? '');
  const [valueValue, setValueValue] = createSignal(props.item.value ?? '');

  const onSwitchChange = (value: string) => {
    setSwitchValue(value);
    props.item.switch = value;
  };

  const onValueChange = (value: string) => {
    setValueValue(value);
    props.item.value = value;
  };

  return (
    <div class={styles.container}>
      <FlexItem grow={1}>
        <TextInput value={switchValue()} onValueChange={onSwitchChange} />
      </FlexItem>
      <Flex width="20px" />
      <FlexItem grow={1}>
        <TextInput value={valueValue()} onValueChange={onValueChange} />
      </FlexItem>
      <Flex width="20px" />
      <ButtonTool normalBgColor="transparent" onClick={props.onItemRemoveClick}>
        <Trash color="var(--text)" size="16" />
      </ButtonTool>
      <Flex width="20px" />
    </div>
  );
}
