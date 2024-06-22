const axios = require('axios');
const mongoose = require('mongoose');
const Transaction = require('./Transaction'); // Import the Transaction model
const connectDB = require('../utils/db'); // Import the database connection function

async function fetchAndStoreTransactions() {
  try {
    await connectDB(); // Connect to MongoDB before fetching data
    console.log('Connected to MongoDB');

    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    console.log('Data fetched from the API');

    
    // console.log(response)

    if (response.data && response.data.length > 0) {
      // Check if data is available and not empty
      const transactions = response.data.map((apiTransaction) => {
        // Map API data to Transaction model format
        return new Transaction({
          id: apiTransaction.id, // Modify property mapping as needed
          title: apiTransaction.title,
          description: apiTransaction.description,
          price: apiTransaction.price,
          image: apiTransaction.image,
          category: apiTransaction.category,
          sold: apiTransaction.sold,
          dateOfSale: apiTransaction.dateOfSale // Ensure this matches your schema field
        });
      });

      await Transaction.insertMany(transactions); // Save transactions to MongoDB
      console.log('Transactions stored successfully!');
    } else {
      console.log('No data found in API response.');
    }
  } catch (error) {
    console.error('Error fetching or storing transactions:', error);
  } finally {
    // Disconnect from MongoDB
  //  await mongoose.disconnect();
  //  console.log('Disconnected from MongoDB');
  }
}

// fetchAndStoreTransactions();
module.exports = fetchAndStoreTransactions;
