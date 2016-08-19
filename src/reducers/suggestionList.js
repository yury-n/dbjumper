import { getQueryInputClientWidth } from '../utils';

// sample input: "users.userid=3,5,8;active=1"

// determine what is currently being inputted
// by looking for the nearest separator (.=;) on the left of the input cursor

// if there is none, it's a simple tablename input -- autosuggest tables
// if there's a dot, it's a columnname input e.g.: "users.useri|" -- autosuggest columns
// if there's an equals sign, it's a value input -- do nothing
// if there's a semicolon, it's another columnname input e.g. "users.userid=3;acti|" -- autosuggest columns

// we need the part of the query BEFORE the nearest separator
//     to measure its width and position the suggestion block horizontally right after it
// we need the part of the query AFTER the nearest separator [TILL the nearest separator on the right, if there is one]
//     as it is the currently inputted (table|column)name
//     and we'll form our suggestions based on it

const separators = ['=', '.', ';'];

const _findNearestSeparator = (query, offset, direction) => {

    if ((direction == 'left' && offset === 0)  // nothing to the left
        || (direction == 'right' && offset === query.length)) { // nothing on the right

        return {separator: null, offset: null};
    }

    let queryPartFromCursor;
    if (direction == 'left') {
        queryPartFromCursor = query.slice(0, offset);
    } else {  // right
        queryPartFromCursor = query.slice(offset, query.length);
    }

    let nearestSeparator = null;
    let nearestSeparatorOffset = null;
    separators.forEach(separator => {
        let indexOfFunc = (direction == 'left' ? 'lastIndexOf' : 'indexOf');
        let currentSeparatorOffset = queryPartFromCursor[indexOfFunc](separator);
        if (currentSeparatorOffset === -1) {
            return; // to the next separator
        }
        if (nearestSeparatorOffset === null) {
            nearestSeparator = separator;
            nearestSeparatorOffset = currentSeparatorOffset;
            return; // to the next separator
        }
        if ((direction == 'left' && currentSeparatorOffset > nearestSeparatorOffset)
            || (direction == 'right' && currentSeparatorOffset < nearestSeparatorOffset)) {
            nearestSeparator = separator;
            nearestSeparatorOffset = currentSeparatorOffset;
        }
    });
    if (nearestSeparator !== null && direction == 'right') {
        nearestSeparatorOffset += offset;
    }

    return {separator: nearestSeparator, offset: nearestSeparatorOffset};
};

const suggestionsSourceReducer = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_TABLES_LISTING_SUCCESS':
            return action.response;
        default:
            return state;
    }
};

