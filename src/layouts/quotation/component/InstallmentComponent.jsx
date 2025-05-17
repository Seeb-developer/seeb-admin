import React from 'react';
import PropTypes from 'prop-types';

const InstallmentComponent = ({ installments, setInstallments }) => {
  const handleDateChange = (index, value) => {
    const updatedInstallments = [...installments];
    updatedInstallments[index].due_date = value;
    setInstallments(updatedInstallments);
  };

  const calculateTotalAmount = () => {
    return installments.reduce((sum, inst) => sum + parseFloat(inst.amount || 0), 0).toFixed(2);
  };

  return (
    <div className="border-s-4 border-2 border-black-400 mt-6">
      <div className="flex flex-wrap -mx-3 mb-5 px-4">
        <div className="w-full px-4">
          <label className="text-gray-700 text-xs font-bold mb-2">Installment</label>
          <div className="grid grid-cols-4 text-xs mt-4">
            <div>Total</div>
            <div>%</div>
            <div>Amount</div>
            <div>Date</div>
          </div>
          {installments.map((inst, index) => (
            <div key={index} className="grid grid-cols-4 text-xs mt-4">
              <div>{inst.label}</div>
              <div>{inst.percentage}%</div>
              <div><input type="text" value={inst.amount} className="bg-gray-50 border w-full h-10 border-gray-300 rounded-lg p-2.5" disabled /></div>
              <div><input required type="date" value={inst.due_date} onChange={(e) => handleDateChange(index, e.target.value)} className="bg-gray-50 border w-full h-10 border-gray-300 rounded-lg p-2.5" /></div>
            </div>
          ))}
          <div className="grid grid-cols-6 text-xs mt-4">
            <div>Total Amount</div>
            <div><input type="text" value={calculateTotalAmount()} className="bg-gray-50 border w-full h-10 disabled border-gray-300 rounded-lg p-2.5" disabled /></div>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

InstallmentComponent.propTypes = {
  installments: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
    amount: PropTypes.string.isRequired,
    due_date: PropTypes.string.isRequired,
  })).isRequired,
  setInstallments: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

export default InstallmentComponent;
