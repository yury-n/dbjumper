import { combineReducers } from 'redux';
import boardItem from './boardItem';

const boardItems = (state = [], action) => {
    switch (action.type) {
        case 'ADD_BOARD_ITEM':
            if (action.clearBoard) {
                return [boardItem(undefined, action)];
            }
            return [
                ...state,
                boardItem(undefined, action)
            ];
        default:
            return state;
    }
};

const board = combineReducers({
    boardItems
});

export default board;

export const getBoardItems = (state) => state.boardItems;
export const getBoardItem = (state, id) => state.boardItems.find(item => item.id === id);