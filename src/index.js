import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { history } from './helpers/hidtory';

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import './index.css';
import App from './App';
//import { BrowserRouter as Router } from 'react-router-dom';
import { Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import reducers from './reducers';
import routes from './routes';


import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/lib/integration/react';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
 };
 const pReducer = persistReducer(persistConfig, reducers);


const store = createStore(
  pReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

const persistor  = persistStore(store);


ReactDOM.render((
<Provider store={store} >
<PersistGate loading={null} persistor={persistor}>
<Router history={history}>
    {routes}
</Router>
 </PersistGate>
</Provider>), document.getElementById('root'));

export default persistor;
