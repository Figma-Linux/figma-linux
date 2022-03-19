import * as React from "react";

import "./index.css";
import { Icon } from "Elements";

interface GeneralBodyProps {
  items: string[];

  onRemove?(index: number): void;
}

const ListItems: React.FunctionComponent<GeneralBodyProps> = props => {
  return (
    <React.Fragment>
      {props.items.map((item, i) => (
        <div key={i} className="list__item">
          {props.onRemove ? (
            <div className="list__delete hover" onClick={() => props.onRemove(i)}>
              <Icon color="var(--text)" type="Close" />
            </div>
          ) : (
            ""
          )}
          <span>{item}</span>
        </div>
      ))}
    </React.Fragment>
  );
};

export default ListItems;
