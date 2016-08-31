import {
    BOARD_ADD_ITEM,
    QUERY_INPUT_CHANGE,
    SUGGESTIONS_USE,
    TABLE_DATA_FETCH,
    TABLE_DATA_FETCH_COMPLETED,
    TABLE_META_FETCH,
    TABLE_META_FETCH_COMPLETED
} from '../actions';

const boardItem = (state = {}, action) => {
    switch (action.type) {
        case BOARD_ADD_ITEM:
            return {
                id: action.id,
                query: action.query,
                loading: false,
                dataResults: [],
                metaResults: [],
                hiddenColumns: []
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
        case TABLE_META_FETCH:
            return {
                ...state,
                dataResults: [],
                loading: true
            };
        case TABLE_DATA_FETCH:
            return {
                ...state,
                metaResults: [],
                loading: true
            };
        case TABLE_DATA_FETCH_COMPLETED:
            return {
                ...state,
                loading: false,
                dataResults: action.response
            };
        case TABLE_META_FETCH_COMPLETED:
            return {
                ...state,
                loading: false,
                metaResults: action.response
            };
        default:
            return state;
    }
};

export default boardItem;

export const getBoardItemQuery = (state) => state.query;