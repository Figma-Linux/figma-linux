export const DEFAULT_SETTINGS = {
	app: {
		panelHeight: 28,
		showMainMenu: false,
		windowFrame: false,
		exportDir: `${process.env.HOME}/Pictures/Figma`,
		fontDirs: [
			'/usr/share/fonts',
			`${process.env.HOME}/.local/share/fonts`
		]
	},
	ui: {
		scalePanel: 1,
		scaleFigmaUI: 1
	}
}