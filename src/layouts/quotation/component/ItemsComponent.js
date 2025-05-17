import { useState } from "react";
import ItemInputForm from "./ItemInputForm";
import PropTypes from "prop-types";

const ItemsComponent = ({ titleinputFields, setTitleInputFields, textBoxOpen }) => {
  const [isTextBoxOpen, setIsTextBoxOpen] = useState(textBoxOpen);

  const deletstyle = { color: "red", fontSize: "1.5rem" }
  const options = ['Sqft', 'Pcs'];
  const onOptionChangeHandler = (index, i, event) => {
    const list = [...titleinputFields]; // Create a shallow copy of the state array

    // Update the value of the specific field in subfield
    list[index].subfiled[i]['type'] = event.target.value;
    setTitleInputFields(list);

  }

  const handleButtonClick = () => {
    setIsTextBoxOpen(true);
    setTitleInputFields([
      ...titleinputFields,
      { title: '', subfiled: [] } // New empty field with no subfields
    ]);
  };

  const removeTitleFields = (index) => {
    console.log("Removing field at index:", index);
  
    // Use the filter method for immutability
    const updatedFields = titleinputFields.filter((_, i) => i !== index);
  
    // Update the state with the new array
    setTitleInputFields(updatedFields);
  };
  

  const addInputField = (i) => {
    const values = [...titleinputFields];
    values[i].subfiled.push({
      description: '',
      size: '',
      quantity: '',
      type: '',
      rate: '',
      amount: ''
    });
    setTitleInputFields(values);
  };

  const removeInputFields = (index, i) => {
    const values = [...titleinputFields];
    values[index].subfiled.splice(i, 1); // Remove subfield at the given index
    setTitleInputFields(values);
  };

  const handleMainFieldChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const list = [...titleinputFields]; // Create a copy of the state

    list[index][name] = value; // Update the specific field in the list

    setTitleInputFields(list); // Update the state with the modified list
  };

  const handleChange = (index, i, evnt) => {
    const { name, value } = evnt.target;
    // alert(name,value)
    const list = [...titleinputFields]; // Create a shallow copy of the state array

    // Update the value of the specific field in subfield
    list[index].subfiled[i][name] = value;

    // Calculate the quantity and amount if necessary
    if (name === "size" || name === "rate") {
      const rate = parseFloat(list[index].subfiled[i].rate) || 0;
      const size = list[index].subfiled[i].size;
      let quantity = 0;

      if (size && /x/i.test(size)) { // If size contains 'x' (e.g., '10x20')
        const [width, height] = size.toLowerCase().split('x').map(parseFloat);
        if (!isNaN(width) && !isNaN(height)) {
          quantity = width * height; // Multiply width and height for area
        }
      } else if (!isNaN(parseFloat(size))) { // If size is a single numeric value
        quantity = parseFloat(size);
      }

      list[index].subfiled[i].quantity = quantity.toFixed(2); // Set calculated quantity

      // Calculate amount (quantity * rate)
      list[index].subfiled[i].amount = (quantity * rate).toFixed(2);
    }

    setTitleInputFields(list); // Update the state with the modified list
  };

  return (
    <div className="m-4 border-s-4 border-2 border-black-400">
      <div className="flex flex-wrap -mx-3 mb-5 px-4">
        <div className="w-full px-4">
          <label className="text-gray-700 text-xs font-bold mb-2">Items</label>
          <div className="grid grid-cols-9 text-xs font-bold mt-2">
            <div>Sr.no</div>
            <div>Description</div>
            <div>Details</div>
            <div>Size</div>
            <div>Quantity</div>
            <div>Type</div>
            <div>Rate</div>
            <div>Amount</div>
            <div>Action</div>
          </div>
          <hr />

          {isTextBoxOpen && (
            <div className="mt-4">
              {titleinputFields?.map((data, index) => (
                <ItemInputForm
                  key={index}
                  index={index}
                  data={data}
                  handleMainFieldChange={handleMainFieldChange}
                  addInputField={addInputField}
                  removeTitleFields={removeTitleFields}
                  handleChange={handleChange}
                  removeInputFields={removeInputFields}
                  options={options}
                  onOptionChangeHandler={onOptionChangeHandler}
                  deletstyle={deletstyle}
                />
              ))}
            </div>
          )}

          <hr />
          <div className="rounded-t-lg text-xs mt-4 font-bold rounded-full">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleButtonClick}
            >
              Add Title
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ItemsComponent.propTypes = {
  titleinputFields: PropTypes.object.isRequired,
  setTitleInputFields: PropTypes.func.isRequired,
  textBoxOpen:PropTypes.bool
};
ItemsComponent.defaultProps = {
  textBoxOpen: false,
};

export default ItemsComponent;