import React, { Component, PropTypes } from 'react';

class QueryInput extends Component {

    render() {
        return (
            <input type="text"
                   className="query-input query-input--active"
                   autoFocus
                   autoComplete="false"
                   spellCheck="false" />
        );
    }
}

export default QueryInput;