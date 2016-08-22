const floatingQueryInput = (state, action) => {

    if (typeof state == 'undefined') {
        state = {
            'visible': false,
            'query': '',
            'componentPosition': {top: 0, left: 0}
        };
    }

    switch (action.type) {
        default:
            return state;
    }
};

export default floatingQueryInput;