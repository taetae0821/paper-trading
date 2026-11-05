// DB 생성 → schema.sql → seed.sql 순서로 실행. 기존 테이블은 지워진다.
import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const conn = await mysql.createConnection({
  host: DB_HOST,
  port: Number(DB_PORT ?? 3306),
  user: DB_USER,
  password: DB_PASSWORD,
  multipleStatements: true,
});

try {
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`
  );
  await conn.query(`USE \`${DB_NAME}\``);

  for (const file of ['schema.sql', 'seed.sql']) {
    const sql = await readFile(new URL(`../sql/${file}`, import.meta.url), 'utf8');
    await conn.query(sql);
    console.log(`${file} 실행 완료`);
  }
  console.log(`데이터베이스 '${DB_NAME}' 준비 완료`);
} finally {
  await conn.end();
}
