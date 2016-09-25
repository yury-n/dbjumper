import {
    CONNECTION_CREATE_FROM,
    CONNECTION_CREATE_CANCEL,
    QUERY_INPUT_CHANGE,
    QUERY_INPUT_COMMIT,
    SUGGESTIONS_USE
} from '../actions';

const floatingQueryInput = (state = {}, action) => {

    let visible = state.visible || false;
    let query = state.query || '';
    let targetBoundingRect = state.targetBoundingRect || {};

    switch (action.type) {
        case CONNECTION_CREATE_FROM:
            targetBoundingRect = action.boundingRect;
            visible = true;
            break;
        case CONNECTION_CREATE_CANCEL:
        case QUERY_INPUT_COMMIT:
            visible = false;
            query = '';
            break;
        case QUERY_INPUT_CHANGE:
            if (action.boardItemId === null) {
                query = action.query;
            }
            break;
        case SUGGESTIONS_USE:
            if (visible) {
                const { suggestion, forQueryPart } = action;
                const [ forQueryPartStart, forQueryPartEnd ] = forQueryPart;
                query = query.slice(0, forQueryPartStart) +
                        suggestion +
                        query.slice(forQueryPartEnd, query.length);
                // append '.' cause just tablename is useless in this context
                // we need to select a column to create a connection with
                if (!query.includes('.')) {
                    query += '.';
                }
            }
            break;
    }

    return {
        visible,
        query,
        targetBoundingRect
    };
};

export default floatingQueryInput;