import { combineReducers } from 'redux';
import board from './board';
import tableList from './tableList';
import suggestionList, { getSuggestedItems } from './suggestionList';
import floatingQueryInput from './floatingQueryInput';
import connections from './connections';

const rootReducer = combineReducers({
    board,
    tableList,
    suggestionList,
    floatingQueryInput,
    connections
});

export default rootReducer;

export const getTableList = (state) => state.tableList;
export const getBoard = (state) => state.board;
export const getSuggestionList = (state) => state.suggestionList;
export const getFloatingQueryInput = (state) => state.floatingQueryInput;
export const getConnections = (state) => state.connections;
export const doesQueryInputHaveSuggestions = (state) => getSuggestedItems(getSuggestionList(state)).length > 0;