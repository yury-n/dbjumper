import 'styles/floatingQueryInput.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import QueryInput from './QueryInput';
// selectors
import { getFloatingQueryInput } from '../reducers';
// actions
import {
    commitQueryInput,
    changeQueryInput,
    cancelConnectionCreation
} from '../actions';

class FloatingQueryInput extends Component {

    constructor(props) {
        super(props);

        this.handleCommit = this.handleCommit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { query: nextQuery } = nextProps;
        const { query: oldQuery, changeQueryInput } = this.props;
        if (!oldQuery.length) {
            return;
        }
        // floating query input appends '.' when a table is picked from suggestions
        // if that's the case we want to trigger QUERY_INPUT_CHANGE event
        // to autosuggest columns right after we used table autosuggest
        const tableWasPickedFromAutosuggest = (nextQuery.slice(-1) === '.'
                                                // and make sure it wasn't just typed in
                                                && nextQuery.length - oldQuery.length > 1);
        if (tableWasPickedFromAutosuggest) {
            const inputBoundingRect = this.refs.floatingQueryInput.getBoundingClientRect();
            changeQueryInput(null, nextQuery, inputBoundingRect, nextQuery.length);
        }
    }

    componentDidUpdate() {

        const { visible, targetBoundingRect } = this.props;

        if (!visible) {
            return;
        }

        const { floatingQueryInput } = this.refs;

        const targetHeight = targetBoundingRect.height;
        const componentHeight = floatingQueryInput.clientHeight;
        const heightDiff = targetHeight - componentHeight;

        const left = targetBoundingRect.right;
        const top = document.body.scrollTop
                    + targetBoundingRect.top
                    + Math.round(heightDiff / 2);

        floatingQueryInput.style.left = left + 'px';
        floatingQueryInput.style.top = top + 'px';
    }

    handleCommit(query, event) {
        const { commitQueryInput } = this.props;
        const withCtrlKeyPressed = event.metaKey || event.ctrlKey;
        commitQueryInput(null, query, withCtrlKeyPressed);
    }

    render() {
        const { query, visible, changeQueryInput, cancelConnectionCreation } = this.props;

        if (!visible) {
            return null;
        }

        return (
            <div ref="floatingQueryInput" className="floating-query-input">
                <QueryInput active={true}
                            query={query}
                            onChangeHandler={
                                ({inputValue, inputBoundingRect, cursorPosition}) =>
                                    changeQueryInput(null, inputValue, inputBoundingRect, cursorPosition)
                            }
                            onClickHandler={() => {}}
                            onBlurHandler={cancelConnectionCreation}
                            onCommitHandler={this.handleCommit}
                            onCloseHandler={cancelConnectionCreation} />
            </div>
        );
    }
}
FloatingQueryInput.propTypes = {
    visible: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    targetBoundingRect: PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
    })
};

const mapStateToProps = (state) => ({
    ...getFloatingQueryInput(state)
});

export default connect(
    mapStateToProps,
    {
        cancelConnectionCreation,
        commitQueryInput,
        changeQueryInput
    }
)(FloatingQueryInput);
