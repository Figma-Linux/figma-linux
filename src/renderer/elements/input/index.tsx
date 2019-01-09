import * as React from "react";

import './index.scss';

export enum InputTypes {
	SIMPLE = 'simple',
	NUMBER = 'number',
}

export interface InputProps {
	onChane(event: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLElement>, delta: number): void;
	type?: InputTypes;
	sufix?: string;
}

export class Input extends React.Component<InputProps, {}> {
	constructor(props: InputProps) {
		super(props);
	}

	render() {
		return <div className={`input ${this.props.type ? this.props.type : InputTypes.SIMPLE}`}>
			{this.props.type === InputTypes.NUMBER ? (
				<React.Fragment>
					<div className="button minus" onClick={(e) => this.props.onChane(e, -5)}>-</div>
					<div className="body">
						<input type="text" onChange={(e) => this.props.onChane(e, 0)} />
						<span className="sufix">{this.props.sufix || '%'}</span>
					</div>
					<div className="button plus" onClick={(e) => this.props.onChane(e, 5)}>+</div>
				</React.Fragment>
			) : (
					<div className="body">
						<input type="text" onChange={(e) => this.props.onChane(e, 0)} />
					</div>
				)
			}
		</div>
	}
}