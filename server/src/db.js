import mysql from 'mysql2/promise';

// 커넥션 풀 하나를 앱 전체에서 같이 쓴다
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,  // DATE/DATETIME을 JS Date 대신 문자열로 받기
});

export default pool;
