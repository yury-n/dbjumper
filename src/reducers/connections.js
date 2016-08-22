import connection, { getConnectedElems } from './connection';

import {
    CONNECTION_CREATE_FROM
} from '../actions';

const connections = (state = [], action) => {
    switch (action.type) {
        case CONNECTION_CREATE_FROM:
            return [
                ...state,
                connection(undefined, action)
            ];
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
    console.log('>>connectedElems', connectedElems);

    return connectedElems.filter(connectedElem => connectedElem.boardItemId === boardItemId);
};