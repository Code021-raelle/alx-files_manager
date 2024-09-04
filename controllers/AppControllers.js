import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
     * Handles the GET /status endpoint
     * Returns the status of the Redis and MongoDB connections.
     */
  static getStatus(req, res) {
    res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  /**
     * Handles the GET /stats endpoint.
     * Returns the number of users and files in the database.
     */
  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();
      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching stats' });
    }
  }
}

export default AppController;
