const tableList = (state = [], action) => {

    if (action.type == 'FETCH_TABLES_LISTING_SUCCESS') {
        return Object.keys(action.response).sort();
    }

    return state;
};

export default tableList;