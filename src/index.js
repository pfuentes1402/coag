import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider,createMuiTheme } from '@material-ui/core/styles';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {blue, pink, grey} from '@material-ui/core/colors';

import './index.css';
import { BrowserRouter} from 'react-router-dom';
import "../node_modules/uppy/dist/uppy.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import reducers from './reducers';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {LocalizeProvider} from 'react-localize-redux';
import App from "./App";

library.add(faSearch);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
 };
 const pReducer = persistReducer(persistConfig, reducers);


export const store = createStore(
  pReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

const persistor  = persistStore(store);

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: grey,
    },
});

ReactDOM.render((
    <Provider store={store} >
        <MuiThemeProvider theme={theme}>
            <LocalizeProvider store={store} >
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </PersistGate>
            </LocalizeProvider>
        </MuiThemeProvider>
    </Provider>), document.getElementById('root'));

export default persistor;

