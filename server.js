const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const taxRoutes = require('./routes/taxRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api', taxRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});