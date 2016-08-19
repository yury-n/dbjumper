import 'styles/board.css';
import React, { PropTypes } from 'react';
import BoardItem from './BoardItem';
import AddButton from './buttons/AddButton';
import SuggestionList from './SuggestionList';
import { addBoardItem } from '../actions';
import { connect } from 'react-redux';
import { getBoard } from '../reducers/';
import { getBoardItems, isAddButtonVisible } from '../reducers/board';

const Board = ({ boardItems, addButtonIsVisible, addBoardItem }) => (
    <div className="board">
        {boardItems.map(({id}) => (
            <BoardItem id={id} key={id} />
        ))}
        <SuggestionList />
        {addButtonIsVisible ? <AddButton onClickHandler={addBoardItem} /> : null}
    </div>
);
Board.propTypes = {
    boardItems: PropTypes.array.isRequired,
    addBoardItem: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    boardItems: getBoardItems(getBoard(state)),
    addButtonIsVisible: isAddButtonVisible(getBoard(state))
});

export default connect(mapStateToProps, {addBoardItem})(Board);