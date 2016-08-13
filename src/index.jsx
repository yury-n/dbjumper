import 'styles/main.css';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';
import configureStore from './configureStore';
import * as actions from './actions';

const store = configureStore();

store.dispatch(actions.fetchTableList());
store.dispatch(actions.addBoardItem());

render(
    <Root store={store} />,
    document.getElementById('root')
);