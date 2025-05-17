import PropTypes from "prop-types";
import React from "react";

const SelectField = ({ options, onChange, isRequired, value }) => (
  <div>
    <select
      value={value}
      className="appearance-none block w-1/2 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-xs"
      onChange={onChange} required={isRequired}
    >
      <option value="">Select</option>
      {options.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

SelectField.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  value: PropTypes.string
};

// Setting default values for props
SelectField.defaultProps = {
  options: [],
  value: "",
  isRequired: false
}

export default SelectField;
