import React, { PropTypes } from 'react';

const Sidebar = ({ children }) => (
    <div className="sidebar">
        <div className="sidebar__header">dbjumper</div>
        <div className="sidebar__content">
            {children}
        </div>
    </div>
);
Sidebar.propTypes = {
    children: PropTypes.node.isRequired
};

export default Sidebar;