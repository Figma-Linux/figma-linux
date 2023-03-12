<script lang="ts">
  import { Text, Flex, Pencil, Button } from "Common";

  export let text: string;
  export let Icon: ConstructorOfATypedSvelteComponent;
</script>

<Button>
  <Flex alignItems="center" padding="6px 0" width="-webkit-fill-available">
    <Flex width="14px" />
    <Icon />
    <Flex width="8px" />
    <Text size="var(--text-size-popup)">{text}</Text>
    <Flex width="20px" />
  </Flex>
</Button>

<style>
</style>
