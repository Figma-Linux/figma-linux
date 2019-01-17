import * as React from "react";
import Tabs from "Components/Tabs";

interface TopPanelProps {
    current: number;
    scalePanel: number;

    onMainTab(e: React.MouseEvent<HTMLDivElement>): void;
    onHomeClick(e: React.MouseEvent<HTMLDivElement>): void;
    getTab(id: Number): Tab | undefined;
    newTab(): void;
}

const TopPanel: React.SFC<TopPanelProps> = (props) => {
    const currentTab: Tab | undefined = props.getTab(props.current);

    return (
        <div className="panel" style={{zoom: props.scalePanel ? props.scalePanel : 1}}>
            <div className="panelButtons gridArea-a">
                <div className={`button main ${props.current === 1 ? 'active' : ''}`} onClick={props.onMainTab}>
                    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 1H1v6h6V1zM6 2H2v4h4V2zm9-1H9v6h6V1zm-1 1h-4v4h4V2zm1 7H9v6h6V9zm-1 1h-4v4h4v-4zM7 9H1v6h6V9zm-1 1H2v4h4v-4z" fillRule="evenodd" fill="#fff"></path>
                    </svg>
                </div>
                {(!currentTab) || (!!currentTab && currentTab.showBackBtn) ?
                    <div className="button home" onClick={props.onHomeClick}>
                        <svg x="0px" y="0px" viewBox="0 0 489 489" width="16px" height="16px">
                            <g>
                                <path d="M429.4,255.033c-35.4-43.1-102.1-94.4-219.7-98.8v-79.8c0-4.7-2.7-9.1-7-11.1s-9.4-1.4-13,1.6L4.5,219.633   c-2.8,2.3-4.5,5.8-4.5,9.4c0,3.7,1.6,7.1,4.4,9.4l185.2,153.3c3.7,3,8.7,3.7,13,1.6c4.3-2,7-6.3,7-11.1v-79.5   c76.8,0.3,194.2,6,256.5,115.9c2.2,3.9,6.3,6.2,10.7,6.2c1,0,2.1-0.1,3.1-0.4c5.4-1.4,9.1-6.3,9.1-11.8   C489.1,371.533,473.4,308.633,429.4,255.033z M197.4,278.233L197.4,278.233c-3.3,0-6.4,1.3-8.7,3.6s-3.6,5.4-3.6,8.7v65.7   l-153.5-127.1l153.6-126.7v65.7c0,6.7,5.4,12.2,12.1,12.3c176,1.7,241.6,109,260.7,184.4   C382.2,278.333,268.7,278.233,197.4,278.233z"
                                    fill="#FFFFFF" />
                            </g>
                        </svg>
                    </div> : null
                }
                <div className="button newTab" onClick={props.newTab}>
                    <svg className="svg" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 6.5v1h4v4h1v-4h4v-1h-4v-4h-1v4h-4z" fill="#fff"></path>
                    </svg>
                </div>
            </div>
            <Tabs/>
        </div>
    )
}

export default TopPanel;