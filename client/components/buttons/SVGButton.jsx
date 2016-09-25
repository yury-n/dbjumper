import React, { PropTypes } from 'react';

const SVGButton = ({className, onClickHandler, children}) => (
    <svg className={className} viewBox="0 0 100 100" x="0" y="0"
         onClick={() => {onClickHandler()}}>
        <style dangerouslySetInnerHTML={({__html: 'svg { cursor: pointer; }'})}></style>
        {children}
    </svg>
);
SVGButton.propTypes = {
    className: PropTypes.string.isRequired,
    onClickHandler: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default SVGButton;