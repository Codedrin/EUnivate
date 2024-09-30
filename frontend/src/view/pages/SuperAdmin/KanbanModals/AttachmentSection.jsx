import React from 'react';

const AttachmentSection = ({
  fileInputRef,
  handleClickFileInput,
  handleFileSelect,
  selectedFiles,
  handleImageChange,
  handleImageDelete
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-gray-700 font-semibold">Attachments</h3>
      <button
        onClick={handleClickFileInput}
        className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
      >
        Choose Files
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />
      <div className="mt-2">
        {selectedFiles.map((file, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>{file.name}</span>
            <button
              onClick={() => handleImageDelete(file)}
              className="text-red-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentSection;
