import 'styles/suggestionList.css';
import React, { Component, PropTypes } from 'react';
import { getSuggestionList } from '../reducers/';
import { connect } from 'react-redux';

class SuggestionList extends Component {

    render() {
        const { suggestions, pointerIndex } = this.props;
        return (
            <ul className="suggestion-list">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className={index == pointerIndex ? 'active' : ''}>{suggestion}</li>
                ))}
            </ul>
        );
    }
}
SuggestionList.propTypes = {
    suggestions: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    pointerIndex: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    ...getSuggestionList(state)
});

export default connect(mapStateToProps)(SuggestionList);