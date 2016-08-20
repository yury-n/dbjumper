import tableList from './tableList';
import suggestionList from './suggestionList';
import board from './board';
import { getSuggestedItems } from './suggestionList';

const rootReducer = (state = {}, action) => {

    const suggestionListNewState = suggestionList(state.suggestionList, action);
    const queryInputHasSuggestions = (getSuggestedItems(suggestionListNewState).length > 0);

    return {
        board: board(state.board, action),
        tableList: tableList(state.tableList, action),
        suggestionList: suggestionListNewState,
        queryInputHasSuggestions
    };
};

export default rootReducer;

export const getTableList = (state) => state.tableList;
export const getBoard = (state) => state.board;
export const getSuggestionList = (state) => state.suggestionList;
export const doesQueryInputHaveSuggestions = (state) => state.queryInputHasSuggestions;