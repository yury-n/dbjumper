import { combineReducers } from 'redux';
import tableList from './tableList';

const rootReducer = combineReducers({
    tableList
});

export default rootReducer;

export const getTableList = (state) => state.tableList;