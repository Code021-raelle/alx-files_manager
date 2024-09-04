import { MongoClient } from 'mongodb';

const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
const DATABASE = process.env.DB_DATABASE || 'files_manager';

class DBClient {
  constructor() {
    // MongoDB connection URL
    const url = `mongodb://${HOST}:${PORT}`;

    // Connect to the MongoDB client
    this.client = new MongoClient(url, { useUnifiedTopology: true });

    // Connect to the database
    this.client.connect()
      .then(() => {
        this.db = this.client.db(DATABASE);
        console.log(`Connected to MongoDB at ${url}/${DATABASE}`);
      })
      .catch((err) => {
        console.error(`Failed to connect to MongoDB: ${err.message}`);
      });
  }

  /**
     * Checks if the MongoDB client is connected
     * @returns {boolean} True if the MongoDB client is connected , false otherwise
     */
  isAlive() {
    return this.client && this.client.isConnected();
  }

  /**
     * Returns the number of documents in the 'users' collection
     * @returns {Promise<number>} The number of documents in the 'users' collection
     */
  async nbUsers() {
    try {
      return await this.db.collection('users').countDocuments();
    } catch (err) {
      console.error(`Error counting documents in 'users' collection: ${err.message}`);
      return 0;
    }
  }

  /**
     * Returns the number of documents in the 'files' collection
     * @returns {Promise<number>} the number of documents in the 'files' collection
     */
  async nbFiles() {
    try {
      return await this.db.collection('files').countDocuments();
    } catch (err) {
      console.error(`Error counting documents in 'files' collection: ${err.message}`);
      return 0;
    }
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
