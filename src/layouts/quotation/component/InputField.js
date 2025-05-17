import React from "react";
import PropTypes from "prop-types";

const InputField = ({ value, name, placeholder, handleChange, disabled, isRequired }) => (
  <div>
    <input
      type="text"
      value={value}
      name={name}
      placeholder={placeholder}
      onChange={handleChange}
      className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-xs"
      disabled={disabled}
      autoComplete="off"
      required={isRequired}
    />
  </div>
);

// Adding PropTypes for validation
InputField.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool
};

// Setting default values for props
InputField.defaultProps = {
  value: "",
  placeholder: "",
  disabled: false,
  isRequired: false
};

export default InputField;
