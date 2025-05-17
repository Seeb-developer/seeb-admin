import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { AiFillCloseCircle } from 'react-icons/ai';

const TimelineComponent = ({ timeline, setTimeline }) => {
  // Handle task and day changes in the timeline
  const handleTimelineChange = (index, field, value) => {
    const updatedTimeline = [...timeline];
    updatedTimeline[index][field] = value;
    setTimeline(updatedTimeline); // Update the timeline state in parent
  };

  // Add a new timeline entry
  const addTimelineEntry = () => {
    setTimeline([...timeline, { task: '', days: '' }]); // Add an empty entry
  };

  // Remove a timeline entry
  const removeTimelineEntry = (index) => {
    const updatedTimeline = timeline.filter((_, i) => i !== index);
    setTimeline(updatedTimeline); // Update the timeline state in parent
  };

  // Calculate the total days
  const calculateTotalDays = () => {
    return timeline.reduce((total, data) => {
      const days = parseInt(data.days, 10);
      return !isNaN(days) ? total + days : total;
    }, 0);
  };

  return (
    <div className="border-s-4 border-2 border-black-400 mt-6">
      <div className="flex flex-wrap -mx-3 mb-5 px-4">
        <div className="w-full px-4">
          <label className="text-gray-700 text-xs font-bold mb-2">
            Timeline
          </label>
          <div className="grid grid-cols-3 text-xs mt-4">
            <div>Sr.No</div>
            <div>Task</div>
            <div>Days</div>
          </div>
          <hr />
          <div>
            {timeline.map((data, index) => {
              const { task, days } = data;
              return (
                <div className="grid grid-cols-4 text-xs mt-4" key={index}>
                  <div className="w-1/2">{index + 1}</div>
                  <div>
                    <input
                      required
                      type="text"
                      value={task} // Controlled input for task
                      onChange={(evnt) =>
                        handleTimelineChange(index, 'task', evnt.target.value)
                      } // Call the change handler to update the state
                      placeholder="Description"
                      className="bg-gray-50 border w-72 h-10 border-gray-300 rounded-lg block p-2.5"
                    />
                  </div>
                  <div className="ml-16">
                    <input
                      required
                      type="text"
                      value={days} // Controlled input for days
                      onChange={(evnt) =>
                        handleTimelineChange(index, 'days', evnt.target.value)
                      } // Call the change handler to update the state
                      placeholder="0"
                      className="bg-gray-50 border w-72 h-10 border-gray-300 rounded-lg block p-2.5"
                    />
                  </div>
                  <div className="ml-48">
                    <button
                      type="button"
                      className="grid grid-cols-2 mt-4"
                      onClick={() => removeTimelineEntry(index)} // Remove entry on click
                    >
                      <AiFillCloseCircle style={{ color: 'red' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <hr />
          <div className="grid grid-cols-6 text-xs mt-4">
            <div className="rounded-t-lg text-xs font-bold rounded-full">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={addTimelineEntry} // Add new timeline entry
              >
                Add More
              </button>
            </div>
            <div>Total Days</div>
            <div>
              <input
                type="text"
                className="bg-gray-50 border w-72 h-10 disabled border-gray-300 rounded-lg block w-1/2 p-2.5"
                value={calculateTotalDays()} // Set the total days as value
                disabled
              />
            </div>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

// Add prop-types validation
TimelineComponent.propTypes = {
  timeline: PropTypes.arrayOf(
    PropTypes.shape({
      task: PropTypes.string.isRequired,
      days: PropTypes.string.isRequired,
    })
  ).isRequired,
  setTimeline: PropTypes.func.isRequired,
};

export default TimelineComponent;
