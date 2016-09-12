import 'styles/queryInput.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { doesQueryInputHaveSuggestions } from '../reducers';
import { focusWithoutScroll } from '../utils';
import CloseButton from './buttons/CloseButton';

class QueryInput extends Component {

    constructor(props) {
        super(props);

        this.focusIfActive = this.focusIfActive.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    componentDidMount() {
        const { input } = this.refs;
        input.addEventListener('keydown', this.handleKeydown);
        this.focusIfActive();
    }

    componentDidUpdate() {
        this.focusIfActive();
    }

    componentWillUnmount() {
        const { input } = this.refs;
        input.removeEventListener('keydown', this.handleKeydown);
    }

    focusIfActive() {
        const { active } = this.props;
        const { input } = this.refs;
        if (active) {
            focusWithoutScroll(input);
        }
    }

    handleKeydown(event) {
        const { hasSuggestions, onCommitHandler } = this.props;

        // a query is committed with Enter
        // when there're suggestions hitting Enter should use a suggestion instead of
        // committing the query
        if (event.keyCode === 13 && !hasSuggestions) {
            const inputValue = event.target.value;
            onCommitHandler(inputValue, event);
        }
    }

    handleChange(event) {
        const { onChangeHandler } = this.props;
        const inputValue = event.target.value;
        const inputBoundingRect = event.target.getBoundingClientRect();
        const cursorPosition = event.target.selectionStart;

        onChangeHandler({inputValue, inputBoundingRect, cursorPosition});
    }

    render() {
        const { query, active, onClickHandler, onBlurHandler, onCloseHandler } = this.props;
        return (
            <div className={'query-input' + (active ? ' query-input--active' : '')}>
                <input type="text"
                       ref="input"
                       className="query-input__input"
                       autoComplete="false"
                       spellCheck="false"
                       value={query}
                       onChange={this.handleChange}
                       onClick={onClickHandler}
                       onBlur={onBlurHandler} />
                <CloseButton onClickHandler={onCloseHandler} />
            </div>
        );
    }
}
QueryInput.propTypes = {
    active: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    hasSuggestions: PropTypes.bool.isRequired,

    onChangeHandler: PropTypes.func.isRequired,
    onClickHandler: PropTypes.func,
    onBlurHandler: PropTypes.func,
    onCommitHandler: PropTypes.func,
    onCloseHandler: PropTypes.func
};

const mapStateToProps = (state) => ({
    hasSuggestions: doesQueryInputHaveSuggestions(state)
});

export default connect(mapStateToProps)(QueryInput);
