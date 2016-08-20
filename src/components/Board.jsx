import 'styles/board.css';
import React, { Component, PropTypes } from 'react';
import BoardItem from './BoardItem';
import AddButton from './buttons/AddButton';
import SuggestionList from './SuggestionList';
import { addBoardItem } from '../actions';
import { connect } from 'react-redux';
import { getBoard, doesQueryInputHaveSuggestions } from '../reducers/';
import { getBoardItems, isAddButtonVisible } from '../reducers/board';

class Board extends Component{

    componentWillMount() {
        this.handleKeydown = this.handleKeydown.bind(this);
        window.addEventListener('keydown', this.handleKeydown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeydown);
    }

    handleKeydown(event) {

        const { addBoardItem, inputQueryHasSuggestions } = this.props;

        if (event.keyCode == '9' // tab
                && !event.shiftKey
                && !inputQueryHasSuggestions) {

            addBoardItem();
            event.preventDefault();
        }
    }

    render() {
        const { boardItems, addButtonIsVisible, addBoardItem } = this.props;

        return (
            <div className="board">
                {boardItems.map(({id}) => (
                    <BoardItem id={id} key={id} />
                ))}
                <SuggestionList />
                {addButtonIsVisible ? <AddButton onClickHandler={addBoardItem} /> : null}
            </div>
        );
    }
}
Board.propTypes = {
    boardItems: PropTypes.array.isRequired,
    addBoardItem: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    boardItems: getBoardItems(getBoard(state)),
    addButtonIsVisible: isAddButtonVisible(getBoard(state)),
    inputQueryHasSuggestions: doesQueryInputHaveSuggestions(state)
});

export default connect(mapStateToProps, {addBoardItem})(Board);