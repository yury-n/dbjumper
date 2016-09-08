import {
    QUERY_INPUT_CHANGE,
    SUGGESTIONS_HIDE,
    SUGGESTIONS_USE,
    SUGGESTIONS_CHANGE_SELECTED,
    TABLES_LISTING_FETCH_COMPLETED,
} from '../actions';

import { findNearestQuerySeparator, getQueryInputClientWidth } from '../utils';
import suggestionsReducer from './suggestions';

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


const suggestionsSourceReducer = (state = [], action) => {
    switch (action.type) {
        case TABLES_LISTING_FETCH_COMPLETED:
            return action.response;
        default:
            return state;
    }
};

const componentPositionReducer = (state = {top: 0, left: 0}, action) => {

    switch (action.type) {
        case QUERY_INPUT_CHANGE: {
            const { query, inputBoundingRect, cursorPosition } = action;

            if (typeof inputBoundingRect === 'undefined') {
                return state;
            }

            // if needed, shift suggestions block N px from left to place it next to
            // the part of the query currently being entered
            let shiftLeft = 0;

            const separatorLeft = findNearestQuerySeparator(query, cursorPosition, 'left');
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
        }
        default:
            return state;
    }
};

// the part we'll replace with our suggestion, if selected
const forQueryPartReducer = (state = [0, 0], action) => {
    switch (action.type) {
        case QUERY_INPUT_CHANGE: {
            const { query, cursorPosition } = action;
            const separatorLeft = findNearestQuerySeparator(query, cursorPosition, 'left');
            const separatorRight = findNearestQuerySeparator(query, cursorPosition, 'right');
            return [
                separatorLeft.offset ? separatorLeft.offset + 1 : 0,
                separatorRight.offset || query.length
            ];
        }
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
        case QUERY_INPUT_CHANGE:
            if (action.query.length > 0) {
                visible = true;
            } else {
                visible = false;
                selectedIndex = 0;
            }
            break;
        case SUGGESTIONS_HIDE:
        case SUGGESTIONS_USE:
            visible = false;
            selectedIndex = 0;
            break;
        case SUGGESTIONS_CHANGE_SELECTED:
            selectedIndex = action.selectedIndex;
            if (selectedIndex > suggestions.items.length - 1) {
                selectedIndex = 0;
            } else if (selectedIndex < 0) {
                selectedIndex = suggestions.items.length - 1;
            }
            break;
    }
    if (!suggestions.items.length) {
        visible = false;
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
