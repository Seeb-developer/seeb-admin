import React, { useState } from 'react';
import { RiDeleteBin2Line } from 'react-icons/ri';

const CustomField = () => {
  const [customFormData, setCustomFormData] = useState([]);

  const handleAddField = () => {
    setCustomFormData([...customFormData, { title: '', value: '' }]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFormData = [...customFormData];
    updatedFormData[index][field] = value;
    setCustomFormData(updatedFormData);
  };

  const handleDeleteField = (index) => {
    const updatedFormData = [...customFormData];
    updatedFormData.splice(index, 1);
    setCustomFormData(updatedFormData);
  };

  return (
    <div className='mb-4'>
    {/* {console.log(formData)} */}
      <button onClick={handleAddField} className='bg-gray-50 text-sm p-2 rounded-lg border-2 w-full border-dotted my-4 flex justify-center gap-2 items-center'>Add New Feild</button>
      {customFormData.map((field, index) => (
        <div key={index} className='flex gap-5 items-center'>
          <input
            type="text"
            placeholder="Label"
            value={field.label}
            onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
            className='bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          />
          <input
            type="text"
            placeholder="Value"
            value={field.value}
            onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
            className='bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          />
          <div>
          <RiDeleteBin2Line className='text-red-500' size={22} onClick={() => handleDeleteField(index)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomField;


