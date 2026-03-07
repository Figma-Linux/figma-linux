import { render } from 'solid-js/web';
import { Settings } from './Settings';

// Global styles
const globalStyles = document.createElement('style');
globalStyles.textContent = `
  body {
    background-color: rgba(0, 0, 0, 0.5);
    margin: 0;
    padding: 0;
    font-family: "Inter", sans-serif;
  }
`;
document.head.appendChild(globalStyles);

render(() => <Settings />, document.body);
