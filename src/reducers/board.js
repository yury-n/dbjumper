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
        case 'FETCH_TABLE_DATA_SUCCESS':
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
            return (action.activate ? action.id : -1);
        case 'FOCUS_QUERY_INPUT':
        case 'CHANGE_QUERY_INPUT':
            return action.boardItemId;
        case 'COMMIT_QUERY_INPUT':
            return -1;
        default:
            return state;
    }
};

const addButtonIsVisible = (state = false, action) => {
    switch (action.type) {
        case 'REMOVE_BOARD_ITEM':
        case 'FETCH_TABLE_DATA_SUCCESS':
            return true;
        default:
            return state;
    }
};

const board = (state = {}, action) => {

    let newState = {
        boardItems: boardItems(state.boardItems, action),
        activeQueryBoardItemId: activeBoardItemId(state.activeQueryBoardItemId, action),
        addButtonIsVisible: addButtonIsVisible(state.addButtonIsVisible, action)
    };
    switch (action.type) {
        case 'USE_SUGGESTION':
            newState.boardItems = newState.boardItems.map(item => {
                const { suggestion, forQueryPart } = action;
                const [ forQueryPartStart, forQueryPartEnd ] = forQueryPart;
                if (item.id == newState.activeQueryBoardItemId) {
                    item.query = item.query.slice(0, forQueryPartStart) +
                                 suggestion +
                                 item.query.slice(forQueryPartEnd, item.query.length);
                    item.isQueryActive = true;
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
export const getActiveQueryBoardItemId = (state) => state.activeQueryBoardItemId;
export const isAddButtonVisible = (state) => state.addButtonIsVisible;