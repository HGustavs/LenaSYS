const Dropdown = ({ children, dropdownName, onClick, className = "" }) => {
    return (
        <div className={`dropdown ${className}`}>
            <button onClick={onClick} className="dropButton">{dropdownName}</button>
            <div className="dropdown-content">
                {children}
            </div>
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
