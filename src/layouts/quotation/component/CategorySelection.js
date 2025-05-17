import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CategorySelection = ({ selectedSubcategories, setSelectedSubcategories }) => {
    const [categories, setCategories] = useState([]); // State for categories
    const [loading, setLoading] = useState(true); // Loading state for API call

    // Function to fetch categories and subcategories
    const fetchCategoriesAndSubcategories = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}master/categories/subcategories`);
            const result = await response.json();

            // Assuming API returns categories with subcategories nested
            setCategories(result.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategoriesAndSubcategories();
    }, []);

    // Handle the checkbox state change
    const handleChangeCheck = (categoryIndex, subIndex) => {
        const categoryId = categories[categoryIndex].id;
        const subcategoryId = categories[categoryIndex].subcategories[subIndex].id;
        const updatedSubcategories = { ...selectedSubcategories };

        // Update selected subcategories for the current category
        if (updatedSubcategories[categoryId]) {
            if (updatedSubcategories[categoryId].includes(subcategoryId)) {
                updatedSubcategories[categoryId] = updatedSubcategories[categoryId].filter(id => id !== subcategoryId);
            } else {
                updatedSubcategories[categoryId].push(subcategoryId);
            }
        } else {
            updatedSubcategories[categoryId] = [subcategoryId];
        }
        // console.log(updatedSubcategories)
        setSelectedSubcategories(updatedSubcategories);

    };

    if (loading) {
        return <div>Loading categories...</div>; // Optional loading state
    }

    return (
        <div>
            <label className="text-gray-700 text-lg font-bold mb-2">Mark List</label>
            {categories?.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                    <div className="grid grid-cols-2 text-sm font-bold mt-4">
                        <div>{category.title}</div>
                    </div>
                    <hr />
                    {category.subcategories.map((subcategory, subIndex) => (
                        <div className="grid grid-cols-2 text-sm mt-4" key={subIndex}>
                            <div>{subcategory.title}</div>
                            <div className="text-center">
                                <input
                                    id={`subcategory-checkbox-${categoryIndex}-${subIndex}`}
                                    type="checkbox"
                                    value={subcategory.title}
                                    checked={selectedSubcategories[category.id]?.includes(subcategory.id) || false}
                                    onChange={() => handleChangeCheck(categoryIndex, subIndex)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

CategorySelection.propTypes = {
    selectedSubcategories: PropTypes.object.isRequired,
    setSelectedSubcategories: PropTypes.func.isRequired,
};

export default CategorySelection;
