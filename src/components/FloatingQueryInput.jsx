import 'styles/floatingQueryInput.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import QueryInput from './QueryInput';
import CloseButton from './buttons/CloseButton';

class FloatingQueryInput extends Component {

    render() {
        return (
            <div className="floating-query-input">
                <QueryInput />
                <CloseButton onClickHandler={() => {}} />
            </div>
        );
    }
}