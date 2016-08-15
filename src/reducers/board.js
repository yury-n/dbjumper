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
        case 'REMOVE_BOARD_ITEM':
            const removeIndex = state.findIndex(item => item.id === action.id);
            return [
                ...state.slice(0, removeIndex),
                ...state.slice(removeIndex + 1, state.length)
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