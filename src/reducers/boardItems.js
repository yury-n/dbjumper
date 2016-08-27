import {
    COLUMN_REMOVE,
    BOARD_ADD_ITEM,
    BOARD_REMOVE_ITEM,
    QUERY_INPUT_CHANGE,
    TABLE_DATA_FETCH_COMPLETED
} from '../actions';

import boardItem from './boardItem';

const boardItems = (state = [], action) => {

    let boardItemIndex;
    const findBoardItemIndex = (id) => state.findIndex(item => item.id === id);

    switch (action.type) {
        case BOARD_ADD_ITEM:
            if (action.clearBoard) {
                return [boardItem(undefined, action)];
            }
            return [
                ...state,
                boardItem(undefined, action)
            ];
        case BOARD_REMOVE_ITEM:
            boardItemIndex = findBoardItemIndex(action.id);
            return [
                ...state.slice(0, boardItemIndex),
                ...state.slice(boardItemIndex + 1, state.length)
            ];
        case QUERY_INPUT_CHANGE:
        case TABLE_DATA_FETCH_COMPLETED:
        case COLUMN_REMOVE:
            // proxy action to the corresponding boardItem
            boardItemIndex = findBoardItemIndex(action.boardItemId);
            let newState = [...state];
            newState[boardItemIndex] = boardItem(state[boardItemIndex], action);
            return newState;
        default:
            return state;
    }
};

export default boardItems;