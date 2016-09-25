import { expect } from 'chai';
import reducer from '../../reducers/connections';
import deepFreeze from 'deep-freeze';
import * as types from '../../actions/';

describe('connections reducer', () => {

    it('should create a new connection record on CONNECTION_FULL_CREATE', () => {

        const connections = reducer([],
            {
                type: types.CONNECTION_FULL_CREATE,
                color: '#FF0',
                fromBoardItemId: 111,
                fromColumnName: 'customerid',
                toBoardItemId: 222,
                toColumnName: 'userid'
            }
        );
        expect(connections).to.have.lengthOf(1);

    });

    it('should create a new connection record on CONNECTION_CREATE_FROM', () => {

        const connections = reducer([],
            {
                type: types.CONNECTION_CREATE_FROM,
                color: '#FF0',
                boardItemId: 111,
                columnName: 'customerid',
                values: [111, 222, 333]
            }
        );
        expect(connections).to.have.lengthOf(1);

    });

    it('should drop incomplete connection record on CONNECTION_CREATE_CANCEL', () => {

        const connections = reducer([
            {from: {}, to: {}}, // complete
            {from: {}} // incomplete
        ],
            {
                type: types.CONNECTION_CREATE_CANCEL
            }
        );
        expect(connections).to.have.lengthOf(1);

    });
});
