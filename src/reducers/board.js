import boardItem from './boardItem';

const boardItems = (state = [], action) => {

    let boardItemIndex;
    const findBoardItemIndex = (id) => state.findIndex(item => item.id === id);

    switch (action.type) {
        case 'ADD_BOARD_ITEM':
            if (action.clearBoard) {
                return [boardItem(undefined, action)];
            }
            return [
                ...state,
                boardItem(undefined, action)
            ];
        case 'REMOVE_BOARD_ITEM':
            boardItemIndex = findBoardItemIndex(action.id);
            return [
                ...state.slice(0, boardItemIndex),
                ...state.slice(boardItemIndex + 1, state.length)
            ];
        case 'CHANGE_QUERY_INPUT':
            boardItemIndex = findBoardItemIndex(action.boardItemId);
            let newState = [...state];
            newState[boardItemIndex] = boardItem(state[boardItemIndex], action);
            return newState;
        default:
            return state;
    }
};

const activeBoardItemId = (state = -1, action) => {

    switch (action.type) {
        case 'ADD_BOARD_ITEM':
            return action.id;
        case 'FOCUS_QUERY_INPUT':
            return action.boardItemId;
        case 'BLUR_QUERY_INPUT':
            return -1;
        default:
            return state;
    }
};

const board = (state = {}, action) => {

    let newState = {
        boardItems: boardItems(state.boardItems, action),
        activeBoardItemId: activeBoardItemId(state.activeBoardItemId, action)
    };
    switch (action.type) {
        case 'USE_SUGGESTION':
            newState.boardItems = newState.boardItems.map(item => {
                if (item.id == newState.activeBoardItemId) {
                    item.query = action.suggestion;
                    item.active = true;
                }
                return item;
            });
            return newState;
        default:
            return newState;
    }
};

export default board;

export const getBoardItems = (state) => state.boardItems;
export const getBoardItem = (state, id) => state.boardItems.find(item => item.id === id);
export const getActiveBoardItemId = (state) => state.activeBoardItemId;