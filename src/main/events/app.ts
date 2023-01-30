import { app } from "electron";

import { handleCommandItemClick } from "Utils/Main";

app.on("handle-page-command", (item, window) => handleCommandItemClick(item, window));

app.on("log", (data) => {
  console.log("log: ", data);
});
