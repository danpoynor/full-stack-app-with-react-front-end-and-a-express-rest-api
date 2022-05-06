import React, { createContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import { Provider } from './Context';
import './index.css';

const Context = createContext({});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {
      /*
      NOTE: <BrowserRouter> needs to wrap <Provider> because Context.js imports
      the useUserAPI.js custom hook which uses useNavigate() and that hook can
      only be used only in the context of a <Router> component.
      */
    }
    <BrowserRouter>
      <Provider value={Context}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
