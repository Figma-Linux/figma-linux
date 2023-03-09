<script lang="ts">
  import { ButtonTool, Text, Close, Flex } from "Common";

  export let text: string;

  export let onItemClick = () => {};
  export let onItemRemoveClick = () => {};
</script>

<div>
  <ButtonTool normalBgColor="tarsparent" on:mouseup={onItemRemoveClick}>
    <Close color="var(--text)" size="16" />
  </ButtonTool>
  <Flex width="10px" />
  <Text on:mouseup={onItemClick}>{text}</Text>
</div>

<style>
  div {
    display: flex;
    user-select: none;
    margin-bottom: 10px;
  }
</style>
