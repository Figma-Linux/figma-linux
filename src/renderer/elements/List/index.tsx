import * as React from "react";

import "./index.scss";

export interface ListProps {
  onRemove?(index: number): void;
  className?: string;
  style?: React.CSSProperties;
  children: JSX.Element | JSX.Element[];
  grabToScroll?: boolean;
}

export class List extends React.Component<ListProps, unknown> {
  private area: React.RefObject<HTMLDivElement>;
  private pos = { top: 0, left: 0, x: 0, y: 0 };
  private isMoving = false;

  constructor(props: ListProps) {
    super(props);

    this.area = React.createRef();
  }

  private mouseUpHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.area.current.style.cursor = "grab";
    this.isMoving = false;
  };
  private mouseDownHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.area.current.style.cursor = "grabbing";
    this.isMoving = true;

    this.pos = {
      left: this.area.current.scrollLeft,
      top: this.area.current.scrollTop,
      x: e.clientX,
      y: e.clientY,
    };
  };
  private mouseMoveHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!this.isMoving) {
      return;
    }

    const dx = e.clientX - this.pos.x;
    const dy = e.clientY - this.pos.y;

    this.area.current.scrollTop = this.pos.top - dy;
    this.area.current.scrollLeft = this.pos.left - dx;
  };

  render(): JSX.Element {
    const classNames: string[] = ["list"];
    const isDraggable = this.props.grabToScroll;

    if (this.props.className) {
      classNames.push(this.props.className);
    }
    if (isDraggable) {
      classNames.push("list_grab");
    }

    return isDraggable ? (
      <div
        ref={this.area as any}
        className={classNames.join(" ")}
        style={this.props.style}
        onMouseDown={this.mouseDownHandler}
        onMouseMove={this.mouseMoveHandler}
        onMouseUp={this.mouseUpHandler}
        onMouseLeave={this.mouseUpHandler}
      >
        {this.props.children}
      </div>
    ) : (
      <div className={classNames.join(" ")} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
