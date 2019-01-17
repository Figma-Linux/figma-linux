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
	public static getFonts = (dirs: Array<string>): Promise<IFonts> => new Promise((resolve, reject) => {
		binding.getFonts(dirs, (err: Error, fonts: IFonts) => {
			if (err) reject(err);

			resolve(fonts);
		});
	});
}

export default Fonts;