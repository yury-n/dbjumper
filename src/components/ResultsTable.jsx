import 'styles/resultsTable.css';
import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import classnames from 'classnames';
import { getIndexInParent } from '../utils';

class ResultsTable extends Component {

    mousePointingColumn = null;

    shouldComponentUpdate = shouldPureComponentUpdate;

    constructor(props) {
        super(props);

        this.state = {
            expandedTDs: [],
            previewHiddenColumn: null,
            hiddenColumns: []
        };

        this.isColumnHidden = this.isColumnHidden.bind(this);
        this.isTDExpanded = this.isTDExpanded.bind(this);
        this.getTDColor = this.getTDColor.bind(this);
        this.getTHColor = this.getTHColor.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleCellSelectionClick = this.handleCellSelectionClick.bind(this);
    }

    componentWillMount() {
        window.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('keyup', this.handleKeyup);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('keyup', this.handleKeyup);
    }

    handleKeyup() {
        this.setState({previewHiddenColumn: null});
    }

    handleKeydown(event) {
        if (this.mousePointingColumn && event.altKey) {
            this.setState({previewHiddenColumn: this.mousePointingColumn});
        }
    }

    getColumnNames() {
        const { rows } = this.props;
        return Object.keys(rows[0])
                     .filter(
                        (columnName) =>
                            !this.isColumnHidden(columnName));
    }

    getColumnNameForCell(cell) {
        const columnIndex = getIndexInParent(cell);
        const columnNames = this.getColumnNames();
        return columnNames[columnIndex];
    }

    handleMouseMove(event) {
        const cell = event.target;
        const columnName = this.getColumnNameForCell(cell);

        this.mousePointingColumn = columnName;
        if (event.altKey) {
            this.setState({previewHiddenColumn: columnName});
        } else {
            this.setState({previewHiddenColumn: null});
        }
    }

    handleMouseLeave() {
        this.setState({previewHiddenColumn: null});
    }

    handleCellClick(event) {
        const cell = event.target;
        const columnName = this.getColumnNameForCell(cell);
        const rowIndex = getIndexInParent(cell.parentNode);

        if (event.altKey) {
            // remove
            const { hiddenColumns } = this.state;
            this.setState({hiddenColumns: [...hiddenColumns, columnName]});
        } else if (event.metaKey || event.ctrlKey) {
            // select
            this.handleCellSelectionClick(event);
        } else {
            // expand
            const { expandedTDs } = this.state;
            this.setState({expandedTDs: [...expandedTDs, {columnName, rowIndex}]});
        }
    }

    handleCellSelectionClick(event) {
        const { onCellSelectionClick, rows } = this.props;
        const cell = event.target;
        const columnName = this.getColumnNameForCell(cell);
        const boundingRect = cell.getBoundingClientRect();
        const values = [];
        if (cell.tagName == 'TH') {
            rows.forEach(row => values.push(row[columnName].toString()));
        } else {
            values.push(cell.innerText);
        }

        onCellSelectionClick({
            columnName,
            values,
            boundingRect
        });
        event.preventDefault();
    }

    isColumnHidden(columnName) {
        const { hiddenColumns } = this.state;
        return hiddenColumns.includes(columnName);
    }

    isTDExpanded(columnName, rowIndex) {
        const { expandedTDs } = this.state;
        return !! expandedTDs.find(expanded =>
                        expanded.columnName === columnName
                        && expanded.rowIndex === rowIndex
        );
    }

    getTDColor(columnName, value) {
        const { highlightedElems } = this.props;
        const highlightedElem = highlightedElems.find(
            hElem => (hElem.columnName == columnName
                        && (!hElem.values.length || hElem.values.includes(value)))
        );
        return highlightedElem ? highlightedElem.color : null;
    }

    getTHColor(columnName) {
        const { highlightedElems, rows } = this.props;
        const highlightedElem = highlightedElems.find(
            hElem => (
                hElem.columnName == columnName
                // highlight column th if all values in it are involved
                // or values field is empty
                && (!hElem.values.length || hElem.values.length == rows.length)
                && rows.length > 1
            )
        );
        return highlightedElem ? highlightedElem.color : null;
    }

    render() {
        const { rows } = this.props;
        const { previewHiddenColumn } = this.state;

        if (!rows.length) {
            return null;
        }
        const columnNames = this.getColumnNames();

        const ths = columnNames.map(
            (columnName, columnIndex) => (
                <th key={columnIndex}
                    style={{backgroundColor: this.getTHColor(columnName)}}
                    className={classnames({
                        semitransparent: columnName === previewHiddenColumn
                    })}>
                    {columnName}
                </th>
            )
        );

        const trs = [];
        rows.forEach((row, rowIndex) => {
            let tds = [];
            columnNames.forEach((columnName, columnIndex) => {
                const value = row[columnName] !== null ? row[columnName].toString() : 'null' ;
                const cellColor = this.getTDColor(columnName, value);
                const tdStyle = cellColor ? {backgroundColor: cellColor} : {};
                tds.push(
                    <td key={columnIndex}
                        style={tdStyle}
                        className={classnames({
                            noselect: cellColor !== null,
                            expanded: this.isTDExpanded(columnName, rowIndex),
                            semitransparent: columnName === previewHiddenColumn
                        })}>
                        {row[columnName]}
                    </td>
                );
            });
            trs.push(<tr key={rowIndex}>{tds}</tr>);
        });

        return (
            <table className="results-table"
                   onMouseMove={this.handleMouseMove}
                   onMouseLeave={this.handleMouseLeave}
                   onClick={this.handleCellClick}>
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
    hiddenColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    highlightedElems: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        columnName: PropTypes.string.isRequired,
        values: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
    })),
    onCellSelectionClick: PropTypes.func.isRequired
};

export default ResultsTable;