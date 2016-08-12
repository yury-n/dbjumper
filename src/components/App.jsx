import React from 'react';
import Sidebar from './Sidebar';
import TableList from './TableList';
import Board from './Board';

const App = () => (
    <div>
        <Sidebar>
            <TableList />
        </Sidebar>
        <Board />
    </div>
);

export default App;