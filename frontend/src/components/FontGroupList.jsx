import React, { useState, useEffect } from 'react';
import FontGroupEditor from './FontGroupEditor';

const FontGroupList = ({fontGroups, onUploadSuccess}) => {

  const [editingGroup, setEditingGroup] = useState(null);
  const handleEditFontGroup = async(fontGroupId) => {
    try{
      await fetch(`http://localhost:5000/font-groups/${fontGroupId}`, {
        method: 'PUT',
      })
      if(onUploadSuccess) onUploadSuccess();
      alert('Font group updated successfully');
    } catch (error) {
      console.error('Error updating font group:', error);
    }
  };

  const handleDeleteFontGroup = async (fontGroupId) => {
    try {
      await fetch(`http://localhost:5000/font-groups/${fontGroupId}`, {
        method: 'DELETE',
      });
      if(onUploadSuccess) onUploadSuccess();
      alert('Font group deleted successfully');
    } catch (error) {
      console.error('Error deleting font group:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Font Groups</h2>
      {fontGroups.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Group Name</th>
                <th className="px-4 py-2 border">Fonts</th>
                <th className="px-4 py-2 border">Count</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fontGroups.map((group, idx) => (
                <tr key={group.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 border">{idx + 1}</td>
                  <td className="px-4 py-2 border font-semibold">{group.name}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex flex-wrap gap-2">
                      {group.fonts.map((font, index) => (
                        <span
                          key={index}
                          style={{ fontFamily: font.fontName }}
                          className="px-2 py-1 bg-gray-200 rounded text-xs"
                        >
                          {font.fontName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 border text-center">{group.fonts.length}</td>
                  <td className="px-4 py-2 border space-x-2">
                  <button
  onClick={() => setEditingGroup(group)}
  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
>
  Edit
</button>
                    <button
                      onClick={() => handleDeleteFontGroup(group.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No font groups available.</p>
      )}

      {editingGroup && (
        <div className="mt-6">
          <FontGroupEditor
            group={editingGroup}
            onClose={() => setEditingGroup(null)}
            onUpdateSuccess={onUploadSuccess}
          />
        </div>
      )}
    </div>


  );
};

export default FontGroupList;
