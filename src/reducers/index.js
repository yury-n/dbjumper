import { combineReducers } from 'redux';
import tableList from './tableList';
import board from './board';

const rootReducer = combineReducers({
    tableList,
    board
});

export default rootReducer;

export const getTableList = (state) => state.tableList;
export const getBoard = (state) => state.board;