import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getTableList } from '../reducers/';

const TableList = ({ tables }) => (
    <ul className="table-list">
        {tables.map((table, index) => (<li key={index} className="table-list__table">{table}</li>))}
    </ul>
);
TableList.propTypes = {
    tables: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
};

const mapStateToProps = (state) => ({
    tables: getTableList(state)
});

export default connect(mapStateToProps)(TableList);