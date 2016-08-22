const floatingQueryInput = (state = {}, action) => {

    return {
        'position': {top: 0, left: 0},
        'query': ''
    };
};

export default floatingQueryInput;