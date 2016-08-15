import { combineReducers } from 'redux';

const suggestions = (state = ['users', 'users_orders', 'users_items'], action) => {
    return state;
};

const pointerIndex = (state = 0, action) => {
    return state;
};

const suggestionList = combineReducers({
    suggestions,
    pointerIndex
});

export default suggestionList;