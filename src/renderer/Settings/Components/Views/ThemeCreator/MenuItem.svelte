<script lang="ts">
  import { Text, Flex, Button } from "Common";

  interface MenuItemProps {
    text: string;
    disabled?: boolean;
    Icon?: ConstructorOfATypedSvelteComponent;
    onItemClick?: () => void;
    onItemRemoveClick?: () => void;
  }

  let {
    text,
    disabled = false,
    Icon = undefined,
    onItemClick = () => {},
    onItemRemoveClick = () => {},
  }: MenuItemProps = $props();

  let color = $derived(disabled ? "var(--text-disabled)" : "var(--fg-overlay)");
</script>

<Button {disabled} disabledBgColor="transparent" onClick={onItemClick}>
  <Flex alignItems="center" padding="6px 0" width="100%">
    <Flex width="14px" />
    {#if Icon}
      <Icon {color} />
      <Flex width="8px" />
    {/if}
    <Text size="var(--text-size-popup)" {color} {disabled}>{text}</Text>
    <Flex width="20px" />
  </Flex>
</Button>

<style>
</style>
