import { h } from 'preact';

import Tabs from "./../Tabs";

interface TopPanelProps {
    current: number;

    onMainTab(e: React.MouseEvent<HTMLDivElement> & Event): void;
}

function TopPanel(props: TopPanelProps) {
    return (
        <div className="panel">
            <div className="panelButton gridArea-a">
                <div className={`main ${props.current === 1 ? 'active' : ''}`} onClick={props.onMainTab}>
                    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 1H1v6h6V1zM6 2H2v4h4V2zm9-1H9v6h6V1zm-1 1h-4v4h4V2zm1 7H9v6h6V9zm-1 1h-4v4h4v-4zM7 9H1v6h6V9zm-1 1H2v4h4v-4z" fill-rule="evenodd" fill="#fff"></path>
                    </svg>
                </div>
            </div>
            <Tabs/>
        </div>
    )
}

export default TopPanel;