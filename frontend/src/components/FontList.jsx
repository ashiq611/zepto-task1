import React, { useState, useEffect } from 'react';

const FontList = ({ fonts, onUploadSuccess }) => {
  const handleDeleteFont = async (filename) => {
    try {
      const res = await fetch(`http://localhost:5000/font/${filename}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if(onUploadSuccess) onUploadSuccess();
        alert('Font deleted successfully');
        // call parent refresh or refetch fonts here
      } else {
        const data = await res.json();
        alert('Failed to delete font: ' + data.message);
      }
    } catch (err) {
      console.error('Error deleting font:', err);
      alert('Error deleting font');
    }
  };
  



  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Font List</h2>
      {fonts.length === 0 ? (
        <p className="text-center text-gray-500">No fonts available</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Font Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Preview</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fonts.map((font, idx) => (
              <tr key={idx} className="hover:bg-gray-200">
                <td className="border border-gray-300 px-4 py-2">{font.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <style>
                    {`
                      @font-face {
                        font-family: 'UploadedFont${idx}';
                        src: url('${font.url}');
                      }
                    `}
                  </style>
                  <span style={{ fontFamily: `UploadedFont${idx}`, fontSize: '18px' }}>
                    The quick brown fox jumps over the lazy dog
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                <button
  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
  onClick={() => handleDeleteFont(font.name)}
>
  Delete
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FontList;
