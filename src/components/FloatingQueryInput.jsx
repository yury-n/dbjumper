import 'styles/floatingQueryInput.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import QueryInput from './QueryInput';
import CloseButton from './buttons/CloseButton';
import { getFloatingQueryInput } from '../reducers';

class FloatingQueryInput extends Component {

    render() {
        const { componentPosition, query } = this.props;

        const divStyle = {
            'left': componentPosition.left + 'px',
            'top': componentPosition.top + 'px'
        };

        const { visible } = this.props;

        if (!visible) {
            return null;
        }

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
FloatingQueryInput.propTypes = {
    visible: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    componentPosition: PropTypes.shape({
        top: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired
    }).isRequired
};

const mapStateToProps = (state) => ({
    ...getFloatingQueryInput(state)
});

export default connect(mapStateToProps, {})(FloatingQueryInput);