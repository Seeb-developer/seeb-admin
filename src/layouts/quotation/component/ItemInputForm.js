// ItemInputForm Component
import React from "react";
import PropTypes from "prop-types";
import InputField from "./InputField"; // Assuming InputField is in the same directory
import SelectField from "./SelectField"; // Assuming SelectField is a separate component
import { AiFillCloseCircle } from "react-icons/ai";

const ItemInputForm = ({
  index,
  data,
  handleMainFieldChange,
  addInputField,
  removeTitleFields,
  handleChange,
  removeInputFields,
  options,
  onOptionChangeHandler,
  deletstyle,
}) => (
  <div>
    <div className="flex">
      <div className="w-full px-0 mt-4">
        <InputField
          value={data.title || ""}
          name="title"
          placeholder="Title"
          handleChange={(e) => handleMainFieldChange(index, e)}
          isRequired={true}
        />
        <button
          type="button"
          className="ml-16 text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
          onClick={() => addInputField(index)}
        >
          Add Row
        </button>
        <button
          className="ml-96"
          type="button"
          onClick={() => removeTitleFields(index)}
        >
          <AiFillCloseCircle style={deletstyle} />
        </button>
      </div>
    </div>
    <hr />
    {data?.subfiled?.map((el, i) => (
      <div className="grid grid-cols-9 gap-4 mt-4" key={i}>
        <div className="w-full">{i + 1}</div>
        <InputField
          value={el.description}
          name="description"
          placeholder="Description"
          handleChange={(e) => handleChange(index, i, e)}
          isRequired={true}
        />
        <InputField
          value={el.details}
          name="details"
          placeholder="Details"
          handleChange={(e) => handleChange(index, i, e)}
          isRequired={true}
        />
        <InputField
          value={el.size}
          name="size"
          placeholder="0"
          handleChange={(e) => {
            const value = e.target.value;
            const regex = /^[0-9Xx]*$/; // Allow only digits and 'X'
            if (regex.test(value)) {
              handleChange(index, i, e);
            }
          }}
          isRequired={true}
        />

        <InputField
          value={el.quantity}
          name="quantity"
          placeholder="0"
          handleChange={(e) => handleChange(index, i, e)}
          disabled={true}
        />
        <div className="w-full">
          <SelectField
            options={options}
            value={el.type}
            onChange={(e) => onOptionChangeHandler(index, i, e)}
            isRequired={true}
          />
        </div>
        <InputField
          value={el.rate}
          name="rate"
          handleChange={(e) => {
            const value = e.target.value;
            const regex = /^[0-9]*\.?[0-9]*$/;
            if (regex.test(value)) {
              handleChange(index, i, e);
            }
          }}
          isRequired={true}
        />
        <InputField
          value={el.amount}
          name="amount"
          placeholder="0"
          handleChange={(e) => handleChange(index, i, e)}
          disabled={true}
        />
        <div>
          <button
            type="button"
            className="grid grid-cols-8 mt-4"
            onClick={() => removeInputFields(index, i)}
          >
            <AiFillCloseCircle style={deletstyle} />
          </button>
        </div>
      </div>
    ))}
    <hr />
  </div>
);

ItemInputForm.propTypes = {
  index: PropTypes.number.isRequired,
  data: PropTypes.shape({
    title: PropTypes.string,
    subfiled: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        details: PropTypes.string,
        size: PropTypes.string,
        quantity: PropTypes.string,
        type: PropTypes.string,
        rate: PropTypes.string,
        amount: PropTypes.string,
      })
    ),
  }).isRequired,
  handleMainFieldChange: PropTypes.func.isRequired,
  addInputField: PropTypes.func.isRequired,
  removeTitleFields: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  removeInputFields: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  onOptionChangeHandler: PropTypes.func.isRequired,
  deletstyle: PropTypes.object,
};

ItemInputForm.defaultProps = {
  options: [],
  deletstyle: {},
};

export default ItemInputForm;