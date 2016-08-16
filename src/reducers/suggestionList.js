// sample input: "users.userid=3,5,8;active=1"

// determine what is currently being inputted
// by looking at the nearest controlling (.=;) punctuation mark on the left of the input cursor

// if there is none, it's a simple tablename input -- autosuggest tables
// if there's a dot, it's a columnname input e.g.: "users.useri|" -- autosuggest columns
// if there's an equals sign, it's a value input -- do nothing
// if there's a semicolon, it's another columnname input e.g. "users.userid=3;acti|" -- autosuggest columns

// we need the part of the query BEFORE the nearest controlling punctuation mark
//     to measure its width and position the suggestion block horizontally right after it
// we need the part of the query AFTER the nearest controlling punctuation mark
//     as it is the currently inputted (table|column)name
//     and we'll form our suggestions based on it

const getLeftSeparatorOffset = (query, cursorPosition) => {
    if (cursorPosition === 0) {
        return -1; // nothing to the left
    }
    const queryBeforeCursor = query.slice(0, cursorPosition);
    return Math.max(
        queryBeforeCursor.lastIndexOf('='),
        queryBeforeCursor.lastIndexOf('.'),
        queryBeforeCursor.lastIndexOf(';')
    );
};

const getRightSeparatorOffset = (query, cursorPosition) => {
    if (cursorPosition === query.length) {
        return -1; // nothing on the right
    }
    const queryAfterCursor = query.slice(cursorPosition, query.length);
    return Math.min(
        queryAfterCursor.lastIndexOf('='),
        queryAfterCursor.lastIndexOf('.'),
        queryAfterCursor.lastIndexOf(';')
    );
};

const getQueryPartBeforeControlPuncMark = (query, cursorPosition) => {
    return query.slice(0, getLeftSeparatorOffset(query, cursorPosition));
};

const getQueryPartAfterControlPuncMark = (query, cursorPosition) => {

};

const suggestionsSourceReducer = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_TABLE_LISTING_SUCCESS':
            return action.response;
        default:
            return state;
    }
};

const suggestionsReducer = (suggestionsState = [], suggestionSourceState = [], action) => {
    switch (action.type) {
        case 'CHANGE_QUERY_INPUT':
            const matchedItems = suggestionSourceState.filter(sourceItem => sourceItem.tablename.indexOf(action.query) === 0);
            return matchedItems.map(item => item.tablename);
        default:
            return suggestionsState;
    }
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

    let suggestionsSource = suggestionsSourceReducer(state.suggestionsSource, action);
    let suggestions = suggestionsReducer(state.suggestions, suggestionsSource, action);

    console.log('cursorPosition', action.cursorPosition);

    let visible = state.visible || false;
    let selectedIndex = state.selectedIndex || 0;

    switch (action.type) {
        case 'CHANGE_QUERY_INPUT':
            if (action.query.length > 0) {
                visible = true;
            } else {
                visible = false;
                selectedIndex = 0;
            }
            break;
        case 'HIDE_SUGGESTIONS':
        case 'USE_SUGGESTION':
            visible = false;
            selectedIndex = 0;
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
        suggestionsSource,
        suggestions,
        visible,
        selectedIndex,
        position: positionReducer(state.position, action)
    };
};

export default suggestionListReducer;