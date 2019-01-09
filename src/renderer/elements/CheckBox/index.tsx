import * as React from "react";

import './index.scss';

export interface CheckBoxProps {
	onChane(event: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLElement>): void;
	text?: string; // text for label
	s?: string; // custom style classes
}

export class CheckBox extends React.Component<CheckBoxProps, {}> {
	constructor(props: CheckBoxProps) {
		super(props);
	}

	render() {
		return <div className={`checkbox ${this.props.s ? this.props.s : ''}`}>
			<label>
				<input type="checkbox" name="" />
				<span>{this.props.text ? this.props.text : ''}</span>
			</label>
		</div>
	}
}