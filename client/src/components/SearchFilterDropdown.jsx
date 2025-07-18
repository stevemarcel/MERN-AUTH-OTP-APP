import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { FaCaretDown } from "react-icons/fa";

const SearchFilterDropdown = ({ searchFilter, setSearchFilter, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (value) => {
    setSearchFilter(value);
    setIsOpen(false);
  };

  // Find the selected option to display its icon and label
  const selectedOption = options.find((opt) => opt.value === searchFilter);
  const currentLabel = selectedOption?.label || "Select Filter"; // Fallback label
  const currentIcon = selectedOption?.icon; // Get the icon for the selected filter

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="px-3 py-2 flex items-center justify-center md:justify-between w-16 md:w-44 rounded bg-shark text-light border border-sharkLight-100 focus:outline-none focus:ring-1 focus:ring-sharkDark-400 focus:ring-opacity-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {currentIcon && <span className="text-base">{currentIcon}</span>}
        <span className="hidden md:inline-block">{currentLabel}</span>
        <FaCaretDown
          className={`ml-3 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 top-full mt-1 w-44 bg-light text-shark rounded shadow-lg overflow-hidden transition-opacity duration-200 opacity-100"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-2 cursor-pointer transition-colors duration-150 flex items-center gap-2
                ${
                  searchFilter === option.value
                    ? "bg-sharkLight-100 border-l-4 border-shark font-medium"
                    : "hover:bg-sharkLight-100 hover:text-shark"
                }
              `}
              onClick={() => handleOptionClick(option.value)}
              role="option"
              aria-selected={searchFilter === option.value}
            >
              {option.icon && <span className="text-base">{option.icon}</span>}
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Add PropTypes for validation
SearchFilterDropdown.propTypes = {
  searchFilter: PropTypes.string.isRequired,
  setSearchFilter: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.element,
    })
  ).isRequired,
};

export default SearchFilterDropdown;
