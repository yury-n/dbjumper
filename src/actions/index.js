import { v4 } from 'node-uuid';
import * as api from '../api';

const BOARD_ADD_ITEM = 'BOARD_ADD_ITEM';
const BOARD_REMOVE_ITEM = 'BOARD_REMOVE_ITEM';
const SUGGESTIONS_CHANGE_SELECTED = 'SUGGESTIONS_CHANGE_SELECTED';
const SUGGESTIONS_HIDE = 'SUGGESTIONS_HIDE';
const SUGGESTIONS_USE = 'SUGGESTIONS_USE';
const TABLE_DATA_FETCH = 'TABLE_DATA_FETCH';
const TABLE_DATA_FETCH_COMPLETED = 'TABLE_DATA_FETCH_COMPLETED';
const TABLES_LISTING_FETCH = 'TABLES_LISTING_FETCH';
const TABLES_LISTING_FETCH_COMPLETED = 'TABLES_LISTING_FETCH_COMPLETED';
const QUERY_INPUT_CHANGE = 'QUERY_INPUT_CHANGE';
const QUERY_INPUT_COMMIT = 'QUERY_INPUT_COMMIT';
const QUERY_INPUT_FOCUS = 'QUERY_INPUT_FOCUS';

/*
 BOARD_*
 */

export const addBoardItem = (...args) => addBoardItemWithId(v4(), ...args);

export const addBoardItemWithId = (id, query = '', clearBoard = false, activate = true) => ({
    type: BOARD_ADD_ITEM,
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
    type: BOARD_REMOVE_ITEM,
    id
});

/*
 QUERY_INPUT_*
 */

export const changeQueryInput = (boardItemId, query, inputBoundingRect, cursorPosition) => ({
    type: QUERY_INPUT_CHANGE,
    boardItemId,
    query,
    inputBoundingRect,
    cursorPosition
});

export const focusQueryInput = (boardItemId) => ({
    type: QUERY_INPUT_FOCUS,
    boardItemId
});

export const commitQueryInput = (boardItemId, query) => (dispatch) => {
    dispatch({
        type: QUERY_INPUT_COMMIT
    });
    return fetchTableData(boardItemId, query)(dispatch);
};

/*
 SUGGESTIONS_*
 */

export const changeSelectedSuggestion = (selectedIndex) => ({
    type: SUGGESTIONS_CHANGE_SELECTED,
    selectedIndex
});

export const hideSuggestions = () => ({
    type: SUGGESTIONS_HIDE
});

export const useSuggestion = (suggestion, forQueryPart) => ({
    type: SUGGESTIONS_USE,
    suggestion,
    forQueryPart
});

/*
FETCHES
 */

export const fetchTablesListing = () => (dispatch) => {
    dispatch({
        type: TABLES_LISTING_FETCH
    });
    return api.fetchTablesListing().then(
        response => {
            dispatch({
                type: TABLES_LISTING_FETCH_COMPLETED,
                response
            });
        }
    );
};

export const fetchTableData = (boardItemId, table) => (dispatch) => {
    dispatch({
        type: TABLE_DATA_FETCH
    });
    return api.fetchTableData(table).then(
        response => {
            dispatch({
                type: TABLE_DATA_FETCH_COMPLETED,
                boardItemId,
                response
            });
        }
    );
};