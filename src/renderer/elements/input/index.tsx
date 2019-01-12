import * as React from "react";

import './index.scss';

export enum InputTypes {
	SIMPLE = 'simple',
	NUMBER = 'number',
}

export interface InputProps {
	onChange(event: React.MouseEvent<any> | React.ChangeEvent<any>, delta: number): void;
	type?: InputTypes;
	value?: string | number;
	readonlyInput?: boolean;
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
					<div className="button minus" onClick={(e) => this.props.onChange(e, +this.props.value - 5)}>-</div>
					<div className="body">
						<input readOnly={this.props.readonlyInput ? true : false} type="text" value={this.props.value ? this.props.value : ''} onChange={(e) => this.props.onChange(e, +e.target.value)} />
						<span className="sufix">{this.props.sufix || '%'}</span>
					</div>
					<div className="button plus" onClick={(e) => this.props.onChange(e, +this.props.value + 5)}>+</div>
				</React.Fragment>
			) : (
					<div className="body">
						<input readOnly={this.props.readonlyInput ? true : false} type="text" value={this.props.value ? this.props.value : ''} onChange={(e) => this.props.onChange(e, +e.target.value)} />
					</div>
				)
			}
		</div>
	}
}