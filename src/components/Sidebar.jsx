import 'styles/sidebar.css';

import React, { PropTypes } from 'react';

const Sidebar = ({ children }) => (
    <div className="sidebar">
        <a href="/" className="sidebar__header">dbjumper</a>
        <div className="sidebar__content">
            {children}
        </div>
    </div>
);
Sidebar.propTypes = {
    children: PropTypes.node.isRequired
};

export default Sidebar;