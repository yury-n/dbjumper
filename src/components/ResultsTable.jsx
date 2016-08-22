import 'styles/resultsTable.css';
import React, { Component, PropTypes } from 'react';
import { getIndexInParent } from '../utils';

class ResultsTable extends Component {

    constructor(props) {
        super(props);

        this.getCellColor = this.getCellColor.bind(this);
        this.handleCellRightClick = this.handleCellRightClick.bind(this);
    }

    getCellColor(rowIndex, columnIndex) {
        const { highlightedElems } = this.props;
        const highlightedElem = highlightedElems.find(
            hElem => (hElem.rowIndex == rowIndex && hElem.columnIndex == columnIndex)
                        // hightlighted TH means highlighted whole column
                        || (hElem.rowIndex == 0 && hElem.columnIndex == columnIndex)
        );
        if (highlightedElem) {
            return highlightedElem.color;
        } else {
            return null;
        }
    }

    handleCellRightClick(event) {
        const { onCellClick } = this.props;
        const cell = event.target;
        const cellTR = cell.parentNode;
        const boundingRect = cell.getBoundingClientRect();
        const columnIndex = getIndexInParent(cell);
        // row index in the table as a whole
        // if current tr is in tbody add +1 -- first row is in thead
        const rowIndex = getIndexInParent(cellTR) + (cellTR.parentNode.tagName == 'TBODY' ? 1 : 0);

        onCellClick({
            columnIndex,
            rowIndex,
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
                    style={{backgroundColor: this.getCellColor(0, columnIndex)}}>
                    {columnName}
                </th>
            )
        );

        const trs = [];
        rows.forEach((row, trIndex) => {
            let tds = [];
            columnNames.forEach((columnName, columnIndex) => {
                const rowIndex = trIndex + 1; // first row is in thead
                const cellColor = this.getCellColor(rowIndex, columnIndex);
                const className = cellColor ? 'noselect' : '';
                const tdStyle = cellColor ? {backgroundColor: cellColor} : {};
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
        columnIndex: PropTypes.number,
        rowIndex: PropTypes.number
    }))
};

export default ResultsTable;