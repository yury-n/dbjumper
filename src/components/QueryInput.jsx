import React, { Component, PropTypes } from 'react';

class QueryInput extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate() {
        const { active } = this.props;
        if (active) {
            this.refs.input.focus();
        }
    }

    handleChange(event) {
        const { onChangeHandler } = this.props;
        const inputValue = event.target.value;
        const inputBoundingRect = event.target.getBoundingClientRect();

        onChangeHandler({inputValue, inputBoundingRect});
    }

    render() {
        const { query, active, onFocusHandler } = this.props;
        return (
            <input type="text"
                   ref="input"
                   className={'query-input' + (active ? ' query-input--active' : '')}
                   autoFocus="true"
                   autoComplete="false"
                   spellCheck="false"
                   value={query}
                   onChange={this.handleChange}
                   onFocus={onFocusHandler} />
        );
    }
}
QueryInput.propTypes = {
    active: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    onChangeHandler: PropTypes.func.isRequired,
    onFocusHandler: PropTypes.func.isRequired
};

export default QueryInput;