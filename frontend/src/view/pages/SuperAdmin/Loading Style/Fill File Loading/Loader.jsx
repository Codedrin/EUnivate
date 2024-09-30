import React from 'react';
import { FaFile } from 'react-icons/fa'; // Import the file icon
import './Loader.css'; // Ensure this file exists

const Loader = ({ projectName }) => {
  return (
    <div className="loader">
      <div className="loader-container flex flex-col items-center justify-center p-6 rounded-lg shadow-lg">
        <div className="spinner">
          <FaFile className="file-icon" style={{ color: '#1f2937', fontSize: '2em' }} />
        </div>
        <h3 className="mt-5 ml-2 text-white font-semibold">
          {projectName ? `Generating ${projectName}...` : 'Loading...'}
        </h3>
      </div>
    </div>
  );
};

export default Loader;
