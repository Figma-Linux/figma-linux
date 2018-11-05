const binding = require('./binding.node');

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

class Fonts {
	public static getFonts = (dirs: Array<string>): IFonts => {
		let fonts: IFonts = {};

		try {
			// FIXME: To make it as async
			fonts = binding.getFonts(dirs);

		} catch (error) {
			console.log('load fonts error: ', error);
		}

		return fonts;
	}
}

export default Fonts;