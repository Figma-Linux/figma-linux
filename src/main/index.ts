import App from "./App";
import Session from "./Session";
import FontManager from "./Fonts";
import ThemeManager from "./Ui/ThemeManager";
import ThemeValidator from "./Ui/ThemeManager/ThemeValidator";
import WindowManager from "./Ui/WindowManager";
import { logger } from "./Logger";

// Catch unhandling unexpected exceptions
process.on("uncaughtException", (error: Error) => {
  logger.error(`uncaughtException: `, error);
});

// Catch unhandling rejected promises
process.on("unhandledRejection", (reason: Error) => {
  logger.error(`unhandledRejection: `, reason);
});

new App(
  new WindowManager(),
  new Session(),
  new FontManager(),
  new ThemeManager(new ThemeValidator()),
);
