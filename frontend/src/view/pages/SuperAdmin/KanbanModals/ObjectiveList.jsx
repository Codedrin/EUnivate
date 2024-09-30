import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const ObjectiveList = ({ objectives, selectedObjective, setObjectives, setSelectedObjective }) => {
  const [newObjectiveText, setNewObjectiveText] = useState('');

  const handleAddObjective = () => {
    if (newObjectiveText.trim()) {
      const newObjective = {
        text: newObjectiveText.trim(),
        done: false, // Default status
      };
      setObjectives([...objectives, newObjective]);
      setNewObjectiveText('');
    }
  };

  const handleRemoveObjective = (objectiveToRemove) => {
    setObjectives(objectives.filter((objective) => objective !== objectiveToRemove));
  };

  const handleObjectiveSelect = (objective) => {
    setSelectedObjective(objective);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddObjective();
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-32 mb-2">
        <span className="text-gray-700 text-sm font-semibold">Objectives</span>
        <button
          onClick={handleAddObjective}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <FaPlus className="text-gray-500" />
        </button>
      </div>
      {objectives.length > 0 && (
        <div>
          {objectives.map((objective, index) => (
            <div key={index} className="mb-2 flex items-center space-x-2">
              <span className={`flex items-center space-x-2 ${selectedObjective === objective ? 'font-semibold' : ''}`}>
                <span onClick={() => handleObjectiveSelect(objective)}>
                  {objective.text || 'New Objective'}
                </span>
                {selectedObjective === objective && (
                  <button
                    onClick={() => handleObjectiveSelect(null)} // Deselects the current objective
                    className="text-red-500 hover:text-red-700"
                    title="Deselect"
                  >
                    <FaTimes />
                  </button>
                )}
                <button
                  onClick={() => handleRemoveObjective(objective)} // Delete button functionality
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <FaTimes />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
      <input
        type="text"
        value={newObjectiveText}
        onChange={(e) => setNewObjectiveText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="appearance-none rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Add new objective"
      />
    </div>
  );
};

export default ObjectiveList;
