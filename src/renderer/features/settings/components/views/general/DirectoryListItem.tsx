import { ButtonTool } from 'Shared/components/ui/buttons';
import { Text } from 'Shared/components/ui/text';
import { Close } from 'Shared/components/icons';
import { Flex } from 'Shared/components/ui/containers';
import styles from './DirectoryListItem.module.css';

interface DirectoryListItemProps {
  text: string;
  disabled?: boolean;
  onItemClick?: () => void;
  onItemRemoveClick?: () => void;
}

export function DirectoryListItem(props: DirectoryListItemProps) {
  return (
    <div class={styles.container}>
      <ButtonTool normalBgColor="transparent" onClick={props.onItemRemoveClick}>
        <Close color="var(--text)" size="16" />
      </ButtonTool>
      <Flex width="10px" />
      <Text onMouseUp={props.onItemClick}>{props.text}</Text>
    </div>
  );
}
