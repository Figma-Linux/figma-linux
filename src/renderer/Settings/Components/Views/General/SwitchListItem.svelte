<script lang="ts">
  import { ButtonTool, Trash, Flex, FlexItem } from "Common";
  import { InputText } from "Common/Input";

  interface SwitchListItemProps {
    text?: string;
    item: Types.CommandSwitch;
    disabled?: boolean;
    onItemClick?: () => void;
    onItemRemoveClick?: () => void;
  }

  let {
    text,
    item,
    disabled = false,
    onItemClick = () => {},
    onItemRemoveClick = () => {},
  }: SwitchListItemProps = $props();

  // Use local reactive state initialized from item
  let switchValue = $state(item.switch ?? "");
  let valueValue = $state(item.value ?? "");

  // Update item when input changes
  function onSwitchChange(value: string) {
    item.switch = value;
  }

  function onValueChange(value: string) {
    item.value = value;
  }
</script>

<div>
  <FlexItem grow={1}>
    <InputText bind:value={switchValue} onchange={onSwitchChange} />
  </FlexItem>
  <Flex width="20px" />
  <FlexItem grow={1}>
    <InputText bind:value={valueValue} onchange={onValueChange} />
  </FlexItem>
  <Flex width="20px" />
  <ButtonTool normalBgColor="tarsparent" onClick={onItemRemoveClick}>
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
