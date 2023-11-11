<script lang="ts">
  import { ButtonTool, Trash, Flex, FlexItem } from "Common";
  import { InputText } from "Common/Input";

  export let item: Types.CommandSwitch;

  export let onItemRemoveClick = () => {};
</script>

<div>
  <FlexItem grow={1}>
    <InputText bind:value={item.switch} />
  </FlexItem>
  <Flex width="20px" />
  <FlexItem grow={1}>
    <InputText bind:value={item.value} />
  </FlexItem>
  <Flex width="20px" />
  <ButtonTool normalBgColor="tarsparent" on:buttonClick={onItemRemoveClick}>
    <Trash color="var(--text)" size="16" />
  </ButtonTool>
  <Flex width="20px" />
</div>

<style>
  div {
    display: flex;
    user-select: none;
    margin-bottom: 10px;
  }
</style>
