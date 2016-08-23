import {
    CONNECTION_CREATE_FROM,
    CONNECTION_CREATE_CANCEL,
    QUERY_INPUT_CHANGE,
    QUERY_INPUT_COMMIT,
    SUGGESTIONS_USE
} from '../actions';

const componentPositionReducer = (state = {top: 0, left: 0}, action) => {
    switch (action.type) {
        case CONNECTION_CREATE_FROM:
            const { boundingRect } = action;
            return {
                left: boundingRect.right,
                top: boundingRect.top
            };
        default:
            return state;
    }
};

const floatingQueryInput = (state = {}, action) => {

    let visible = state.visible || false;
    let query = state.query || '';
    const componentPosition = componentPositionReducer(state.componentPosition, action);


    switch (action.type) {
        case CONNECTION_CREATE_FROM:
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
            }
            break;
    }

    return {
        visible,
        query,
        componentPosition
    };
};

export default floatingQueryInput;