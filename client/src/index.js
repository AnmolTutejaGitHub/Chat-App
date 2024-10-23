import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App/App';
import { Provider } from './Context/UserContext';
import './index.css';


const ele = document.getElementById('root');
const root = ReactDOM.createRoot(ele);

root.render(
    <Provider>
        <App />
    </Provider>
);