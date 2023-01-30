<script lang="ts">
  import { ipcRenderer } from "electron";
  import { onMount } from "svelte";

  onMount(() => {
    console.log("onMount");
    console.log("E.ipcRenderer: ", ipcRenderer);
  });

  export const name = "ElectronJS";
</script>

<p>Hello '{name}'!</p>
