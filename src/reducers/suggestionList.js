
const suggestionsReducer = (state = [], action) => {
    return ['users', 'users_orders', 'users_items'];
};

const positionReducer = (state = {top: 0, left: 0}, action) => {

    switch (action.type) {
        case 'CHANGE_QUERY_INPUT':
            const { inputBoundingRect } = action;
            return {
                left: inputBoundingRect.left,
                top: inputBoundingRect.bottom
            };
        default:
            return state;
    }
};

const suggestionListReducer = (state = {}, action) => {

    const suggestions = suggestionsReducer(state.suggestions, action);

    let visible = state.visible || false;
    let selectedIndex = state.selectedIndex || 0;

    switch (action.type) {
        case 'CHANGE_QUERY_INPUT':
            visible = true;
            break;
        case 'HIDE_SUGGESTIONS':
        case 'USE_SUGGESTION':
            visible = false;
            break;
        case 'CHANGE_SELECTED_SUGGESTION':
            selectedIndex = action.selectedIndex;
            if (selectedIndex > suggestions.length - 1) {
                selectedIndex = 0;
            } else if (selectedIndex < 0) {
                selectedIndex = suggestions.length - 1;
            }
            break;
    }

    return {
        visible,
        suggestions,
        selectedIndex,
        position: positionReducer(state.position, action)
    };
};

export default suggestionListReducer;