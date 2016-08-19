import tableList from './tableList';
import suggestionList from './suggestionList';
import board from './board';
import { getSuggestedItems } from './suggestionList';

const rootReducer = (state = {}, action) => {

    const suggestionListNewState = suggestionList(state.suggestionList, action);
    // a query is committed with Enter
    // when there're suggestions hitting Enter should use a suggestion instead of
    // committing the query
    const queryInputIsCommittable = (getSuggestedItems(suggestionListNewState).length == 0);
    //const queryInputHasSuggestions

    return {
        board: board(state.board, action),
        tableList: tableList(state.tableList, action),
        suggestionList: suggestionListNewState,
        queryInputIsCommittable
    };
};

export default rootReducer;

export const getTableList = (state) => state.tableList;
export const getBoard = (state) => state.board;
export const getSuggestionList = (state) => state.suggestionList;
export const isQueryInputCommittable = (state) => state.queryInputIsCommittable;