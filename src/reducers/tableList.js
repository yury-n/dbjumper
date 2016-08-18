const tableList = (state = [], action) => {

    if (action.type == 'FETCH_TABLE_LISTING_SUCCESS') {
        return Object.keys(action.response).sort();
    }

    return state;
};

export default tableList;