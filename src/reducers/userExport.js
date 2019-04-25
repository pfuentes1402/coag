import { createStore } from 'redux';
import reducer from './user/user';

const store = createStore(reducer);

export default store;