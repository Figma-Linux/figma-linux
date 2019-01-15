import * as React from "react";
import { observer, inject } from "mobx-react";

import "./index.scss";
import { Input, Area, CheckBox } from 'Elements';
import { InputTypes } from "Elements/input";
import { Settings } from 'Store/Settings';

interface GeneralBodyProps {
	settings?: Settings
}

const GeneralBody: React.SFC<GeneralBodyProps> = props => {
	return (
		<div className="general">
			<h2>General Settings</h2>
			<div className="grid_1x2 grid_cgap5per">
				<div>
					<div className="section grid_1x2">
						<div>
							<p>Scale UI</p>
							<Input
								readonlyInput
								value={Math.round(props.settings.settings.ui.scaleFigmaUI * 100)}
								type={InputTypes.NUMBER}
								onChange={(e, d) => props.settings.updateFigmaUiScale(d)}
							/>
						</div>
						<div>
							<p>Scale Tab Panel</p>
							<Input
								readonlyInput
								value={Math.round(props.settings.settings.ui.scalePanel * 100)}
								type={InputTypes.NUMBER}
								onChange={(e, d) => props.settings.updatePanelScale(d)}
							/>
						</div>
					</div>
					<div className="section">
						<p>Auto hide the Main menu (toggle by Alt key)</p>
						<CheckBox
							value={props.settings.settings.app.showMainMenu}
							onChange={props.settings.updateShowMainMenu}
						/>
					</div>
					<div className="section hidden">
						<p>Window frame</p>
						<CheckBox
							disabled
							title="Doesn't work now. Need rewrite this feature."
							value={props.settings.settings.app.windowFrame}
							onChange={props.settings.updateWindowFrame}
						/>
					</div>
				</div>
				<div>
					<div className="section">
						<p>Default export directory</p>
						<div className="selectFolder">
							<Input
								value={props.settings.settings.app.exportDir}
								type={InputTypes.SIMPLE}
								onChange={(e) => props.settings.inputExportDir(e.target.value)}
							/>
							<div className="button" onClick={(e) => props.settings.selectExportDir()}>
								<svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect width="14.375" height="16.1905" rx="2" fill="#828282" />
									<rect y="2.85712" width="23" height="17.1429" rx="2" fill="#333333" />
								</svg>
							</div>
						</div>
					</div>
					<div className="section grid_2x1">
						<p className="gridArea-a">Font directories</p>
						<div className="add gridArea-b" onClick={() => props.settings.addDir()}>
							<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M9.99834 7.58161C9.84089 7.58161 9.72279 7.46253 9.72279 7.30375L9.72279 1.3496C9.72279 1.19083 9.64407 1.03205 9.56534 0.952661C9.48661 0.873272 9.32916 0.793883 9.1717 0.793883L8.06953 0.793883C7.91207 0.793883 7.75462 0.873272 7.67589 0.95266C7.5578 1.07174 7.51844 1.19083 7.51844 1.3496L7.51844 7.30375C7.51844 7.46253 7.40035 7.58161 7.24289 7.58161L1.33836 7.58161C1.18091 7.58161 1.02345 7.661 0.944725 7.74039C0.865998 7.81978 0.787271 7.97856 0.787271 8.13733V9.24877C0.787271 9.40755 0.865998 9.56633 0.944725 9.64572C1.02345 9.72511 1.18091 9.8045 1.33836 9.8045L7.24289 9.8045C7.40035 9.8045 7.51844 9.92358 7.51844 10.0824L7.51844 16.0365C7.51844 16.1953 7.59716 16.3541 7.67589 16.4334C7.75462 16.5128 7.91207 16.5922 8.06953 16.5922L9.1717 16.5922C9.32916 16.5922 9.48661 16.5128 9.56534 16.4334C9.64407 16.3541 9.72279 16.1953 9.72279 16.0365L9.72279 10.0824C9.72279 9.92358 9.84089 9.8045 9.99834 9.8045L15.9029 9.8045C16.0603 9.8045 16.2178 9.72511 16.2965 9.64572C16.3752 9.56633 16.454 9.40755 16.454 9.24877V8.13733C16.454 7.97856 16.3752 7.81978 16.2965 7.74039C16.2178 7.661 16.0603 7.58161 15.9029 7.58161L9.99834 7.58161Z" fill="#BDBDBD" />
							</svg>
						</div>
						<Area
							c="gridArea-c"
							items={props.settings.settings.app.fontDirs}
							onRemove={props.settings.removeDir}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default inject('settings')(observer(GeneralBody));