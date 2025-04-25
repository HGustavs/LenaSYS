const Dropdown = ({ children, dropdownName, onClick, className = "", id="" }) => {
    return (
        <div className={`dropdown dropdown-content-hide ${className}`}>
            <button onClick={onClick} className="dropButton">{dropdownName}</button>
            <div className="dropdown-content" id={id}>
                {children}
            </div>
        </div>
    );
};
