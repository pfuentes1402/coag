import {SET_DUMMY} from "./../actions";

export const dummy = (state={}, action) => {
    switch (action.type){
        case SET_DUMMY:
            return{ ...state, dummy: action.payload};
        default:
            return state;
    }
}