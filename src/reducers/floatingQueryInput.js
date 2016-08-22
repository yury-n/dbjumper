import {
    CONNECTION_CREATE_FROM
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
    }

    return {
        visible,
        query,
        componentPosition
    };
};

export default floatingQueryInput;