import { expect } from 'chai';
import reducer from '../../reducers/connection';
import deepFreeze from 'deep-freeze';
import * as types from '../../actions/';

describe('connection reducer', () => {

    it('should handle CONNECTION_FULL_CREATE', () => {

        expect(
            reducer({}, {
                type: types.CONNECTION_FULL_CREATE,
                color: '#FF0',
                fromBoardItemId: 111,
                fromColumnName: 'customerid',
                toBoardItemId: 222,
                toColumnName: 'userid'
            })
        ).to.eql(
            {
                color: '#FF0',
                from: {
                    boardItemId: 111,
                    columnName: 'customerid',
                    values: []
                },
                to: {
                    boardItemId: 222,
                    columnName: 'userid',
                    values: []
                }
            }
        );
    });

    it('should handle CONNECTION_CREATE_FROM', () => {
        expect(
            reducer({}, {
                type: types.CONNECTION_CREATE_FROM,
                color: '#FF0',
                boardItemId: 111,
                columnName: 'customerid',
                values: [111, 222, 333]
            })
        ).to.eql(
            {
                color: '#FF0',
                from: {
                    boardItemId: 111,
                    columnName: 'customerid',
                    values: [111, 222, 333]
                }
            }
        );
    });

    it('should handle CONNECTION_CREATE_TO', () => {

        const connection = reducer({},
            {
                type: types.CONNECTION_CREATE_TO,
                boardItemId: 111,
                columnName: 'customerid',
                values: [111, 222, 333]
            }
        );
        expect(connection.to).to.exist;
        expect(connection.to.boardItemId).to.equal(111);
        expect(connection.to.columnName).to.equal('customerid');
        expect(connection.to.values).to.eql([111, 222, 333]);
    });

});
