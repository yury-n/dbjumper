import React, { Component, PropTypes } from 'react';

class QueryInput extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const { onChangeHandler } = this.props;
        const inputValue = event.target.value;

        onChangeHandler(inputValue);
    }

    render() {
        const { query } = this.props;
        return (
            <input type="text"
                   className="query-input query-input--active"
                   autoFocus
                   autoComplete="false"
                   spellCheck="false"
                   value={query}
                   onChange={this.handleChange} />
        );
    }
}
QueryInput.propTypes = {
    query: PropTypes.string.isRequired,
    onChangeHandler: PropTypes.func.isRequired
};

export default QueryInput;