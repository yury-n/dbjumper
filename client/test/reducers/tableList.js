import { expect } from 'chai';
import reducer from '../../reducers/tableList';
import deepFreeze from 'deep-freeze';
import * as types from '../../actions/';

describe('tableList reducer', () => {

    it('should handle TABLES_LISTING_FETCH_COMPLETED', () => {

        expect(
            reducer([], {
                type: types.TABLES_LISTING_FETCH_COMPLETED,
                response: {
                    'users': ['userid', 'name', 'address'],
                    'posts': ['postid', 'title']
                }
            })
        ).to.eql(
            ['posts', 'users']
        );
    });
});
