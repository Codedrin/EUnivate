import React from 'react';

const Dates = ({ startDate, dueDate, setStartDate, setDueDate }) => {
  const isDueDateInvalid = new Date(dueDate) < new Date(startDate);

  return (
    <>
      <div className="mb-4 flex items-center space-x-3">
        <label 
          className="text-gray-700 text-sm font-semibold"
          htmlFor="startDate"
        >
          Start Date
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            id="startDate"
            value={startDate || ''}
            onChange={(e) => setStartDate(e.target.value)}
            className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="mb-4 flex items-center space-x-3">
        <label 
          className="text-gray-700 text-sm font-semibold"
          htmlFor="dueDate"
        >
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate || ''}
          onChange={(e) => setDueDate(e.target.value)}
          className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none"
        />
        {isDueDateInvalid && (
          <p className="text-red-500 text-xs ml-2">Due Date cannot be earlier than Start Date.</p>
        )}
      </div>
    </>
  );
}

export default Dates;
