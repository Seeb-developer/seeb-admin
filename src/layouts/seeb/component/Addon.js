import PropTypes from 'prop-types';
import React from 'react';

const priceTypeOptions = ['unit', 'square_feet'];

const Addon = ({ addons, setAddons }) => {
    const handleAddAddon = () => {
        setAddons([
            ...addons,
            {
                group_name: '',
                name: '',
                price_type: '',
                qty: '',
                price: '',
                description: '',
                is_required: 0,
            },
        ]);
    };

    const handleRemoveAddon = (index) => {
        const updatedAddons = addons.filter((_, i) => i !== index);
        setAddons(updatedAddons);
    };

    const handleAddonChange = (index, field, value) => {
        const updatedAddons = [...addons];
        updatedAddons[index][field] = value;
        setAddons(updatedAddons);
    };

    return (
        <div className="space-y-4 mt-4 px-4">
            <div className="text-lg font-semibold">Addons</div>
            {addons.map((addon, index) => (
                <div
                    key={index}
                    className="grid grid-cols-7 gap-3 items-center px-4"
                >
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Group Name</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2 text-sm"
                            value={addon.group_name}
                            onChange={(e) => handleAddonChange(index, 'group_name', e.target.value)}
                            required
                            placeholder='Enter group name'
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Addon Name</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2 text-sm"
                            value={addon.name}
                            onChange={(e) => handleAddonChange(index, 'name', e.target.value)}
                            required
                            placeholder='Enter addon name'
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Price Type</label>
                        <select
                            className="w-full border rounded p-2 text-sm"
                            value={addon.price_type}
                            onChange={(e) => handleAddonChange(index, 'price_type', e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            {priceTypeOptions.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Qty</label>
                        <input
                            type="number"
                            className="w-full border rounded p-2 text-sm"
                            value={addon.qty}
                            onChange={(e) => handleAddonChange(index, 'qty', e.target.value)}
                            required
                            placeholder='Enter quantity'
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Price</label>
                        <input
                            type="number"
                            className="w-full border rounded p-2 text-sm"
                            value={addon.price}
                            onChange={(e) => handleAddonChange(index, 'price', e.target.value)}
                            required
                            placeholder='Enter price'
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2 text-sm"
                            value={addon.description}
                            onChange={(e) => handleAddonChange(index, 'description', e.target.value)}
                            required
                            placeholder='Enter description'

                        />
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-1">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Required</label>
                            <input
                                type="checkbox"
                                checked={parseInt(addon.is_required)}
                                onChange={(e) =>
                                    handleAddonChange(index, 'is_required', e.target.checked ? 1 : 0)
                                }
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => handleRemoveAddon(index)}
                            className="text-red-500 text-xs border border-red-400 px-3 py-1 rounded hover:bg-red-50 transition"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddAddon}
                className="bg-indigo-500 text-white px-4 py-2 rounded text-sm"
            >
                + Add Addon
            </button>
        </div>
    );
};

Addon.propTypes = {
    addons: PropTypes.arrayOf(
        PropTypes.shape({
            group_name: PropTypes.string,
            name: PropTypes.string,
            price_type: PropTypes.string,
            qty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            description: PropTypes.string,
            is_required: PropTypes.bool,
        })
    ).isRequired,
    setAddons: PropTypes.func.isRequired,
};

export default Addon;
