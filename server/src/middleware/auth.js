import pool from '../db.js';

export function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: '로그인이 필요합니다' });
  }
  next();
}

export async function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: '로그인이 필요합니다' });
  }
  const [rows] = await pool.query('SELECT is_admin FROM users WHERE id = ?', [req.session.userId]);
  if (!rows[0]?.is_admin) {
    return res.status(403).json({ error: '관리자만 사용할 수 있습니다' });
  }
  next();
}
