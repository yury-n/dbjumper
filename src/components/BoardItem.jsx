import 'styles/boardItem.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import QueryInput from './QueryInput';
import CloseButton from './buttons/CloseButton';
import ResultsTable from './ResultsTable';
import {
    removeBoardItem,
    changeQueryInput, focusQueryInput, commitQueryInput,
    createConnectionFrom
} from '../actions';
import { getBoard, getConnections } from '../reducers/';
import { getBoardItem, getActiveQueryBoardItemId } from '../reducers/board';
import { getConnectedElemsForBoardItem } from '../reducers/connections';

class BoardItem extends Component {

    render() {
        const {
            id, query, isQueryActive, results, connectedElems,
            removeBoardItem,
            changeQueryInput, focusQueryInput, commitQueryInput,
            createConnectionFrom
        } = this.props;

        return (
            <div className="board-item">
                <QueryInput onChangeHandler={({inputValue, inputBoundingRect, cursorPosition}) => changeQueryInput(id, inputValue, inputBoundingRect, cursorPosition)}
                            onClickHandler={() => {if (!isQueryActive) focusQueryInput(id)}}
                            onCommitHandler={(query) => commitQueryInput(id, query)}
                            active={isQueryActive}
                            query={query} />
                <CloseButton onClickHandler={() => removeBoardItem(id)} />
                <ResultsTable rows={results}
                              highlightedElems={connectedElems}
                              onCellClick={(cellData) => createConnectionFrom(id, cellData)} />
            </div>
        );
    }
}
BoardItem.propTypes = {
    id: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    isQueryActive: PropTypes.bool.isRequired,
    results: PropTypes.array.isRequired,
    connectedElems: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        columnIndex: PropTypes.number,
        rowIndex: PropTypes.number
    })),

    removeBoardItem: PropTypes.func.isRequired,
    changeQueryInput: PropTypes.func.isRequired,
    focusQueryInput: PropTypes.func.isRequired,
    commitQueryInput: PropTypes.func.isRequired
};

const mapStateToProps = (state, params) => {
    const board = getBoard(state);
    const activeQueryBoardItemId = getActiveQueryBoardItemId(board);
    const boardItemId = params.id;
    const connections = getConnections(state);
    console.log('connections', connections);
    console.log('connectedItems', getConnectedElemsForBoardItem(connections, boardItemId));
    return {
        ...getBoardItem(board, boardItemId),
        isQueryActive: (activeQueryBoardItemId === boardItemId),
        connectedElems: getConnectedElemsForBoardItem(connections, boardItemId)
    };
};

export default connect(
    mapStateToProps,
    {
        removeBoardItem,
        changeQueryInput, focusQueryInput, commitQueryInput,
        createConnectionFrom
    }
)(BoardItem);