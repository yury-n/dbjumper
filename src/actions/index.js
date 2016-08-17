import { v4 } from 'node-uuid';
import * as api from '../api';

export const fetchTableListing = () => (dispatch) => {

    return api.fetchTableListing().then(
        response => {
            dispatch({
                type: 'FETCH_TABLE_LISTING_SUCCESS',
                response
            });
        },
        error => {
            /* do nothing for now */
        }
    );
};

export const addBoardItem = (query = '', clearBoard = false) => ({
    type: 'ADD_BOARD_ITEM',
    id: v4(),
    query,
    clearBoard
});

export const selectTableFromSidebar = (tablename) => {
    const query = tablename;
    const clearBoard = true;
    return addBoardItem(query, clearBoard);
};

export const removeBoardItem = (id) => ({
    type: 'REMOVE_BOARD_ITEM',
    id
});

export const changeQueryInput = (boardItemId, query, inputBoundingRect, cursorPosition) => ({
    type: 'CHANGE_QUERY_INPUT',
    boardItemId,
    query,
    inputBoundingRect,
    cursorPosition
});

export const focusQueryInput = (boardItemId) => ({
    type: 'FOCUS_QUERY_INPUT',
    boardItemId
});

export const changeSelectedSuggestion = (selectedIndex) => ({
    type: 'CHANGE_SELECTED_SUGGESTION',
    selectedIndex
});

export const hideSuggestions = () => ({
    type: 'HIDE_SUGGESTIONS'
});

export const useSuggestion = (suggestion, forQueryPart) => ({
    type: 'USE_SUGGESTION',
    suggestion,
    forQueryPart
});