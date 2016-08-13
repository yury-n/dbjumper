import React, { Component, PropTypes } from 'react';

class QueryInput extends Component {

    render() {
        const { query } = this.props;
        return (
            <input type="text"
                   className="query-input query-input--active"
                   autoFocus
                   autoComplete="false"
                   spellCheck="false"
                   value={query} />
        );
    }
}
QueryInput.propTypes = {
    query: PropTypes.string.isRequired
};

export default QueryInput;