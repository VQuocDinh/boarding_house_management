import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './App/store';
import { SnackbarProvider } from 'notistack';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import history from './App/history';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <HistoryRouter history={history}>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </HistoryRouter>
  </Provider> 
);
