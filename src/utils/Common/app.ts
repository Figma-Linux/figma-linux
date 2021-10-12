import * as E from "electron";

export const app = E.remote ? E.remote.app : E.app;
