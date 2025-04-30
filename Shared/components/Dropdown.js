/**
 * Animated reusable dropdown component.
 * It takes a number of children which then acts as the rows. The onClick props should use the function
 * showDropdown inside of sectioned.js. The id of the dropdown should be passed as a parameter to the function.
 * The dropdownName props is the text that will be displayed on the button that opens the dropdown. 
 */

const Dropdown = ({ children, dropdownName, onClick, className = "", id="" }) => {
    return (
        <div className={`dropdown ${className}`}>
            <button onClick={onClick} className="dropButton submit-button">
                <img alt="dropdownIcon" src="../Shared/icons/hamburger_menu_google_fonts.svg" style={{pointerEvents: 'none'}}/>
                {dropdownName}
            </button>
            <div className="dropdown-content dropdown-content-hide" id={id}>
                {children}
            </div>
        </div>
    );
};
