import { h, FunctionalComponent } from "preact";

import Tabs from "./../Tabs";

interface Props {
    current: number;

    onMainTab(e: Event): void;
}

const TopPanel: FunctionalComponent<Props> = (props) => (
    <div className="panel">
        <div className="panelButton gridArea-a">
            <div className={`main ${props.current === 1 ? 'active' : ''}`} onClick={props.onMainTab}>
                <svg class="svg" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1H1v6h6V1zM6 2H2v4h4V2zm9-1H9v6h6V1zm-1 1h-4v4h4V2zm1 7H9v6h6V9zm-1 1h-4v4h4v-4zM7 9H1v6h6V9zm-1 1H2v4h4v-4z" fill-rule="evenodd" fill="#fff"></path>
                </svg>
            </div>
        </div>
        <Tabs/>
        {/* <div className="panelSettings gridArea-c">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <path fill="none" d="M0 0h20v20H0V0z"/>
                <path xmlns="http://www.w3.org/2000/svg" id="gear" style="fill-rule:evenodd;clip-rule:evenodd;" d="M20.869,13.476C20.948,12.994,21,12.504,21,12    s-0.052-0.994-0.131-1.476l-2.463-0.259c-0.149-0.556-0.367-1.082-0.648-1.57l1.558-1.924c-0.576-0.806-1.281-1.511-2.087-2.087    l-1.924,1.558c-0.488-0.281-1.015-0.499-1.57-0.648l-0.259-2.463C12.994,3.052,12.504,3,12,3s-0.994,0.052-1.476,0.131    l-0.259,2.463C9.71,5.743,9.184,5.961,8.695,6.242L6.771,4.685C5.966,5.261,5.261,5.966,4.685,6.771l1.558,1.924    c-0.281,0.488-0.499,1.015-0.648,1.57l-2.463,0.259C3.052,11.006,3,11.496,3,12s0.052,0.994,0.131,1.476l2.463,0.259    c0.149,0.556,0.367,1.082,0.648,1.57l-1.558,1.924c0.576,0.806,1.281,1.511,2.087,2.087l1.924-1.558    c0.488,0.281,1.015,0.499,1.57,0.648l0.259,2.463C11.006,20.948,11.496,21,12,21s0.994-0.052,1.476-0.131l0.259-2.463    c0.556-0.149,1.082-0.367,1.57-0.648l1.924,1.558c0.806-0.576,1.511-1.281,2.087-2.087l-1.558-1.924    c0.281-0.488,0.499-1.015,0.648-1.57L20.869,13.476z M12,15.998c-2.209,0-3.998-1.789-3.998-3.998S9.791,8.002,12,8.002    S15.998,9.791,15.998,12S14.209,15.998,12,15.998z" fill="#fff"/>
            </svg>
        </div> */}
    </div>
)

export default TopPanel;