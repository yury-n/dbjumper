const tableList = (state = [], action) => {

    if (action.type == 'FETCH_TABLE_LISTING_SUCCESS') {
        return action.response.map(row => row.tablename);
    }

    return state;
};

export default tableList;