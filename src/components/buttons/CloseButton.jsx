import React, { PropTypes } from 'react';
import SVGButton from './SVGButton';

const CloseButton = ({onClickHandler}) => (
    <SVGButton className="close-button" onClickHandler={onClickHandler}>
        <polygon points="77.6,21.1 49.6,49.2 21.5,21.1 19.6,23 47.6,51.1 19.6,79.2 21.5,81.1 49.6,53 77.6,81.1 79.6,79.2   51.5,51.1 79.6,23 "/>
    </SVGButton>
);
CloseButton.propTypes = {
    onClickHandler: PropTypes.func.isRequired
};

export default CloseButton;