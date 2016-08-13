import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const AddBoardItemButton = () => (
    <svg className="add-board-item-button" width="100px" height="100px" viewbox="0 0 100 100" x="0px" y="0px">
        <polygon points="80.2,51.6 51.4,51.6 51.4,22.6 48.9,22.6 48.9,51.6 19.9,51.6 19.9,54.1 48.9,54.1 48.9,83.1   51.4,83.1 51.4,54.1 80.4,54.1 80.4,51.6 "/>
    </svg>
);
AddBoardItemButton.propTypes = {
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(AddBoardItemButton);