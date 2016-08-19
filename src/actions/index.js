import { v4 } from 'node-uuid';
import * as api from '../api';

export const fetchTablesListing = () => (dispatch) => {

    return api.fetchTablesListing().then(
        response => {
            dispatch({
                type: 'FETCH_TABLES_LISTING_SUCCESS',
                response
            });
        }
    );
};

export const commitQueryInput = (boardItemId, query) => (dispatch) => {
    dispatch({type: 'COMMIT_QUERY_INPUT'});
    return fetchTableData(boardItemId, query)(dispatch);
};

export const fetchTableData = (boardItemId, table) => (dispatch) => {

    return api.fetchTableData(table).then(
        response => {
            dispatch({
                type: 'FETCH_TABLE_DATA_SUCCESS',
                boardItemId,
                response
            });
        }
    );
};

export const addBoardItem = (...args) => addBoardItemWithId(v4(), ...args);

export const addBoardItemWithId = (id, query = '', clearBoard = false, activate = true) => ({
    type: 'ADD_BOARD_ITEM',
    id,
    query,
    activate,
    clearBoard
});

export const selectTableFromSidebar = (tablename) => (dispatch) => {
    const boardItemId = v4();
    const query = tablename;
    const clearBoard = true;
    const activate = false;
    dispatch(addBoardItemWithId(boardItemId, query, clearBoard, activate));

    return fetchTableData(boardItemId, query)(dispatch);
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