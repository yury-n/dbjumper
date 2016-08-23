import {
    BOARD_ADD_ITEM,
    QUERY_INPUT_CHANGE,
    SUGGESTIONS_USE,
    TABLE_DATA_FETCH_COMPLETED
} from '../actions';

const boardItem = (state = {}, action) => {
    switch (action.type) {
        case BOARD_ADD_ITEM:
            return {
                id: action.id,
                query: action.query,
                results: []
            };
        case QUERY_INPUT_CHANGE:
            return {
                ...state,
                query: action.query
            };
        case SUGGESTIONS_USE:
            const { suggestion, forQueryPart } = action;
            const [ forQueryPartStart, forQueryPartEnd ] = forQueryPart;
            return {
                ...state,
                query: state.query.slice(0, forQueryPartStart) +
                       suggestion +
                       state.query.slice(forQueryPartEnd, state.query.length)
            };
        case TABLE_DATA_FETCH_COMPLETED:
            return {
                ...state,
                results: action.response
            };
        default:
            return state;
    }
};

export default boardItem;

export const getBoardItemQuery = (state) => state.query;