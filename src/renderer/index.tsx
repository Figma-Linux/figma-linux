import { render } from 'react-dom';
import { h } from 'preact';
const { Provider } = require('mobx-preact');
import stores from "./stores";

import App from "./components";
import { isDev } from "./util";

// onError(err => {
// 	console.log('Mobx error: ', err);
// });
let root: string = isDev ? 'app' : 'react-page';

render(
	<Provider { ...stores } >
		<App />
	</Provider>,
	document.getElementById(root)
)