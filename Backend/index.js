const express = require('express');
const connectDB = require('./src/utils/db');
const cors = require('cors'); // Import cors package

const transactionRoutes = require('./src/routes/transactionRoutes');
const dbRoutes = require('./src/routes/dbRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB().then(() => {
  // Middleware to parse JSON bodies
  app.use(express.json());

  // CORS middleware
  app.use(cors());
  
  

  // API routes
  app.use('/api', transactionRoutes);
  
  
  app.use('/db', dbRoutes);


  // Start the server
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => {
  console.error('Error connecting to the database:', error);
});
const fetchAndStoreTransactions = require('./src/models/fetchTransactions');
fetchAndStoreTransactions();
