import 'styles/boardItem.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import QueryInput from './QueryInput';
import CloseButton from './buttons/CloseButton';
import ResultsTable from './ResultsTable';
import { removeBoardItem, changeQueryInput, focusQueryInput, commitQueryInput } from '../actions';
import { getBoard } from '../reducers/';
import { getBoardItem, getActiveQueryBoardItemId } from '../reducers/board';

class BoardItem extends Component {

    render() {
        const {
            id, query, isQueryActive, results,
            removeBoardItem, changeQueryInput, focusQueryInput, commitQueryInput
        } = this.props;

        return (
            <div className="board-item">
                <QueryInput onChangeHandler={({inputValue, inputBoundingRect, cursorPosition}) => changeQueryInput(id, inputValue, inputBoundingRect, cursorPosition)}
                            onClickHandler={() => {if (!isQueryActive) focusQueryInput(id)}}
                            onCommitHandler={(query) => commitQueryInput(id, query)}
                            active={isQueryActive}
                            query={query} />
                <CloseButton onClickHandler={() => { removeBoardItem(id) }} />
                <ResultsTable results={results} />
            </div>
        );
    }
}
BoardItem.propTypes = {
    id: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    isQueryActive: PropTypes.bool.isRequired,
    results: PropTypes.array.isRequired,
    removeBoardItem: PropTypes.func.isRequired,
    changeQueryInput: PropTypes.func.isRequired,
    focusQueryInput: PropTypes.func.isRequired,
    commitQueryInput: PropTypes.func.isRequired
};

const mapStateToProps = (state, params) => {
    const board = getBoard(state);
    const activeQueryBoardItemId = getActiveQueryBoardItemId(board);
    return {
        ...getBoardItem(board, params.id),
        isQueryActive: (activeQueryBoardItemId === params.id)
    };
};

export default connect(
    mapStateToProps,
    {
        removeBoardItem,
        changeQueryInput,
        focusQueryInput,
        commitQueryInput
    }
)(BoardItem);