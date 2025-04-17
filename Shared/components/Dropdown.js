import React from "react";

const Dropdown = ({ children, className = "" }) => {
    return (
        <div className={'dropdown ${className}'}>
            {children}
        </div>
    );
};

const Button = ({ children, onClick }) => {
    return (
        <button onClick={onClick}>
            {children}
        </button>
    );
};

Dropdown.Button = Button;

export default Dropdown;
