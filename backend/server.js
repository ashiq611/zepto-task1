// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));


// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // ✅ keep original name
  }
});

const upload = multer({ 
  storage: storage, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'font/ttf') {
      return cb(new Error('Only TTF files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Font upload route
app.post('/upload-font', upload.single('font'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ message: 'Font uploaded successfully', file: req.file });
});



app.get('/fonts', (req, res) => {
  const folderPath = path.join(__dirname, 'uploads');

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading fonts directory' });
    }

    const ttfFiles = files.filter((file) => file.toLowerCase().endsWith('.ttf'));

    const fonts = ttfFiles.map((filename) => ({
      name: filename,
      url: `http://localhost:${PORT}/uploads/${filename}`
    }));

    res.json(fonts);
  });
});
// Font group creation
let fontGroups = [];

// Create Font Group
app.post('/font-groups', (req, res) => {
  const { groupTitle, fonts } = req.body;

  if (!groupTitle || !Array.isArray(fonts) || fonts.length < 2) {
    return res.status(400).json({ message: 'Invalid input: title and at least 2 fonts required.' });
  }

  const newGroup = {
    id: Math.floor(Math.random() * 1000),
    name: groupTitle,
    fonts,
  };

  fontGroups.push(newGroup);
  res.status(201).json({ message: 'Font group created successfully', group: newGroup });
});

// Get All Font Groups
app.get('/font-groups', (req, res) => {
  res.json(fontGroups);
});


// Delete font group

app.delete('/font/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({ message: 'Font file not found or could not be deleted' });
    }
    res.status(200).json({ message: 'Font file deleted successfully' });
  });
});


app.put('/font-groups/:groupId', (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const groupIndex = fontGroups.findIndex((group) => group.id === groupId);

  if (groupIndex === -1) {
    return res.status(404).json({ message: 'Font group not found' });
  }

  const updatedGroup = { ...fontGroups[groupIndex], ...req.body };
  fontGroups[groupIndex] = updatedGroup;
  res.status(200).json({ message: 'Font group updated successfully', group: updatedGroup });
});


app.delete('/font-groups/:groupId', (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const groupIndex = fontGroups.findIndex((group) => group.id === groupId);

  if (groupIndex === -1) {
    return res.status(404).json({ message: 'Font group not found' });
  }

  fontGroups.splice(groupIndex, 1);
  res.status(200).json({ message: 'Font group deleted successfully' });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
