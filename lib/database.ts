import mysql, { PoolConnection } from 'mysql2/promise';

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: mysql.Pool;
  private config: DatabaseConfig;

  private constructor() {
    this.config = {
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'aitripplanner'
    };

    // Create connection pool with production settings
    this.pool = mysql.createPool({
      ...this.config,
      connectionLimit: 10,
      // SSL configuration for production
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async getConnection(): Promise<PoolConnection> {
    try {
      const connection = await this.pool.getConnection();
      return connection;
    } catch (error) {
      console.error('Database connection error:', error);
      throw new Error('Failed to connect to database');
    }
  }

  public async query(sql: string, params?: any[]): Promise<any> {
    let connection: PoolConnection | null = null;
    
    try {
      connection = await this.pool.getConnection();
      const [rows] = await connection.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  public async close(): Promise<void> {
    try {
      await this.pool.end();
    } catch (error) {
      console.error('Error closing database pool:', error);
    }
  }
}

// Export singleton instance
export const db = DatabaseConnection.getInstance();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await db.close();
  process.exit(0);
});
