import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaCaretDown } from "react-icons/fa";

const FilterDropdown = ({ value, onChange, options }) => {
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

  const selectedOption = options.find((option) => option.value === value);

  const currentLabel = selectedOption?.label || "Select";

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        className="
          flex
          items-center
          justify-between
          gap-2
          w-full
          px-3
          py-2.5
          bg-shark
          text-light
          text-sm
          font-medium
          rounded-md
          shadow-sm
          hover:bg-sharkDark-100
          hover:shadow-md
          transition-all
          duration-200
          focus:outline-none
          focus:ring-1
          focus:ring-sharkDark-400
          focus:ring-opacity-50
        "
        onClick={() => setIsOpen((previous) => !previous)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{currentLabel}</span>

        <FaCaretDown
          className={`
            ml-1
            text-xs
            flex-shrink-0
            transition-transform
            duration-200
            ${isOpen ? "rotate-180" : "rotate-0"}
          `}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute
            top-full
            left-0
            mt-3
            w-full
            z-[110]
            bg-light
            border
            border-sharkLight-200
            rounded-md
            shadow-xl
            overflow-hidden
            py-1
          "
        >
          <ul role="listbox">
            {options.map((option) => {
              const isSelected = value === option.value;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleOptionClick(option.value)}
                  className={`
                    px-4
                    py-2.5
                    cursor-pointer
                    text-sm
                    transition-colors
                    duration-150
                    ${
                      isSelected
                        ? "bg-sharkLight-100 border-l-4 border-shark font-medium text-shark"
                        : "text-shark hover:bg-sharkLight-100"
                    }
                  `}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

FilterDropdown.propTypes = {
  value: PropTypes.string.isRequired,

  onChange: PropTypes.func.isRequired,

  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default FilterDropdown;
