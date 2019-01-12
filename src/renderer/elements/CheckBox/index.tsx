import * as React from "react";

import './index.scss';

export interface CheckBoxProps {
	onChange(checked: boolean): void;
	text?: string; // text for label
	value?: boolean;
	s?: string; // custom style classes
}

export class CheckBox extends React.Component<CheckBoxProps, {}> {
	constructor(props: CheckBoxProps) {
		super(props);
	}

	render() {
		return <div className={`checkbox ${this.props.s ? this.props.s : ''}`}>
			<label>
				<input type="checkbox" name="" checked={this.props.value ? true : false} onChange={(e) => this.props.onChange(!this.props.value)}/>
				<span>{this.props.text ? this.props.text : ''}</span>
			</label>
		</div>
	}
}