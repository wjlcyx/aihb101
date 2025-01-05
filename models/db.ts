import mysql from 'mysql2/promise';

let globalPool: mysql.Pool;

export function getDb() {
  if (!globalPool) {
    const connectionString = process.env.DATABASE_URL;
    console.log("connectionString", connectionString);

    // 创建连接池
    globalPool = mysql.createPool({
      uri: connectionString,  // mysql2 使用 uri 来接收连接字符串
      waitForConnections: true,
      connectionLimit: 10,    // 连接池最大连接数
      queueLimit: 0          // 队列限制，0 表示不限制
    });
  }

  return globalPool;
}
