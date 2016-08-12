import React, { PropTypes } from 'react';
import BoardItem from './BoardItem';
import { connect } from 'react-redux';
import { getBoard } from '../reducers/';
import { getBoardItems } from '../reducers/board';

const Board = ({ boardItems }) => (
    <div className="board">
        {boardItems.map(boardItem => (<BoardItem key={boardItem.id} />))}
    </div>
);
Board.propTypes = {
    boardItems: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
    boardItems: getBoardItems(getBoard(state))
});

export default connect(mapStateToProps)(Board);