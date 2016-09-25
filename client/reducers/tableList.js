import { TABLES_LISTING_FETCH_COMPLETED } from '../actions';

const tableList = (state = [], action) => {

    if (action.type == TABLES_LISTING_FETCH_COMPLETED) {
        return Object.keys(action.response).sort();
    }

    return state;
};

export default tableList;