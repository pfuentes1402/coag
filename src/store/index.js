import { createStore } from 'redux';
import { dummy } from  './../reducers/dummy';
const initialState = {
    dummy:'Initial Dummy value'
};

export const store = createStore(dummy,initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());