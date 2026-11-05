import express from 'express';
import session from 'express-session';
import pool from './db.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(express.json());
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 7 },
}));

// DB 연결 확인용
app.get('/api/health', async (req, res) => {
  const [rows] = await pool.query('SELECT NOW() AS now, VERSION() AS version');
  res.json({ ok: true, db: rows[0] });
});

app.use('/api', authRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ error: '없는 API입니다' });
});

// 라우트에서 던진 에러는 모두 여기로 (Express 5는 async 에러도 잡아 줌)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: '서버 오류가 발생했습니다' });
});

// 시작 전에 DB 연결부터 확인
try {
  await pool.query('SELECT 1');
  console.log(`DB 연결 성공: ${process.env.DB_USER}@${process.env.DB_HOST}/${process.env.DB_NAME}`);
} catch (err) {
  console.error('DB 연결 실패:', err.message);
  console.error('server/.env의 DB 설정을 확인하고, 처음이라면 npm run db:init을 먼저 실행하세요.');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`API 서버: http://localhost:${PORT}`);
});
