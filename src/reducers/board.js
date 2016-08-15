import { combineReducers } from 'redux';
import boardItem from './boardItem';

const boardItems = (state = [], action) => {

    let boardItemIndex;
    const findBoardItemIndex = (id) => state.findIndex(item => item.id === id);

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
            boardItemIndex = findBoardItemIndex(action.id);
            return [
                ...state.slice(0, boardItemIndex),
                ...state.slice(boardItemIndex + 1, state.length)
            ];
        case 'CHANGE_QUERY_INPUT':
            boardItemIndex = findBoardItemIndex(action.boardItemId);
            let nextState = [...state];
            nextState[boardItemIndex] = boardItem(state[boardItemIndex], action);
            return nextState;
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