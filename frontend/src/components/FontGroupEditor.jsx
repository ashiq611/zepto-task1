import React, { useEffect, useState } from 'react';

const FontGroupEditor = ({ group, onClose, onUpdateSuccess }) => {
  const [groupTitle, setGroupTitle] = useState(group.name);
  const [fontGroup, setFontGroup] = useState(group.fonts);
  const [availableFonts, setAvailableFonts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/fonts')
      .then((res) => res.json())
      .then((data) => setAvailableFonts(data))
      .catch((err) => console.error('Error loading fonts:', err));
  }, []);

  const handleChange = (index, field, value) => {
    setFontGroup((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleUpdateGroup = async () => {
    const payload = {
      name: groupTitle,
      fonts: fontGroup,
    };

    try {
      const res = await fetch(`http://localhost:5000/font-groups/${group.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Font group updated!');
        onUpdateSuccess();
        onClose();
      } else {
        const err = await res.json();
        alert('Error: ' + err.message);
      }
    } catch (e) {
      console.error('Error updating font group:', e);
      alert('Server error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">Edit Font Group</h3>
        <input
          className="w-full px-3 py-2 border rounded mb-4"
          value={groupTitle}
          onChange={(e) => setGroupTitle(e.target.value)}
          placeholder="Group Title"
        />
        <div className="space-y-2">
          {fontGroup.map((font, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <input
                className="px-2 py-1 border rounded"
                value={font.fontName}
                onChange={(e) => handleChange(i, 'fontName', e.target.value)}
                placeholder="Font Name"
              />
              <select
                className="px-2 py-1 border rounded"
                value={font.font}
                onChange={(e) => handleChange(i, 'font', e.target.value)}
              >
                <option value="">Select Font</option>
                {availableFonts.map((f, j) => (
                  <option key={j} value={f.url}>{f.name}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                value={font.size}
                onChange={(e) => handleChange(i, 'size', parseFloat(e.target.value))}
                className="px-2 py-1 border rounded"
              />
              <input
                type="number"
                step="0.01"
                value={font.priceChange}
                onChange={(e) => handleChange(i, 'priceChange', parseFloat(e.target.value))}
                className="px-2 py-1 border rounded"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={handleUpdateGroup} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontGroupEditor;
