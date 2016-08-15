import React, { PropTypes } from 'react';
import BoardItem from './BoardItem';
import AddButton from './buttons/AddButton';
import { addBoardItem } from '../actions';
import { connect } from 'react-redux';
import { getBoard } from '../reducers/';
import { getBoardItems } from '../reducers/board';

const Board = ({ boardItems, addBoardItem }) => (
    <div className="board">
        {boardItems.map(({id}) => (
            <BoardItem id={id} key={id} />
        ))}
        <AddButton onClickHandler={addBoardItem} />
    </div>
);
Board.propTypes = {
    boardItems: PropTypes.array.isRequired,
    addBoardItem: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    boardItems: getBoardItems(getBoard(state))
});

export default connect(mapStateToProps, {addBoardItem})(Board);