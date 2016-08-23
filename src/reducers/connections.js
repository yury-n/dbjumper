import connection, { getConnectedElems } from './connection';

import {
    CONNECTION_CREATE_FROM,
    CONNECTION_CREATE_TO,
    CONNECTION_CREATE_CANCEL,
    QUERY_INPUT_COMMIT
} from '../actions';

const connections = (state = [], action) => {
    switch (action.type) {
        case CONNECTION_CREATE_FROM:
            return [
                ...state,
                connection(undefined, action)
            ];
        case CONNECTION_CREATE_TO:
            // proxy action to the corresponding connection
            const connectionIndex = getCurrentlyCreatedConnectionIndex(state);
            let newState = [...state];
            newState[connectionIndex] = connection(state[connectionIndex], action);
            return newState;
        case CONNECTION_CREATE_CANCEL:
            return state.filter(connection => typeof connection.to != 'undefined');
        case QUERY_INPUT_COMMIT:
            break;
        default:
            return state;
    }
    return state;
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

export const getCurrentlyCreatedConnection = (state) =>
    state.find(connection => typeof connection.to == 'undefined');

export const getCurrentlyCreatedConnectionIndex = (state) =>
    state.findIndex(connection => typeof connection.to == 'undefined');