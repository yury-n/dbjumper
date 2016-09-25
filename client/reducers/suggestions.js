import {
    QUERY_INPUT_CHANGE,
    SUGGESTIONS_HIDE,
    SUGGESTIONS_USE
} from '../actions';

import { findNearestQuerySeparator, findNearestOccurrence } from '../utils';

const _emptyState = () => {
    return {'items': [], 'separatorIndex': -1};
};

const _ifNotOneExactMatchToInput = (input, suggestionsState) => {
    if (suggestionsState.items.length === 1 && input === suggestionsState.items[0]) {
        // there is no reason to suggest something that's already been fully typed in
        return _emptyState();
    } else {
        return suggestionsState;
    }
};

const suggestionsReducer = (suggestionsState = {'items': [], 'separatorIndex': -1}, suggestionSourceState = [], action) => {

    switch (action.type) {
        case SUGGESTIONS_HIDE:
        case SUGGESTIONS_USE:
            return _emptyState();

        case QUERY_INPUT_CHANGE: {
            const {query, cursorPosition} = action;

            const separatorLeft = findNearestQuerySeparator(query, cursorPosition, 'left');
            const separatorRight = findNearestQuerySeparator(query, cursorPosition, 'right');

            // sanity check
            if (separatorLeft.separator === ';'
                && (query.indexOf('.') === -1 || query.indexOf('.') > separatorLeft.offset)) {
                // incorrect query -- you can use ';' to add filtering by another column
                // after one filter has been applied with "table.column=value" syntax
                return _emptyState();
            }

            if (separatorLeft.separator === null || separatorLeft.separator === '+') {

                const inputtedTableName = query.slice(
                    separatorLeft.offset ? separatorLeft.offset + 1 : 0,
                    separatorRight.offset ? separatorRight.offset : query.length
                );
                if (!inputtedTableName.length) {
                    return _emptyState();
                }
                const matchedTableNames = Object.keys(suggestionSourceState).filter(
                    tablename => tablename.indexOf(inputtedTableName) === 0
                );
                return _ifNotOneExactMatchToInput(
                    inputtedTableName,
                    {items: matchedTableNames, separatorIndex: -1}
                );

            } else if (['.', ';', '(', '='].includes(separatorLeft.separator)) {

                const inputtedColumnName = query.slice(
                    separatorLeft.offset + 1,
                    separatorRight.offset ? separatorRight.offset : query.length
                );

                const firstTable = query.split('.')[0];

                let inputtedTable;

                if (separatorLeft.separator === '(') {
                    // inputting join_by part
                    // on the first place is the key to use from the first table
                    inputtedTable = firstTable;
                } else if (separatorLeft.separator === '=') {
                    // either filter value input
                    // or second key of join_by
                    const nearestParent = findNearestOccurrence(['(', ')'], query, cursorPosition, 'left');
                    if (nearestParent.occurrence === '(') {
                        // second key of join_by
                        inputtedTable = query.slice(
                            findNearestOccurrence('+', query, cursorPosition, 'left').offset + 1,
                            nearestParent.offset
                        );
                    } else {
                        // filter value input
                        return _emptyState();
                    }
                } else {
                    // otherwise it's '.' or ';'
                    // which could go either after the first or the joined table
                    const nearestPlus = findNearestOccurrence('+', query, cursorPosition, 'left');
                    if (nearestPlus.offset === null) {
                        // no joined tables
                        inputtedTable = firstTable;
                    } else {
                        const nearestLeftParent = findNearestOccurrence('(', query, nearestPlus.offset, 'right');
                        if (nearestLeftParent.offset === null) {
                            return _emptyState();
                        }
                        inputtedTable = query.slice(nearestPlus.offset + 1, nearestLeftParent.offset);
                    }
                }

                const suggestionSourceForInputtedTable = suggestionSourceState[inputtedTable];
                if (typeof suggestionSourceForInputtedTable === 'undefined') {
                    return _emptyState();
                }

                let matchedColumnNames = [];
                let separatorIndex = -1;
                ['indexed', 'nonindexed'].forEach(columnType => {

                    if (!suggestionSourceForInputtedTable[columnType + '_columns'].length) {
                        return;
                    }

                    matchedColumnNames = [
                        ...matchedColumnNames,
                        ...suggestionSourceForInputtedTable[columnType + '_columns'].filter(
                            columnname => columnname.indexOf(inputtedColumnName) === 0
                        )
                    ];
                    if (columnType === 'indexed' && matchedColumnNames.length) {
                        // separator between indexed and non-indexed columns
                        separatorIndex = (matchedColumnNames.length - 1);
                    }
                });
                if (matchedColumnNames[matchedColumnNames.length - 1] === separatorIndex) {
                    // this would be the case, if all matches are indexed columns
                    // no need to have a separator
                    separatorIndex = -1;
                }
                return _ifNotOneExactMatchToInput(
                    inputtedColumnName,
                    {items: matchedColumnNames, separatorIndex}
                );

            } else {
                return _emptyState();
            }
        }
        default:
            return suggestionsState;
    }
};

export default suggestionsReducer;
