import { expect } from 'chai';
import reducer, { getBoardItem } from '../../reducers/boardItems';
import deepFreeze from 'deep-freeze';
import * as types from '../../actions/';

describe('boardItems reducer', () => {

    it('should handle BOARD_ADD_ITEM on empty state', () => {
        const prevState = deepFreeze([]);
        const newState = reducer(prevState, { type: types.BOARD_ADD_ITEM, id: 123 });

        expect(newState).to.have.lengthOf(1);
        expect(getBoardItem(newState, 123)).to.exist;
    });

    it('should handle BOARD_ADD_ITEM on nonempty state', () => {
        const prevState = deepFreeze([{},{}]);
        const newState = reducer(prevState, { type: types.BOARD_ADD_ITEM, id: 123 });

        expect(newState).to.have.lengthOf(3);
        expect(getBoardItem(newState, 123)).to.exist;
    });

    it('should handle BOARD_REMOVE_ITEM', () => {
        const prevState = deepFreeze([{id: 111},{id: 123}]);
        const newState = reducer(prevState, { type: types.BOARD_REMOVE_ITEM, id: 123 });

        expect(newState).to.have.lengthOf(1);
        expect(getBoardItem(newState, 123)).to.be.empty;
    });
});
