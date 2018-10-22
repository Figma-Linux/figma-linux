import * as React from 'react';

interface Props {
    tabs: ITabsStore;

    close(e: React.MouseEvent<HTMLDivElement>, id: number): void
    clickTab(e: React.MouseEvent<HTMLDivElement>, tab: Tab): void
}

const Tabs: React.SFC<Props> = (props) => {
    return (
        <div className="tabBar gritArea-b">
            {props.tabs.tabs.map((t: Tab, i) => (
                t.moves
                ? [
                    <div className={`fakeTab order${t.order}`}>
                        <span>{t.title}</span>
                    </div>,
                    <div key={i}
                        className={`tab ${props.tabs.current === t.id ? 'active' : ''} order${t.order}`}
                        onMouseDown={e => props.clickTab(e, t)}
                    >
                        <span>{t.title}</span>
                        <div className="tabClose" onClick={(e) => props.close(e, t.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21.9 21.9" enableBackground="new 0 0 21.9 21.9" width="8px" height="8px">
                                <path d="M14.1,11.3c-0.2-0.2-0.2-0.5,0-0.7l7.5-7.5c0.2-0.2,0.3-0.5,0.3-0.7s-0.1-0.5-0.3-0.7l-1.4-1.4C20,0.1,19.7,0,19.5,0  c-0.3,0-0.5,0.1-0.7,0.3l-7.5,7.5c-0.2,0.2-0.5,0.2-0.7,0L3.1,0.3C2.9,0.1,2.6,0,2.4,0S1.9,0.1,1.7,0.3L0.3,1.7C0.1,1.9,0,2.2,0,2.4  s0.1,0.5,0.3,0.7l7.5,7.5c0.2,0.2,0.2,0.5,0,0.7l-7.5,7.5C0.1,19,0,19.3,0,19.5s0.1,0.5,0.3,0.7l1.4,1.4c0.2,0.2,0.5,0.3,0.7,0.3  s0.5-0.1,0.7-0.3l7.5-7.5c0.2-0.2,0.5-0.2,0.7,0l7.5,7.5c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l1.4-1.4c0.2-0.2,0.3-0.5,0.3-0.7  s-0.1-0.5-0.3-0.7L14.1,11.3z" fill="#FFFFFF"/>
                            </svg>
                        </div>
                    </div>
                ] : [
                    <div key={i}
                        className={`tab ${props.tabs.current === t.id ? 'active' : ''} order${t.order}`}
                        onMouseDown={e => props.clickTab(e, t)}
                    >
                        <span>{t.title}</span>
                        <div className="tabClose" onClick={(e) => props.close(e, t.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21.9 21.9" enableBackground="new 0 0 21.9 21.9" width="8px" height="8px">
                                <path d="M14.1,11.3c-0.2-0.2-0.2-0.5,0-0.7l7.5-7.5c0.2-0.2,0.3-0.5,0.3-0.7s-0.1-0.5-0.3-0.7l-1.4-1.4C20,0.1,19.7,0,19.5,0  c-0.3,0-0.5,0.1-0.7,0.3l-7.5,7.5c-0.2,0.2-0.5,0.2-0.7,0L3.1,0.3C2.9,0.1,2.6,0,2.4,0S1.9,0.1,1.7,0.3L0.3,1.7C0.1,1.9,0,2.2,0,2.4  s0.1,0.5,0.3,0.7l7.5,7.5c0.2,0.2,0.2,0.5,0,0.7l-7.5,7.5C0.1,19,0,19.3,0,19.5s0.1,0.5,0.3,0.7l1.4,1.4c0.2,0.2,0.5,0.3,0.7,0.3  s0.5-0.1,0.7-0.3l7.5-7.5c0.2-0.2,0.5-0.2,0.7,0l7.5,7.5c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l1.4-1.4c0.2-0.2,0.3-0.5,0.3-0.7  s-0.1-0.5-0.3-0.7L14.1,11.3z" fill="#FFFFFF"/>
                            </svg>
                        </div>
                    </div>
                ]
            ))}
        </div>
    )
}

export default Tabs;