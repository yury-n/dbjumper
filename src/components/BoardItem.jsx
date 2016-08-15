import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import QueryInput from './QueryInput';
import CloseButton from './buttons/CloseButton';
import { removeBoardItem } from '../actions';
import { getBoard } from '../reducers/';
import { getBoardItem } from '../reducers/board';

class BoardItem extends Component {

    render() {
        const { id, query, removeBoardItem } = this.props;
        return (
            <div className="board-item">
                <QueryInput query={query} />
                <CloseButton onClickHandler={() => { removeBoardItem(id) }} />
            </div>
        );
    }
}
BoardItem.propTypes = {
    id: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    removeBoardItem: PropTypes.func.isRequired
};

const mapStateToProps = (state, params) => {
    return getBoardItem(getBoard(state), params.id);
};

export default connect(mapStateToProps, {removeBoardItem})(BoardItem);