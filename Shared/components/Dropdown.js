const Dropdown = ({ children, dropdownName, onClick, className = "", id="" }) => {
    return (
        <div className={`dropdown ${className}`}>
            <button onClick={onClick} className="submit-button">{dropdownName}</button>
            <div className="dropdown-content dropdown-content-hide" id={id}>
                {children}
            </div>
        </div>
    );
};
