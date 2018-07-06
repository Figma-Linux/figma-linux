/// <reference path="../../../@types/common/index.d.ts" />
/// <reference path="../../../@types/renderer/stores/index.d.ts" />

import { observable } from "mobx";

class Tabs implements ITabsStore {
	@observable tabs: Array<Tab> = [];
}

const tabs: Tabs = new Tabs();

export default tabs;
export {
	tabs
}