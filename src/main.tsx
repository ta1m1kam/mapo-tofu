import { render } from 'solid-js/web';
import 'virtual:uno.css';
import './styles.css';
import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('root not found');

render(() => <App />, root);
