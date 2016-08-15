import { v4 } from 'node-uuid';
import * as api from '../api';

export const fetchTableList = () => (dispatch) => {

    return api.fetchTableList().then(
        response => {
            dispatch({
                type: 'FETCH_TABLE_LIST_SUCCESS',
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

export const removeBoardItem = (id) => ({
    type: 'REMOVE_BOARD_ITEM',
    id
});

export const changeQueryInput = (boardItemId, query) => ({
    type: 'CHANGE_QUERY_INPUT',
    boardItemId,
    query
});

export const selectTableFromSidebar = (tablename) => {
    const query = tablename;
    const clearBoard = true;
    return addBoardItem(query, clearBoard);
};