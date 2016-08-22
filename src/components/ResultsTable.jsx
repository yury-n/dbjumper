import 'styles/resultsTable.css';
import React, { Component, PropTypes } from 'react';

class ResultsTable extends Component {

    constructor(props) {
        super(props);

        this.handleTDClick = this.handleTDClick.bind(this);
        this.handleTHClick = this.handleTHClick.bind(this);
    }

    handleTDClick(event) {
        const { rows } = this.props;
    }

    handleTHClick() {

    }

    render() {
        const { rows } = this.props;

        if (!rows.length) {
            return null;
        }
        const columnNames = Object.keys(rows[0]);

        const ths = columnNames.map(
            (columnName, index) => (<th onClick={this.handleTHClick} key={index}>{columnName}</th>)
        );

        const trs = [];
        rows.forEach((row, rowIndex) => {
            let tds = [];
            columnNames.forEach((columnName, columnIndex) => {
                tds.push(<td onClick={this.handleTDClick} key={columnIndex}>{row[columnName]}</td>);
            });
            trs.push(<tr key={rowIndex}>{tds}</tr>);
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
    rows: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ResultsTable;