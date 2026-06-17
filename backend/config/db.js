const mongoose = require('mongoose');

const connectDB = async () => {
const mongoUri = process.env.MONGO_URI;

  console.log('Attempting to connect to MongoDB...');
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    w: 'majority'
  });

  console.log('MongoDB connected successfully');
};

module.exports = connectDB;
