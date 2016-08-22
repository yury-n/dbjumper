import {
    BOARD_ADD_ITEM,
    BOARD_REMOVE_ITEM,
    CONNECTION_CREATE_FROM,
    QUERY_INPUT_CHANGE,
    QUERY_INPUT_FOCUS,
    QUERY_INPUT_COMMIT,
    SUGGESTIONS_USE,
    TABLE_DATA_FETCH_COMPLETED
} from '../actions';

import boardItem from './boardItem';
import boardItems from './boardItems';

const activeBoardItemId = (state = -1, action) => {

    switch (action.type) {
        case BOARD_ADD_ITEM:
            return (action.activate ? action.id : -1);
        case QUERY_INPUT_FOCUS:
        case QUERY_INPUT_CHANGE:
            return action.boardItemId;
        case QUERY_INPUT_COMMIT:
        case CONNECTION_CREATE_FROM:
            return -1;
        default:
            return state;
    }
};

const addButtonIsVisible = (state = false, action) => {
    switch (action.type) {
        case BOARD_REMOVE_ITEM:
        case TABLE_DATA_FETCH_COMPLETED:
            return true;
        default:
            return state;
    }
};

const board = (state = {}, action) => {

    state = {
        boardItems: boardItems(state.boardItems, action),
        activeQueryBoardItemId: activeBoardItemId(state.activeQueryBoardItemId, action),
        addButtonIsVisible: addButtonIsVisible(state.addButtonIsVisible, action)
    };
    switch (action.type) {
        case SUGGESTIONS_USE:
            state.boardItems = state.boardItems.map(item => {
                if (item.id == state.activeQueryBoardItemId) {
                    return boardItem(item, action);
                }
                return item;
            });
            return state;
        default:
            return state;
    }
};

export default board;

export const getBoardItems = (state) => state.boardItems;
export const getBoardItem = (state, id) => state.boardItems.find(item => item.id === id);
export const getActiveQueryBoardItemId = (state) => state.activeQueryBoardItemId;
export const isAddButtonVisible = (state) => state.addButtonIsVisible;