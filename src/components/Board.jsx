import React from 'react';

const Board = () => (
    <div className="board">
        <div className="board-item">
            <input type="text" className="query-input query-input--active" autoFocus autoComplete="false" spellCheck="false" />
        </div>
    </div>
);

export default Board;