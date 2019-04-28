import * as Settings from 'electron-settings';

let binding: any = null;
if (!Boolean(Settings.get('app.disabledFonts'))) {
	binding = require('./binding.node');
}

class Fonts {
	public static getFonts = (dirs: Array<string>): Promise<Fonts.IFonts> => new Promise((resolve, reject) => {
		if (binding) {
			console.info('local fonts support is enabled');
			binding.getFonts(dirs, (err: Error, fonts: Fonts.IFonts) => {
				if (err) reject(err);

				resolve(fonts);
			});
		} else {
			console.info('local fonts support is disabled');
			reject(new Error('The Native module is disabled in the app settings'));
		}
	});
}

export default Fonts;