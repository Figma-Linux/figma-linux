export default (shortcutsMap: ShortcutsMap[], shortcutMan: any) => {
  console.log("shortcutsMap: ", typeof shortcutsMap);
  for (const shortcut of shortcutsMap) {
    if (shortcut.accelerator === "") continue;

    switch (shortcut.type) {
      case "action":
        {
          shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
            console.log("Action: ", shortcut);
            if (shortcut.value === "save-as") return;
          });
        }
        break;

      default: {
      }
    }
  }
};
