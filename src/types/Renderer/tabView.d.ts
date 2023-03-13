declare namespace Types {
  interface TabItem {
    id: string;
    text: string;
    disabled?: boolean;
    itemArgs?: Types.Dic<unknown>;
    item: ConstructorOfATypedSvelteComponent;
  }

  interface SetingsTabItem extends TabItem {
    bodyComponent: ConstructorOfATypedSvelteComponent;
    headerComponent?: ConstructorOfATypedSvelteComponent;
  }

  interface ThemeCreatorPopupMenuItem extends TabItem {
    handler: () => void;
  }
}
