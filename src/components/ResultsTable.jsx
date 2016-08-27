import 'styles/resultsTable.css';
import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import classnames from 'classnames';
import { getIndexInParent } from '../utils';

class ResultsTable extends Component {

    mousePointingColumnIndex = null;

    shouldComponentUpdate = shouldPureComponentUpdate;

    constructor(props) {
        super(props);

        this.state = {
            expandedTDs: [],
            columnIndexMarkedForRemoval: null
        };

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

    isTDExpanded(rowIndex, columnIndex) {
        const { expandedTDs } = this.state;
        return !!expandedTDs.find(expanded => expanded.columnIndex === columnIndex
                                              && expanded.rowIndex === rowIndex);
    }
    
    getTDColor(columnName, value) {
        const { highlightedElems } = this.props;
        const highlightedElem = highlightedElems.find(
            hElem => (hElem.columnName == columnName && hElem.values.includes(value))
        );
        return highlightedElem ? highlightedElem.color : null;
    }

    handleKeyup() {
        this.setState({columnIndexMarkedForRemoval: null});
    }

    handleKeydown(event) {
        if (this.mousePointingColumnIndex && event.altKey) {
            this.setState({columnIndexMarkedForRemoval: this.mousePointingColumnIndex});
        }
    }

    handleMouseMove(event) {
        const cell = event.target;
        const columnIndex = getIndexInParent(cell);
        this.mousePointingColumnIndex = columnIndex;
        if (event.altKey) {
            this.setState({columnIndexMarkedForRemoval: columnIndex});
        } else {
            this.setState({columnIndexMarkedForRemoval: null});
        }
    }

    handleMouseLeave() {
        this.setState({columnIndexMarkedForRemoval: null});
    }

    handleCellClick(event) {
        if (event.altKey) {
            const { columnIndexMarkedForRemoval } = this.state;
            const { columnRemovalHandler, rows } = this.props;
            this.setState({columnIndexMarkedForRemoval: null});
            const columnNames = Object.keys(rows[0]);
            const columnToRemove = columnNames[columnIndexMarkedForRemoval];
            columnRemovalHandler(columnToRemove);
            event.preventDefault();
            return;
        }
        if (event.metaKey || event.ctrlKey) {
            this.handleCellSelectionClick(event);
            return;
        }
        const { expandedTDs } = this.state;
        const cell = event.target;
        const columnIndex = getIndexInParent(cell);
        const rowIndex = getIndexInParent(cell.parentNode);
        expandedTDs.push({columnIndex, rowIndex});
        this.setState({expandedTDs});
    }

    handleCellSelectionClick(event) {
        const { onCellSelectionClick, rows } = this.props;
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

        onCellSelectionClick({
            columnName,
            values,
            boundingRect
        });
        event.preventDefault();
    }

    render() {
        const { columnIndexMarkedForRemoval } = this.state;
        const { rows } = this.props;

        if (!rows.length) {
            return null;
        }
        const columnNames = Object.keys(rows[0]);

        const ths = columnNames.map(
            (columnName, columnIndex) => (
                <th key={columnIndex}
                    style={{backgroundColor: this.getTHColor(columnName)}}
                    className={classnames({
                        semitransparent: columnIndex === columnIndexMarkedForRemoval
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
                            expanded: this.isTDExpanded(rowIndex, columnIndex),
                            semitransparent: columnIndex === columnIndexMarkedForRemoval
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
    highlightedElems: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        columnName: PropTypes.string.isRequired,
        values: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
    })),
    onCellSelectionClick: PropTypes.func.isRequired,
    columnRemovalHandler: PropTypes.func.isRequired
};

export default ResultsTable;