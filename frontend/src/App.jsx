// App.js
import React, { useState } from 'react';
import FontUpload from './components/FontUpload';
import FontList from './components/FontList';
import FontGroup from './components/FontGroupCreator';
import FontGroupList from './components/FontGroupList';
import FontGroupCreator from './components/FontGroupCreator';
import { useEffect } from 'react';
import FontGroupEditor from './components/FontGroupEditor';

const App = () => {
  const [fonts, setFonts] = useState([]);
  const [fontGroups, setFontGroups] = useState([]);

  const fetchFonts = async () => {
    try {
      const res = await fetch('http://localhost:5000/fonts');
      const data = await res.json();
      setFonts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFontGroups = async () => {
    try {
      const response = await fetch('http://localhost:5000/font-groups');
      const data = await response.json();
      setFontGroups(data);
    } catch (error) {
      console.error('Error fetching font groups:', error);
    }
  };

  
    useEffect(() => {
      fetchFontGroups();
    }, []);

  useEffect(() => {
    fetchFonts();
  }, []);

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Font Group System</h1>
      <FontUpload onUploadSuccess={fetchFonts} />
      <FontList fonts={fonts} onUploadSuccess={fetchFonts} />
      <FontGroupCreator onUploadSuccess={fetchFontGroups} />
      <FontGroupList fontGroups={fontGroups} onUploadSuccess={fetchFontGroups} />
    </div>
  );
};

export default App;
