import React, { Component, PropTypes } from 'react';
import QueryInput from './QueryInput';

class BoardItem extends Component {

    render() {
        return (
            <div className="board-item">
                <QueryInput />
            </div>
        );
    }
}

export default BoardItem;