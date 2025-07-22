import React, { useState } from 'react';
import axios from 'axios';

const FontUploadForm = ({ onUploadSuccess}) => {
  const [dragOver, setDragOver] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState([]);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    handleFileUpload(event.dataTransfer.files);
  };

  const handleFileInputChange = (event) => {
    handleFileUpload(event.target.files);
    event.target.value = null;
  };

  const handleFileUpload = async (files) => {
    const validFonts = Array.from(files).filter(
      (file) => file.type === 'font/ttf' || file.name.toLowerCase().endsWith('.ttf')
    );

    if (validFonts.length === 0) {
      alert('Please upload valid .ttf font files.');
      return;
    }

    const successfulFiles = [];

    for (let file of validFonts) {
      const formData = new FormData();
      formData.append('font', file);

      try {
        const res = await axios.post('http://localhost:5000/upload-font', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.status === 200) {
          if (onUploadSuccess) onUploadSuccess();
          successfulFiles.push(file.name);
        }
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Failed to upload: ' + file.name);
      }
    }

    if (successfulFiles.length > 0) {
      setSuccessMessage(successfulFiles);
      setSuccessModal(true);
    }
  };

  const closeModal = () => {
    setSuccessModal(false);
    setSuccessMessage([]);
  };

  return (
    <div className="p-4 max-w-xl mx-auto relative">
      <h2 className="text-2xl font-bold mb-4">Font Upload</h2>
      <div
        className={`border-2 border-dashed p-6 rounded-md text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-gray-500">
          Drag and drop TTF files here or{' '}
          <label
            htmlFor="file-input"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            click to upload
          </label>
        </p>
        <input
          id="file-input"
          type="file"
          accept=".ttf"
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-2 text-green-600">Upload Successful!</h2>
            <p className="text-sm text-gray-700 mb-4">
              {successMessage.map((name, idx) => (
                <span key={idx} className="block">{name}</span>
              ))}
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={closeModal}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontUploadForm;
