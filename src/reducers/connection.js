import {
    CONNECTION_CREATE,
    CONNECTION_CREATE_FROM,
    CONNECTION_CREATE_TO
} from '../actions';

const connection = (state = {}, action) => {

    switch (action.type) {
        case CONNECTION_CREATE:
            return {
                color: action.color,
                from: {
                    boardItemId: action.fromBoardItemId,
                    columnName: action.fromColumnName,
                    values: []
                },
                to: {
                    boardItemId: action.toBoardItemId,
                    columnName: action.toColumnName,
                    values: []
                }
            };
        case CONNECTION_CREATE_FROM:
            return {
                color: action.color,
                from: {
                    boardItemId: action.boardItemId,
                    columnName: action.columnName,
                    values: action.values
                }
            };
        case CONNECTION_CREATE_TO:
            return {
                ...state,
                to: {
                    boardItemId: action.boardItemId,
                    columnName: action.columnName,
                    values: action.values
                }
            };
        default:
            return state;
    }
};

export default connection;

export const getConnectedElems = (state) => {
    if (typeof state.from == 'undefined') {
        return [];
    }
    const color = state.color;
    let connectedElems = [{...state.from, color}];
    if (typeof state.to != 'undefined') {
        connectedElems.push({...state.to, color});
    }
    return connectedElems;
};