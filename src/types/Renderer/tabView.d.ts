declare namespace Types {
  interface TabItem {
    id: string;
    text: string;
    itemArgs?: Types.Dic<string>;
    item: ConstructorOfATypedSvelteComponent;
  }

  interface SetingsTabItem extends TabItem {
    bodyComponent: ConstructorOfATypedSvelteComponent;
    headerComponent?: ConstructorOfATypedSvelteComponent;
  }
}