const suggestionsReducer = (suggestionsState = {'items': [], 'separatorIndex': -1}, suggestionSourceState = [], action) => {

    const _emptyState = () => {
        return {'items': [], 'separatorIndex': -1};
    };

    const _ifNotOneExactMatchToInput = (input, suggestionsState) => {
        if (suggestionsState.items.length == 1 && input == suggestionsState.items[0]) {
            // there is no reason to suggest something that's already been fully inputted
            return _emptyState();
        } else {
            return suggestionsState;
        }
    };

    switch (action.type) {
        case 'HIDE_SUGGESTIONS':
        case 'USE_SUGGESTION':
            return _emptyState();

        case 'CHANGE_QUERY_INPUT':

            const {query, cursorPosition} = action;

            const separatorLeft = _findNearestSeparator(query, cursorPosition, 'left');
            const separatorRight = _findNearestSeparator(query, cursorPosition, 'right');

            // sanity check
            if (separatorLeft.separator == ';'
                && (query.indexOf('.') == -1 || query.indexOf('.') > separatorLeft.offset)) {
                // incorrect query -- you can use ';' to add filtering by another column
                // after one filter has been applied with "table.column=value" syntax
                return _emptyState();
            }

            if (separatorLeft.separator === null) {

                const inputtedTableName = query.slice(0, separatorRight.offset || query.length);
                if (!inputtedTableName.length) {
                    return _emptyState();
                }
                const matchedTableNames = Object.keys(suggestionSourceState).filter(tablename => tablename.indexOf(query) === 0);
                return _ifNotOneExactMatchToInput(
                    inputtedTableName,
                    {items: matchedTableNames, separatorIndex: -1}
                );

            } else if (separatorLeft.separator == '.' || separatorLeft.separator == ';') {

                const inputtedColumnName = query.slice(separatorLeft.offset + 1, separatorRight.offset || query.length);

                const inputtedTable = query.split('.')[0];
                const suggestionSourceForInputtedTable = suggestionSourceState[inputtedTable];
                if (typeof suggestionSourceForInputtedTable == 'undefined') {
                    return _emptyState();
                }

                let matchedColumnNames = [];
                let separatorIndex = -1;
                ['indexed', 'nonindexed'].forEach(columnType => {

                    if (!suggestionSourceForInputtedTable[columnType + '_columns'].length) {
                        return;
                    }

                    matchedColumnNames = [
                        ...matchedColumnNames,
                        ...suggestionSourceForInputtedTable[columnType + '_columns'].filter(
                            columnname => columnname.indexOf(inputtedColumnName) === 0
                        )
                    ];
                    if (columnType == 'indexed' && matchedColumnNames.length) {
                        // separator between indexed and non-indexed columns
                        separatorIndex = (matchedColumnNames.length - 1);
                    }
                });
                if (matchedColumnNames[matchedColumnNames.length - 1] == separatorIndex) {
                    // this would be the case, if all matches are indexed columns
                    // no need to have a separator
                    separatorIndex = -1;
                }
                return _ifNotOneExactMatchToInput(
                    inputtedColumnName,
                    {items: matchedColumnNames, separatorIndex}
                );

            } else {
                return _emptyState();
            }

        default:
            return suggestionsState;
    }
};

const componentPositionReducer = (state = {top: 0, left: 0}, action) => {

    switch (action.type) {
        case 'CHANGE_QUERY_INPUT':
            const { query, cursorPosition, inputBoundingRect } = action;

            // if needed, shift suggestions block N px from left to place it next to
            // the part of the query currently being entered
            let shiftLeft = 0;

            const separatorLeft = _findNearestSeparator(query, cursorPosition, 'left');
            if (separatorLeft.separator !== null) {
                const queryBeforeSeparator = query.slice(0, separatorLeft.offset + 1);
                shiftLeft = getQueryInputClientWidth(queryBeforeSeparator);
                // make suggestion text v-aligned with the query part we're suggesting for
                shiftLeft -= 15; // compensate padding
                shiftLeft -= 1; // compensate left-border
            }

            return {
                left: inputBoundingRect.left + shiftLeft,
                top: inputBoundingRect.bottom
            };
        default:
            return state;
    }
};

// the part we'll replace with our suggestion, if selected
const forQueryPartReducer = (state = [0, 0], action) => {
    switch (action.type) {
        case 'CHANGE_QUERY_INPUT':
            const { query, cursorPosition } = action;
            const separatorLeft = _findNearestSeparator(query, cursorPosition, 'left');
            const separatorRight = _findNearestSeparator(query, cursorPosition, 'right');
            return [
                separatorLeft.offset ? separatorLeft.offset + 1 : 0,
                separatorRight.offset || query.length
            ];
        default:
            return state;
    }
};

const suggestionListReducer = (state = {}, action) => {

    const suggestionsSource = suggestionsSourceReducer(state.suggestionsSource, action);
    const suggestions = suggestionsReducer(state.suggestions, suggestionsSource, action);
    const componentPosition = componentPositionReducer(state.componentPosition, action);
    const forQueryPart = forQueryPartReducer(state.forQueryPart, action);

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
            if (selectedIndex > suggestions.items.length - 1) {
                selectedIndex = 0;
            } else if (selectedIndex < 0) {
                selectedIndex = suggestions.items.length - 1;
            }
            break;
    }

    return {
        suggestionsSource,
        suggestions,
        visible,
        selectedIndex,
        componentPosition,
        forQueryPart
    };
};

export default suggestionListReducer;

export const getSuggestedItems = (state) => state.suggestions.items;