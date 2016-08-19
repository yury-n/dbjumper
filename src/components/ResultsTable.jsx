import 'styles/resultsTable.css';
import React from 'react';

const ResultsTable = ({ results }) => {

    if (!results.length) {
        return null;
    }
    const columnNames = Object.keys(results[0]);

    const ths = columnNames.map((columnName, index) => (<th key={index}>{columnName}</th>));

    const trs = [];
    results.forEach((row, rowIndex) => {
        let tds = [];
        columnNames.forEach((columnName, columnIndex) => {
            tds.push(<td key={columnIndex}>{row[columnName]}</td>);
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
};

export default ResultsTable;