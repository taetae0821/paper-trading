import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

const INITIAL_DEPOSIT = 10_000_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// F-01 회원가입 · 계좌 개설 — 사용자, 계좌, 초기 입금을 한 트랜잭션으로
router.post('/signup', async (req, res) => {
  const nickname = req.body.nickname?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const { password, passwordConfirm } = req.body;
  const accountName = req.body.accountName?.trim() || '기본 계좌';

  if (!nickname || !email || !password) {
    return res.status(400).json({ error: '모든 칸을 입력해 주세요' });
  }
  if (nickname.length > 30) {
    return res.status(400).json({ error: '닉네임은 30자 이하로 입력해 주세요' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: '이메일 형식이 올바르지 않습니다' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: '비밀번호는 8자 이상이어야 합니다' });
  }
  if (password !== passwordConfirm) {
    return res.status(400).json({ error: '비밀번호가 일치하지 않습니다' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [user] = await conn.query(
      'INSERT INTO users (nickname, email, password_hash) VALUES (?, ?, ?)',
      [nickname, email, passwordHash]
    );
    const [account] = await conn.query(
      'INSERT INTO accounts (user_id, name) VALUES (?, ?)',
      [user.insertId, accountName]
    );
    await conn.query(
      "INSERT INTO cash_ledger (account_id, type, amount) VALUES (?, 'DEPOSIT', ?)",
      [account.insertId, INITIAL_DEPOSIT]
    );

    await conn.commit();

    // 가입하면 바로 로그인 상태로
    req.session.userId = user.insertId;
    req.session.accountId = account.insertId;
    res.status(201).json({ id: user.insertId, nickname });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: '이미 가입된 이메일입니다' });
    }
    throw err;
  } finally {
    conn.release();
  }
});

// F-02 로그인
router.post('/login', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;
  const failMessage = '이메일 또는 비밀번호가 맞지 않습니다';

  if (!email || !password) {
    return res.status(400).json({ error: failMessage });
  }

  const [rows] = await pool.query(
    `SELECT u.id, u.nickname, u.password_hash, a.id AS account_id
     FROM users u
     JOIN accounts a ON a.user_id = u.id
     WHERE u.email = ?
     ORDER BY a.id
     LIMIT 1`,
    [email]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: failMessage });
  }

  req.session.userId = user.id;
  req.session.accountId = user.account_id;
  res.json({ id: user.id, nickname: user.nickname });
});

// F-02 로그아웃
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid');
    res.status(204).end();
  });
});

// 메뉴 바용: 내 정보와 보유 현금
router.get('/me', requireLogin, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.nickname, u.email, u.is_admin,
            a.id AS account_id, a.name AS account_name,
            COALESCE((SELECT SUM(amount) FROM cash_ledger WHERE account_id = a.id), 0) AS cash
     FROM users u
     JOIN accounts a ON a.id = ?
     WHERE u.id = ?`,
    [req.session.accountId, req.session.userId]
  );
  const me = rows[0];
  if (!me) {
    return res.status(401).json({ error: '로그인이 필요합니다' });
  }

  res.json({
    id: me.id,
    nickname: me.nickname,
    email: me.email,
    isAdmin: Boolean(me.is_admin),
    accountId: me.account_id,
    accountName: me.account_name,
    cash: Number(me.cash),  // SUM은 DECIMAL → 문자열로 오므로 숫자로
  });
});

export default router;
