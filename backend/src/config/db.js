const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

async function connectDB() {
  const mongoUri = process.env.MONGO_URL;

  if (mongoUri) {
    await mongoose.connect(mongoUri);
    return mongoose.connection;
  }

  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'vibe-commerce'
    }
  });

  const uri = memoryServer.getUri();
  await mongoose.connect(uri, { dbName: 'vibe-commerce' });
  return mongoose.connection;
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}

module.exports = {
  connectDB,
  disconnectDB
};

