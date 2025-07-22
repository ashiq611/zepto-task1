import React, { useEffect, useState } from 'react';


const FontGroupCreator = ({onUploadSuccess}) => {
  const [groupTitle, setGroupTitle] = useState('');
  const [fontGroup, setFontGroup] = useState([
    { fontName: '', font: '', size: 1.0, priceChange: 0 },
  ]);
  const [availableFonts, setAvailableFonts] = useState([]);

  const handleAddRow = () => {
    setFontGroup([...fontGroup, { fontName: '', font: '', size: 1.0, priceChange: 0 }]);
  };

  const handleRemoveRow = (index) => {
    if(index === 0) return;
    setFontGroup(fontGroup.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    setFontGroup(fontGroup.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleCreateFontGroup = async () => {
    if (fontGroup.length < 2 || fontGroup.some(item => item.font === '')) {
      alert('You have to select at least two fonts');
      return;
    }
  
    const payload = {
      groupTitle,
      fonts: fontGroup.map(({ fontName, font, size, priceChange }) => ({
        fontName,
        font,
        size,
        priceChange
      }))
    };
  
    try {
      const res = await fetch('http://localhost:5000/font-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const data = await res.json();
      if (res.ok) {
        onUploadSuccess();
        alert('Font group created!');
        setGroupTitle('');
        setFontGroup([{ fontName: '', font: '', size: 1.0, priceChange: 0 }]);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Server error creating font group');
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/fonts')
      .then((res) => res.json())
      .then((data) => setAvailableFonts(data))
      .catch((err) => console.error('Error loading fonts:', err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">Create Font Group</h2>
      <p className="text-sm text-gray-600 mb-4">You have to select at least two fonts</p>

      <input
        type="text"
        placeholder="Group Title"
        value={groupTitle}
        onChange={(e) => setGroupTitle(e.target.value)}
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <div className="space-y-3">
        {fontGroup.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-3 items-center border rounded-md p-3"
          >
            <div className="flex justify-center">
               {index + 1}
            </div>

            <input
              type="text"
              placeholder="Font Name"
              value={item.fontName}
              onChange={(e) => handleChange(index, 'fontName', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <select
              value={item.font}
              onChange={(e) => handleChange(index, 'font', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select Font</option>
              {availableFonts.map((font, id) => (
                <option key={id} value={font}>
                  {font.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              value={item.size}
              onChange={(e) => handleChange(index, 'size', parseFloat(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <input
              type="number"
              step="0.01"
              value={item.priceChange}
              onChange={(e) => handleChange(index, 'priceChange', parseFloat(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <button
              onClick={() => handleRemoveRow(index)}
              className="text-red-500 hover:text-red-700"
              disabled={index === 0}
            >
              X
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
        >
          + Add Row
        </button>

        <button
          onClick={handleCreateFontGroup}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default FontGroupCreator;
