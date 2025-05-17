import React from 'react';
import PropTypes from 'prop-types';

const ConfirmModal = ({
    show,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <p className="text-sm mb-6">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 bg-gray-300 rounded"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
};

ConfirmModal.defaultProps = {
    title: "Are you sure?",
    message: "Do you really want to perform this action?",
    confirmText: "Confirm",
    cancelText: "Cancel",
};

export default ConfirmModal;
