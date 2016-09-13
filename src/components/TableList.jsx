import 'styles/tableList.css';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// selectors
import { getTableList } from '../reducers/';

const TableList = ({ tables, onTableSelect }) => (
    <ul className="table-list">
        {tables.map((table, index) => (
            <li key={index}
                className="table-list__table"
                onClick={() => {
                    onTableSelect(table)
                }}>
                {table}
            </li>
        ))}
    </ul>
);
TableList.propTypes = {
    tables: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onTableSelect: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    tables: getTableList(state)
});

export default connect(mapStateToProps)(TableList);
