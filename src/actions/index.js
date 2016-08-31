import { v4 } from 'node-uuid';
import * as api from '../api';
import { uniq } from 'lodash/array';
import { getBoard, getConnections } from '../reducers';
import { getBoardItem } from '../reducers/board';
import { getBoardItemQuery } from '../reducers/boardItem';
import { getCurrentlyCreatedConnection, doesConnectionExist } from '../reducers/connections';

export const BOARD_ADD_ITEM = 'BOARD_ADD_ITEM';
export const BOARD_REMOVE_ITEM = 'BOARD_REMOVE_ITEM';
export const SUGGESTIONS_CHANGE_SELECTED = 'SUGGESTIONS_CHANGE_SELECTED';
export const SUGGESTIONS_HIDE = 'SUGGESTIONS_HIDE';
export const SUGGESTIONS_USE = 'SUGGESTIONS_USE';
export const TABLE_DATA_FETCH = 'TABLE_DATA_FETCH';
export const TABLE_DATA_FETCH_COMPLETED = 'TABLE_DATA_FETCH_COMPLETED';
export const TABLE_META_FETCH = 'TABLE_META_FETCH';
export const TABLE_META_FETCH_COMPLETED = 'TABLE_META_FETCH_COMPLETED';
export const TABLES_LISTING_FETCH = 'TABLES_LISTING_FETCH';
export const TABLES_LISTING_FETCH_COMPLETED = 'TABLES_LISTING_FETCH_COMPLETED';
export const QUERY_INPUT_CHANGE = 'QUERY_INPUT_CHANGE';
export const QUERY_INPUT_COMMIT = 'QUERY_INPUT_COMMIT';
export const QUERY_INPUT_FOCUS = 'QUERY_INPUT_FOCUS';
export const CONNECTION_CREATE = 'CONNECTION_CREATE';
export const CONNECTION_CREATE_CANCEL = 'CONNECTION_CREATE_CANCEL';
export const CONNECTION_CREATE_FROM = 'CONNECTION_CREATE_FROM';
export const CONNECTION_CREATE_TO = 'CONNECTION_CREATE_TO';

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

export const selectTableFromSidebar = (tablename) => (dispatch, getState) => {
    const boardItemId = v4();
    const query = tablename;
    const clearBoard = true;
    const activate = false;
    dispatch(addBoardItemWithId(boardItemId, query, clearBoard, activate));

    return fetchTableData(boardItemId)(dispatch, getState);
};

export const removeBoardItem = (id) => ({
    type: BOARD_REMOVE_ITEM,
    id
});

/*
 QUERY_INPUT_*
 */

// boardItemId can be null if it's a floating query input
export const changeQueryInput = (boardItemId, query, inputBoundingRect, cursorPosition) => (dispatch, getState) => {
    const afterHashSign = query.split('#')[1];
    if (typeof(afterHashSign) != 'undefined' && afterHashSign.length) {
        // not allowed to input anything after '#'
        return;
    }
    dispatch({
        type: QUERY_INPUT_CHANGE,
        boardItemId,
        query,
        inputBoundingRect,
        cursorPosition
    });
};

export const focusQueryInput = (boardItemId) => ({
    type: QUERY_INPUT_FOCUS,
    boardItemId
});

