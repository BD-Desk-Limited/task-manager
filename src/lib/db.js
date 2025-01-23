import mongoose from 'mongoose';

const connectDB = async () => {
  try{
    const DBString = process.env.MONGODB_URI;

    if (mongoose.connection.readyState >= 1) {
      console.log('Using existing connection:  Connectin.....')
      return mongoose.connection.asPromise();
    }

    console.log('Making new connection to database: connecting.........')
    const connection = mongoose.connect(DBString);
    return connection;
  } catch (error){
    console.log('Error in database connection', error.message)
  }
  
};

export default connectDB;
