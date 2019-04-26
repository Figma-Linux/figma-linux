declare namespace Fonts {
	interface IFontsFigmaItem {
		postscript: string;
		family: string;
		id: string;
		style?: string;
		weight?: number;
		stretch?: number;
		italic?: boolean;
	}

	interface IFonts {
		[path: string]: Array<IFontsFigmaItem>
	}
}
