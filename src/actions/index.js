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