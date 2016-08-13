import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import QueryInput from './QueryInput';
import { getBoard } from '../reducers/';
import { getBoardItem } from '../reducers/board';

class BoardItem extends Component {

    render() {
        const { query } = this.props;
        return (
            <div className="board-item">
                <QueryInput query={query} />
            </div>
        );
    }
}
BoardItem.propTypes = {
    id: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired
};

const mapStateToProps = (state, params) => {
    return getBoardItem(getBoard(state), params.id);
};

export default connect(mapStateToProps)(BoardItem);