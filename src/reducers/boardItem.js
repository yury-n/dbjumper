const boardItem = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_BOARD_ITEM':
            return {
                id: action.id,
                query: action.query
            };
        case 'CHANGE_QUERY_INPUT':
            return {
                ...state,
                query: action.query
            };
        default:
            return state;
    }
};

export default boardItem;