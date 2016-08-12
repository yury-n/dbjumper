const boardItem = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_BOARD_ITEM':
            return {
                id: action.id,
                query: action.query
            };
        default:
            return state;
    }
};

export default boardItem;