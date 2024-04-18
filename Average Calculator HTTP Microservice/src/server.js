const express = require('express');
const path = require('path');
const port = 9876;

const app = express();
const publicDirectoryPath = path.join(__dirname, '/build');

app.use(express.static(publicDirectoryPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, '/index.html'));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});