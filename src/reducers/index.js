import board from './board';
import tableList from './tableList';
import suggestionList, { getSuggestedItems } from './suggestionList';
import floatingQueryInput from './floatingQueryInput';


const rootReducer = (state = {}, action) => {

    const suggestionListNewState = suggestionList(state.suggestionList, action);
    const queryInputHasSuggestions = (getSuggestedItems(suggestionListNewState).length > 0);

    return {
        board: board(state.board, action),
        tableList: tableList(state.tableList, action),
        suggestionList: suggestionListNewState,
        floatingQueryInput: floatingQueryInput(state.floatingQueryInput, action),
        queryInputHasSuggestions
    };
};

export default rootReducer;

export const getTableList = (state) => state.tableList;
export const getBoard = (state) => state.board;
export const getSuggestionList = (state) => state.suggestionList;
export const getFloatingQueryInput = (state) => state.floatingQueryInput;
export const doesQueryInputHaveSuggestions = (state) => state.queryInputHasSuggestions;