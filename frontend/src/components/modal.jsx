import React from 'react'

export function modal({successMessage, closeModal}) {
  return (
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
  )
}
