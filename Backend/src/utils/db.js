const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    // If already connected
    return mongoose.connection;
  }
  try {
    await mongoose.connect('mongodb://localhost:27017/transactionDB'); // Replace with your MongoDB connection string
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process on error
  }
};

module.exports = connectDB;
//module.exports = mongoose.model('Transaction', TransactionSchema);