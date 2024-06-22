const express = require('express');
const connectDB = require('./src/db');
const cors = require('cors');
const transactionRoutes = require('./src/routes/transactionRoutes');
const axios = require('axios');
const httpProxyMiddleware = require('http-proxy-middleware');

const app = express();

// Connect to the database
connectDB();
// app.use('/api/initial-data', httpProxyMiddleware({
//   target: 'https://s3.amazonaws.com/roxiler.com',
//   changeOrigin: true, // Change origin to match your server
//   pathRewrite: { '^/api/initial-data': '/product_transaction.json' } // Rewrite path
// }));

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));

// Routes
app.use('/api', transactionRoutes);

// Additional Routes
app.get('/api/statistics', (req, res) => {
  // Your route handler
});

app.get('/api/pie-chart', (req, res) => {
  // Your route handler
});

app.get('/api/bar-chart', (req, res) => {
  // Your route handler
});

 app.get('/api/transactions', async (req, res) => {
   try {
     console.log('Fetching transactions...');
     const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');  
     // Logging the response status and data
     console.log('API Response Status:', response.status);
     console.log('API Response Data:', response.data);  
     if (!response.data) {
       res.status(404).send('No data found');
     } else {
       res.json(response.data);
     }
   } catch (error) {
     console.error('Error fetching transactions:', error.message);
     if (error.response) {
       // The request was made and the server responded with a status code outside the range of 2xx
       console.error('Error Response Data:', error.response.data);
       console.error('Error Response Status:', error.response.status);
       console.error('Error Response Headers:', error.response.headers);
     } else if (error.request) {
       // The request was made but no response was received
       console.error('Error Request Data:', error.request);
     } else {
       // Something happened in setting up the request that triggered an Error
       console.error('Error Message:', error.message);
     }
     res.status(500).send('Error fetching transactions');
   }
 })
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
