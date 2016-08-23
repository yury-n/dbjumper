import 'styles/resultsTable.css';
import React, { Component, PropTypes } from 'react';
import { getIndexInParent } from '../utils';

class ResultsTable extends Component {

    constructor(props) {
        super(props);

        this.getTDColor = this.getTDColor.bind(this);
        this.getTHColor = this.getTHColor.bind(this);
        this.handleCellRightClick = this.handleCellRightClick.bind(this);
    }

    getTHColor(columnName) {
        const { highlightedElems, rows } = this.props;
        const highlightedElem = highlightedElems.find(
            hElem => (hElem.columnName == columnName
                        // highlight column th if all values in it are involved
                        && hElem.values.length == rows.length
                        && rows.length > 1)
        );
        return highlightedElem ? highlightedElem.color : null;
    }

    getTDColor(columnName, value) {
        const { highlightedElems } = this.props;
        const highlightedElem = highlightedElems.find(
            hElem => (hElem.columnName == columnName && hElem.values.includes(value))
        );
        return highlightedElem ? highlightedElem.color : null;
    }

    handleCellRightClick(event) {
        const { onCellClick, rows } = this.props;
        const cell = event.target;
        const boundingRect = cell.getBoundingClientRect();
        const columnIndex = getIndexInParent(cell);
        const columnName = Object.keys(rows[0])[columnIndex];
        const values = [];
        if (cell.tagName == 'TH') {
            rows.forEach(row => values.push(row[columnName].toString()));
        } else {
            values.push(cell.innerText);
        }

        onCellClick({
            columnName,
            values,
            boundingRect
        });
        event.preventDefault();
    }

    render() {
        const { rows } = this.props;

        if (!rows.length) {
            return null;
        }
        const columnNames = Object.keys(rows[0]);

        const ths = columnNames.map(
            (columnName, columnIndex) => (
                <th onContextMenu={this.handleCellRightClick}
                    key={columnIndex}
                    style={{backgroundColor: this.getTHColor(columnName)}}>
                    {columnName}
                </th>
            )
        );

        const trs = [];
        rows.forEach((row, trIndex) => {
            let tds = [];
            columnNames.forEach((columnName, columnIndex) => {
                const value = row[columnName].toString();
                const cellColor = this.getTDColor(columnName, value);
                const tdStyle = cellColor ? {backgroundColor: cellColor} : {};
                const className = cellColor ? 'noselect' : '';
                tds.push(
                    <td onContextMenu={this.handleCellRightClick}
                        key={columnIndex}
                        className={className}
                        style={tdStyle}>
                        {row[columnName]}
                    </td>
                );
            });
            trs.push(<tr key={trIndex}>{tds}</tr>);
        });

        return (
            <table className="results-table">
                <thead>
                    <tr>
                        {ths}
                    </tr>
                </thead>
                <tbody>
                    {trs}
                </tbody>
            </table>
        );
    }
}
ResultsTable.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCellClick: PropTypes.func.isRequired,
    highlightedElems: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        columnName: PropTypes.string.isRequired,
        values: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
    }))
};

export default ResultsTable;