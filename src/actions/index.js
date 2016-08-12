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

export const addBoardItem = (query = '') => ({
    type: 'ADD_BOARD_ITEM',
    id: v4(),
    query
});