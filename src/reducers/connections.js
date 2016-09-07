import connection, { getConnectedElems } from './connection';

import {
    BOARD_REMOVE_ITEM,
    CONNECTION_CREATE,
    CONNECTION_CREATE_FROM,
    CONNECTION_CREATE_TO,
    CONNECTION_CREATE_CANCEL
} from '../actions';

const connections = (state = [], action) => {
    switch (action.type) {
        case CONNECTION_CREATE:
        case CONNECTION_CREATE_FROM:
            return [
                ...state,
                connection(undefined, action)
            ];
        case CONNECTION_CREATE_TO: {
            // proxy action to the corresponding connection
            const connectionIndex = getCurrentlyCreatedConnectionIndex(state);
            let newState = [...state];
            newState[connectionIndex] = connection(state[connectionIndex], action);
            return newState;
        }
        case CONNECTION_CREATE_CANCEL:
            return state.filter(connection => typeof connection.to != 'undefined');
        case BOARD_REMOVE_ITEM:
            return state.filter(
                connection => connection.from.boardItemId !== action.id
                              && connection.to.boardItemId !== action.id
            );
        default:
            return state;
    }
};

export default connections;

export const getConnectedElemsForBoardItem = (state, boardItemId) => {
    if (!state.length) {
        return [];
    }
    let connectedElems = [];
    state.forEach(connection => {
        connectedElems = [...connectedElems, ...getConnectedElems(connection)];
    });

    return connectedElems.filter(connectedElem => connectedElem.boardItemId === boardItemId);
};

export const doesConnectionExist = (state, fromBoardItemId, fromColumnName, toBoardItemId, toColumnName) =>
    !!state.find(
        connection =>
            typeof connection.from != 'undefined'
                && connection.from.boardItemId == fromBoardItemId
                && connection.from.columnName == fromColumnName
            &&
            typeof connection.to != 'undefined'
                && connection.to.boardItemId == toBoardItemId
                && connection.to.columnName == toColumnName
    );

export const getCurrentlyCreatedConnection = (state) =>
    state.find(connection => typeof connection.to == 'undefined');

export const getCurrentlyCreatedConnectionIndex = (state) =>
    state.findIndex(connection => typeof connection.to == 'undefined');
