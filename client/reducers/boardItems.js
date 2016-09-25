import {
    BOARD_ADD_ITEM,
    BOARD_REMOVE_ITEM,
    QUERY_INPUT_CHANGE,
    TABLE_DATA_FETCH,
    TABLE_DATA_FETCH_COMPLETED,
    TABLE_META_FETCH,
    TABLE_META_FETCH_COMPLETED
} from '../actions';

import boardItem from './boardItem';

const boardItems = (state = [], action) => {

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
        case BOARD_REMOVE_ITEM: {
            const boardItemIndex = findBoardItemIndex(action.id);
            return [
                ...state.slice(0, boardItemIndex),
                ...state.slice(boardItemIndex + 1, state.length)
            ];
        }
        case TABLE_DATA_FETCH:
        case TABLE_META_FETCH:
        case QUERY_INPUT_CHANGE:
        case TABLE_DATA_FETCH_COMPLETED:
        case TABLE_META_FETCH_COMPLETED: {
            // proxy action to the corresponding boardItem
            const boardItemIndex = findBoardItemIndex(action.boardItemId);
            let newState = [...state];
            newState[boardItemIndex] = boardItem(state[boardItemIndex], action);
            return newState;
        }
        default:
            return state;
    }
};

export default boardItems;

export const getBoardItem = (state, id) => state.find(item => item.id === id);
