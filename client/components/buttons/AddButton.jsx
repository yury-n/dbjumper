import 'styles/buttons/addButton.css';
import React, { PropTypes } from 'react';
import SVGButton from './SVGButton';

const AddButton = ({onClickHandler}) => (
    <SVGButton className="add-button" onClickHandler={onClickHandler}>
        <polygon points="80.2,51.6 51.4,51.6 51.4,22.6 48.9,22.6 48.9,51.6 19.9,51.6 19.9,54.1 48.9,54.1 48.9,83.1   51.4,83.1 51.4,54.1 80.4,54.1 80.4,51.6 "/>
    </SVGButton>
);
AddButton.propTypes = {
    onClickHandler: PropTypes.func.isRequired
};

export default AddButton;
