import 'styles/sidebar.css';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import TableList from './TableList';
// actions
import { selectTableFromSidebar } from '../actions';

const Sidebar = ({ selectTableFromSidebar }) => (
    <div className="sidebar">
        <a href="/" className="sidebar__header">dbjumper</a>
        <div className="sidebar__content">
            <TableList onTableSelect={selectTableFromSidebar} />
        </div>
    </div>
);
Sidebar.propTypes = {
    selectTableFromSidebar: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {selectTableFromSidebar})(Sidebar);
