<script lang="ts">
  import { ButtonTool, Text, Close, Flex } from "Common";

  interface DirectoryListItemProps {
    text: string;
    disabled?: boolean;
    onItemClick?: () => void;
    onItemRemoveClick?: () => void;
  }

  let {
    text,
    disabled = false,
    onItemClick = () => {},
    onItemRemoveClick = () => {},
  }: DirectoryListItemProps = $props();
</script>

<div>
  <ButtonTool normalBgColor="tarsparent" onClick={onItemRemoveClick}>
    <Close color="var(--text)" size="16" />
  </ButtonTool>
  <Flex width="10px" />
  <Text onmouseup={onItemClick}>{text}</Text>
</div>

<style>
  div {
    display: flex;
    user-select: none;
    margin-bottom: 10px;
  }
</style>
