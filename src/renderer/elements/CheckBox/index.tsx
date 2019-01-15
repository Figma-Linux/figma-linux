import * as React from "react";

import './index.scss';

export interface CheckBoxProps {
	onChange(checked: boolean): void;
	text?: string; // text for label
	value?: boolean;
	disabled?: boolean;
	title?: string;
	s?: string; // custom style classes
}

export class CheckBox extends React.Component<CheckBoxProps, {}> {
	constructor(props: CheckBoxProps) {
		super(props);
	}

	render() {
		return <div className={`checkbox ${this.props.s ? this.props.s : ''} ${this.props.disabled ? 'disabled' : ''}`}>
			<label>
				<input
					type="checkbox"
					name=""
					disabled={this.props.disabled ? true : false}
					checked={this.props.value ? true : false}
					onChange={(e) => this.props.onChange(!this.props.value)}
				/>
				<span title={`${this.props.title ? this.props.title : ''}`}>{this.props.text ? this.props.text : ''}</span>
			</label>
		</div>
	}
}