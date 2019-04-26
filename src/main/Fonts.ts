const binding = require('./binding.node');

class Fonts {
	public static getFonts = (dirs: Array<string>): Promise<Fonts.IFonts> => new Promise((resolve, reject) => {
		binding.getFonts(dirs, (err: Error, fonts: Fonts.IFonts) => {
			if (err) reject(err);

			resolve(fonts);
		});
	});
}

export default Fonts;