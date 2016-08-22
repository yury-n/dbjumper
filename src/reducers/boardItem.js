const boardItem = (state = {}, action) => {
    switch (action.type) {
        case 'BOARD_ADD_ITEM':
            return {
                id: action.id,
                query: action.query,
                results: []
            };
        case 'QUERY_INPUT_CHANGE':
            return {
                ...state,
                query: action.query
            };
        case 'TABLE_DATA_FETCH_COMPLETED':
            return {
                ...state,
                results: action.response
            };
        default:
            return state;
    }
};

export default boardItem;