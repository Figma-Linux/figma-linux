export const DEFAULT_SETTINGS = {
	app: {
		showMainMenu: true,
		windowFrame: true,
		exportDir: `${process.env.HOME}/Pictures/Figma`,
		fontDirs: [
			'/usr/share/fonts',
			`${process.env.HOME}/.local/share/fonts`
		]
	},
	ui: {
		scalePanel: 100,
		scaleFigmaUI: 100
	}
}