export const commitQueryInput = (boardItemId, query, withCtrlKeyPressed = false) => (dispatch, getState) => {

    dispatch({
        type: QUERY_INPUT_COMMIT
    });

    if (boardItemId === null) {
        // committed from FloatingQueryInput
        // create a new connection

        const [connectToTableName, connectToColumnName] = query.split('.');

        const connection = getCurrentlyCreatedConnection(getConnections(getState()));
        const fromBoardItemId = connection.from.boardItemId;
        const fromColumnName = connection.from.columnName;
        const fromValues = connection.from.values;

        if (!withCtrlKeyPressed
            || fromColumnName.includes('.')) { // currently we don't support inline joins for already joined tables

            // connect as a new board item
            const toBoardItemId = v4();
            dispatch(addBoardItemWithId(toBoardItemId, query + '=' + uniq(fromValues).join(',')));
            dispatch(createConnectionTo(toBoardItemId, connectToColumnName, fromValues));

            return fetchTableData(toBoardItemId)(dispatch, getState);

        } else {

            // connect on the same board item
            const board = getBoard(getState());
            const boardItem = getBoardItem(board, fromBoardItemId);
            const query = getBoardItemQuery(boardItem);

            let appendToQuery = `+${connectToTableName}`;
            if (fromColumnName != connectToColumnName) {
                appendToQuery += `(${fromColumnName}=${connectToColumnName})`;
            } else {
                appendToQuery += `(${fromColumnName})`;
            }

            dispatch(changeQueryInput(fromBoardItemId, query + appendToQuery));
            dispatch(createConnectionTo(
                fromBoardItemId,
                `${connectToTableName}.${connectToColumnName}`
            ));

            return fetchTableData(fromBoardItemId)(dispatch, getState);
        }

    } else {

        if (query.slice(-1) == '#') {

            return fetchTableMeta(boardItemId)(dispatch, getState);

        } else {

            const tableParts = query.split('+');

            if (tableParts.length > 1) {

                const connections = getConnections(getState());

                const joinedTableParts = tableParts.slice(1);
                joinedTableParts.forEach(joinedTablePart => {
                    // +user(userid=id) --
                    // what goes before '(' is the joined table name
                    let table = joinedTablePart.split('(')[0];

                    // what's inside the parest is the join by part
                    let joinBy = joinedTablePart.slice(
                        joinedTablePart.indexOf('(') + 1,
                        joinedTablePart.indexOf(')')
                    );
                    let [firstTableKey, joinedTableKey] = joinBy.split('=');
                    if (typeof joinedTableKey == 'undefined') {
                        joinedTableKey = firstTableKey;
                    }
                    joinedTableKey = table + '.' + joinedTableKey;

                    if (!doesConnectionExist(connections, boardItemId, firstTableKey, boardItemId, joinedTableKey)) {
                        dispatch(createConnection(boardItemId, firstTableKey, boardItemId, joinedTableKey));
                    }
                });
            }

            return fetchTableData(boardItemId)(dispatch, getState);   
        }
    }
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
 CONNECTION_*
 */

const connectionColors = ['#dbfcee', '#f2fcdb', '#fcfadb', '#fcebdb', '#fcdbdb', '#fcdbf2', '#eadbfc', '#dbe2fc', '#dbecfc', '#dbfcfc'];
let   colorPointer = 0;
const _getNextConnectionColor = () => {
    const nextColor = connectionColors[colorPointer++];
    if (colorPointer > connectionColors.length - 1) {
        colorPointer = 0;
    }
    return nextColor;
};

export const createConnection = (fromBoardItemId, fromColumnName, toBoardItemId, toColumnName) => ({
    type: CONNECTION_CREATE,
    color: _getNextConnectionColor(),
    fromBoardItemId,
    fromColumnName,
    toBoardItemId,
    toColumnName
});

export const createConnectionFrom = (boardItemId, { columnName, values, boundingRect }) => ({
    type: CONNECTION_CREATE_FROM,
    color: _getNextConnectionColor(),
    boardItemId,
    columnName,
    values,
    boundingRect
});

export const cancelConnectionCreation = () => {
    colorPointer--;
    return {
        type: CONNECTION_CREATE_CANCEL
    }
};

export const createConnectionTo = (boardItemId, columnName, values = []) => ({
    type: CONNECTION_CREATE_TO,
    boardItemId,
    columnName,
    values
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
    ).catch(error => console.log(error));
};

export const fetchTableData = (boardItemId) => (dispatch, getState) => {
    dispatch({
        type: TABLE_DATA_FETCH,
        boardItemId
    });
    const board = getBoard(getState());
    const boardItem = getBoardItem(board, boardItemId);
    const query = getBoardItemQuery(boardItem);

    return api.fetchTableData(query).then(
        response => {
            dispatch({
                type: TABLE_DATA_FETCH_COMPLETED,
                boardItemId,
                response
            });
        }
    ).catch(error => console.log(error));
};

export const fetchTableMeta = (boardItemId) => (dispatch, getState) => {
    dispatch({
        type: TABLE_META_FETCH,
        boardItemId
    });
    const board = getBoard(getState());
    const boardItem = getBoardItem(board, boardItemId);
    const query = getBoardItemQuery(boardItem);
    const table = query.replace('#', '');

    return api.fetchTableMeta(table).then(
        response => {
            dispatch({
                type: TABLE_META_FETCH_COMPLETED,
                boardItemId,
                response
            });
        }
    ).catch(error => console.log(error));
};
