import 'styles/boardItem.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import QueryInput from './QueryInput';
import CloseButton from './buttons/CloseButton';
import { removeBoardItem, changeQueryInput, focusQueryInput } from '../actions';
import { getBoard } from '../reducers/';
import { getBoardItem, getActiveBoardItemId } from '../reducers/board';

class BoardItem extends Component {

    render() {
        const {
            id, query, active,
            removeBoardItem,
            changeQueryInput, focusQueryInput
        } = this.props;
        return (
            <div className="board-item">
                <QueryInput onChangeHandler={({inputValue, inputBoundingRect}) => changeQueryInput(id, inputValue, inputBoundingRect)}
                            onFocusHandler={() => focusQueryInput(id)}
                            active={active}
                            query={query} />
                <CloseButton onClickHandler={() => { removeBoardItem(id) }} />
            </div>
        );
    }
}
BoardItem.propTypes = {
    id: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    removeBoardItem: PropTypes.func.isRequired,
    changeQueryInput: PropTypes.func.isRequired,
    focusQueryInput: PropTypes.func.isRequired
};

const mapStateToProps = (state, params) => {
    const board = getBoard(state);
    const activeBoardItemId = getActiveBoardItemId(board);
    return {
        ...getBoardItem(board, params.id),
        active: (activeBoardItemId === params.id)
    };
};

export default connect(
    mapStateToProps,
    {
        removeBoardItem,
        changeQueryInput,
        focusQueryInput
    }
)(BoardItem);