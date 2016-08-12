import { combineReducers } from 'redux';
import boardItem from './boardItem';

const boardItems = (state = [], action) => {
    switch (action.type) {
        case 'ADD_BOARD_ITEM':
            return [
                ...state,
                boardItem(undefined, action)
            ];
        case 'CLEAR_BOARD':
            return [];
        default:
            return state;
    }
};

const board = combineReducers({
    boardItems
});

export default board;

export const getBoardItems = (state) => state.boardItems;