import * as React from "react";

import './index.scss';

export interface InputProps {
	onChane(event: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLElement>): void;
	sufix?: string;
}

export class Input extends React.Component<InputProps, {}> {
	constructor(props: InputProps) {
		super(props);
	}

	render() {
		return <div className="input">
			<div className="button minus" onClick={this.props.onChane}>-</div>
			<div className="body">
				<input type="text" onChange={this.props.onChane} />
				<span className="sufix">{this.props.sufix || '%'}</span>
			</div>
			<div className="button plus" onClick={this.props.onChane}>+</div>
		</div>
	}
}