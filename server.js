const express = require('express');
const app = express();

// Add this root route handler
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ... existing code ...

// Make sure this is at the end of your file
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 