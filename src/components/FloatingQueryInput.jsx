import 'styles/floatingQueryInput.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import QueryInput from './QueryInput';
import CloseButton from './buttons/CloseButton';
import { getFloatingQueryInput } from '../reducers';

class FloatingQueryInput extends Component {

    render() {
        const { position, query } = this.props;


        const divStyle = {
            'left': position.left + 'px',
            'top': position.top + 'px'
        };

        return (
            <div className="floating-query-input" style={divStyle}>
                <QueryInput active={true}
                            query={query}
                            onChangeHandler={() => {}}
                            onClickHandler={() => {}}
                            onCommitHandler={() => {}} />
                <CloseButton onClickHandler={() => {}} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    ...getFloatingQueryInput(state)
});

export default connect(mapStateToProps, {})(FloatingQueryInput);