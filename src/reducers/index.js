import { combineReducers } from 'redux';
import tableList from './tableList';
import suggestionList from './suggestionList';
import board from './board';

const rootReducer = combineReducers({
    board,
    tableList,
    suggestionList
});

export default rootReducer;

export const getTableList = (state) => state.tableList;
export const getBoard = (state) => state.board;
export const getSuggestionList = (state) => state.suggestionList;