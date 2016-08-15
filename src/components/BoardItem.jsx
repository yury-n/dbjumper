import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import QueryInput from './QueryInput';
import CloseButton from './buttons/CloseButton';
import { removeBoardItem, changeQueryInput } from '../actions';
import { getBoard } from '../reducers/';
import { getBoardItem } from '../reducers/board';

class BoardItem extends Component {

    render() {
        const { id, query, removeBoardItem, changeQueryInput } = this.props;
        return (
            <div className="board-item">
                <QueryInput onChangeHandler={(query) => changeQueryInput(id, query)} query={query} />
                <CloseButton onClickHandler={() => { removeBoardItem(id) }} />
            </div>
        );
    }
}
BoardItem.propTypes = {
    id: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    removeBoardItem: PropTypes.func.isRequired,
    changeQueryInput: PropTypes.func.isRequired
};

const mapStateToProps = (state, params) => {
    return getBoardItem(getBoard(state), params.id);
};

export default connect(mapStateToProps, {removeBoardItem, changeQueryInput})(BoardItem);