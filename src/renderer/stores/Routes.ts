import { RouterState, RouterStore } from "mobx-state-router";

const routes = [
  {
    name: "general",
    pattern: "/",
  },
  {
    name: "shortcuts",
    pattern: "/shortcuts",
  },
];

class Routes {
  route: RouterStore;

  constructor() {
    this.route = new RouterStore(this, routes, new RouterState("general"));
  }
}

const routeStore = new Routes();

export default routeStore;
export { Routes };
