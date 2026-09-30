const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/home_appliance_service';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[Database] Connected to MongoDB at ${conn.connection.host}`);
    return;
  } catch (externalErr) {
    console.warn(`[Database] MongoDB at ${uri} was not reachable. Initializing embedded database...`);
    try {
      mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Embedded MongoDB Server running at ${inMemoryUri}`);
      
      const seedHelper = require('../seed/seedHelper');
      await seedHelper();
    } catch (memErr) {
      console.error('[Database] Embedded MongoDB error:', memErr.message);
    }
  }
};

module.exports = connectDB;
