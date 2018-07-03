import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';


import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';

import reducers from './reducers';
import routes from './routes';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);



ReactDOM.render((
<Provider store={store} ><Router>
    {routes}
</Router></Provider>), document.getElementById('root'));

export default store;