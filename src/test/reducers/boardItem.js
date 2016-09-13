import { expect } from 'chai';
import reducer from '../../reducers/boardItem';
import deepFreeze from 'deep-freeze';
import * as types from '../../actions/';

describe('boardItem reducer', () => {

    it('should handle BOARD_ADD_ITEM', () => {

        expect(
            reducer({}, {
                type: types.BOARD_ADD_ITEM,
                id: 123,
                query: 'Test query'
            })
        ).to.eql(
            {
                id: 123,
                query: 'Test query',
                loading: false,
                dataResults: [],
                metaResults: [],
                hiddenColumns: []
            }
        );
    });

    it('should handle QUERY_INPUT_CHANGE', () => {

        const state = reducer(
            {
                query: 'Prev query'
            },
            {
                type: types.QUERY_INPUT_CHANGE,
                query: 'New query'
            }
        );
        expect(state.query).to.equal('New query');
    });

    it('should handle SUGGESTIONS_USE', () => {

        const state = reducer(
            {
                query: 'Test ____ query'
            },
            {
                type: types.SUGGESTIONS_USE,
                suggestion: 'suggestion',
                forQueryPart: [5, 9]
            }
        );
        expect(state.query).to.equal('Test suggestion query');
    });

    it('should handle TABLE_META_FETCH', () => {

        const state = reducer({}, { type: types.TABLE_META_FETCH } );

        expect(state.loading).to.be.true;
        expect(state.dataResults).to.be.empty;
        expect(state.metaResults).to.be.empty;
    });

    it('should handle TABLE_DATA_FETCH', () => {

        const state = reducer({}, { type: types.TABLE_DATA_FETCH } );

        expect(state.loading).to.be.true;
        expect(state.dataResults).to.be.empty;
        expect(state.metaResults).to.be.empty;
    });

    it('should handle TABLE_DATA_FETCH_COMPLETED', () => {

        const sampleResponse = deepFreeze([{'userid': 1}, {'userid': 2}]);

        const state = reducer({}, { type: types.TABLE_DATA_FETCH_COMPLETED, response: sampleResponse } );

        expect(state.loading).to.be.false;
        expect(state.dataResults).to.eql(sampleResponse);
    });

    it('should handle TABLE_META_FETCH_COMPLETED', () => {

        const sampleResponse = deepFreeze([{'columname': 'userid'}, {'columname': 'orderid'}]);

        const state = reducer({}, { type: types.TABLE_META_FETCH_COMPLETED, response: sampleResponse } );

        expect(state.loading).to.be.false;
        expect(state.metaResults).to.eql(sampleResponse);
    });

});
