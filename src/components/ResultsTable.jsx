import React from 'react';

const ResultsTable = () => (
    <table className="results-table">
        <thead>
        <tr>
            <th>userid</th>
            <th>username</th>
            <th>date_of_birth</th>
            <th>experience_points</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>3</td>
            <td>chris</td>
            <td>1980-03-12</td>
            <td>546</td>
        </tr>
        <tr>
            <td>1544341</td>
            <td>yury</td>
            <td>1989-03-08</td>
            <td>10</td>
        </tr>
        <tr>
            <td>175846</td>
            <td>artbit</td>
            <td>1988-07-10</td>
            <td>385</td>
        </tr>
        </tbody>
    </table>
);

export default ResultsTable;