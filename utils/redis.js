import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor () {
    this.client = redis.createClient();

    this.client.on('error', (err) => {
      console.error(`Redis client not connected to the server: ${err.message}`);
    });

    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /**
  * checks if the Redis client is connected
  * @returns {boolean} True if the Redis client is connected, false otherwise
  */
  isAlive () {
    return this.client.connected;
  }

  /**
  * Gets the value associated with a key in Redis
  * @param {string} key - The key to look up in Redis
  * @returns {Promise<string | null>} The value associated with the key, or null
  */
  async get (key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (err) {
      console.error(`Error getting key ${key}: ${err.message}`);
      return null;
    }
  }

  /**
  * Sets a value in Redis with an expiration time
  * @param {string} key - The key to set in Redis
  * @param {string | number} value - The value to set
  * @param {number} duration - The time in seconds until the key expires
  */
  async set (key, value, duration) {
    try {
      await this.setAsync(key, value, 'EX', duration);
    } catch (err) {
      console.error(`Error setting key ${key}: ${err.message}`);
    }
  }

  /**
  * Deletes a key from Redis
  * @param {string} key - The key to delete in Redis
  * @returns {Promise<void>}
  */
  async del (key) {
    try {
      await this.delAsync(key);
    } catch (err) {
      console.error(`Error deleting key ${key}: ${err.message}`);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
