import {
    CONNECTION_CREATE_FROM
} from '../actions';

const connection = (state = {}, action) => {

    switch (action.type) {
        case CONNECTION_CREATE_FROM:
            const { boardItemId, rowIndex, columnIndex } = action;
            return {
                color: action.color,
                from: {
                    boardItemId,
                    rowIndex,
                    columnIndex
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