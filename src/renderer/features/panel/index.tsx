import { render } from 'solid-js/web';
import { Panel } from './Panel';

// Global styles
const globalStyles = document.createElement('style');
globalStyles.textContent = `
  html, body {
    margin: 0;
    padding: 0;
    border: none;

    --text-size-tab: 14px;
    --text-size-tab-view: 14px;
    --text-size-popup: 14px;

    font-family: "Inter", sans-serif;
    font-size: var(--fontSize);
    font-weight: 400;
  }
`;
document.head.appendChild(globalStyles);

render(() => <Panel />, document.body);
