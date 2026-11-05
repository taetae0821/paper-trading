-- 모의주식 스키마 (MySQL 8.0.16 이상 — CHECK 제약 사용)
-- 금액은 모두 원 단위 정수

DROP TABLE IF EXISTS watchlist;
DROP TABLE IF EXISTS cash_ledger;
DROP TABLE IF EXISTS executions;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS prices;
DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS sectors;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nickname      VARCHAR(30)  NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  is_admin      BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE accounts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT         NOT NULL,
  name       VARCHAR(50) NOT NULL DEFAULT '기본 계좌',
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE sectors (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  CONSTRAINT uq_sectors_name UNIQUE (name)
);

CREATE TABLE stocks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  code       VARCHAR(10)  NOT NULL,
  name       VARCHAR(50)  NOT NULL,
  sector_id  INT          NOT NULL,
  base_price INT          NOT NULL,
  volatility DECIMAL(5,4) NOT NULL DEFAULT 0.0300,  -- 0.03 = ±3%
  min_price  INT          NOT NULL,
  max_price  INT          NOT NULL,
  CONSTRAINT uq_stocks_code UNIQUE (code),
  CONSTRAINT fk_stocks_sector FOREIGN KEY (sector_id) REFERENCES sectors(id),
  CONSTRAINT ck_stocks_range CHECK (0 < min_price AND min_price < base_price AND base_price < max_price),
  CONSTRAINT ck_stocks_volatility CHECK (volatility > 0 AND volatility < 1)
);

CREATE TABLE prices (
  stock_id   INT  NOT NULL,
  trade_date DATE NOT NULL,
  open       INT  NOT NULL,
  high       INT  NOT NULL,
  low        INT  NOT NULL,
  close      INT  NOT NULL,
  PRIMARY KEY (stock_id, trade_date),
  CONSTRAINT fk_prices_stock FOREIGN KEY (stock_id) REFERENCES stocks(id),
  CONSTRAINT ck_prices_positive CHECK (open > 0 AND high > 0 AND low > 0 AND close > 0),
  CONSTRAINT ck_prices_high CHECK (high >= open AND high >= close),
  CONSTRAINT ck_prices_low CHECK (low <= open AND low <= close)
);

CREATE TABLE orders (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  account_id  INT NOT NULL,
  stock_id    INT NOT NULL,
  side        ENUM('BUY', 'SELL') NOT NULL,
  order_type  ENUM('MARKET', 'LIMIT') NOT NULL DEFAULT 'MARKET',
  qty         INT NOT NULL,
  limit_price INT NULL,
  status      ENUM('PENDING', 'FILLED', 'CANCELLED') NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_account FOREIGN KEY (account_id) REFERENCES accounts(id),
  CONSTRAINT fk_orders_stock FOREIGN KEY (stock_id) REFERENCES stocks(id),
  CONSTRAINT ck_orders_qty CHECK (qty > 0),
  CONSTRAINT ck_orders_limit CHECK (
    (order_type = 'MARKET' AND limit_price IS NULL) OR
    (order_type = 'LIMIT' AND limit_price > 0)
  )
);

CREATE TABLE executions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_id    INT NOT NULL,
  price       INT NOT NULL,
  qty         INT NOT NULL,
  executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_executions_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT ck_executions_price CHECK (price > 0),
  CONSTRAINT ck_executions_qty CHECK (qty > 0)
);

CREATE TABLE cash_ledger (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  account_id   INT NOT NULL,
  type         ENUM('DEPOSIT', 'BUY', 'SELL') NOT NULL,
  amount       INT NOT NULL,  -- 입금·매도는 +, 매수는 −
  execution_id INT NULL,      -- 입금은 체결이 없음
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ledger_account FOREIGN KEY (account_id) REFERENCES accounts(id),
  CONSTRAINT fk_ledger_execution FOREIGN KEY (execution_id) REFERENCES executions(id),
  CONSTRAINT ck_ledger_sign CHECK (
    (type IN ('DEPOSIT', 'SELL') AND amount > 0) OR
    (type = 'BUY' AND amount < 0)
  )
);

CREATE TABLE watchlist (
  user_id    INT NOT NULL,
  stock_id   INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, stock_id),
  CONSTRAINT fk_watchlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_watchlist_stock FOREIGN KEY (stock_id) REFERENCES stocks(id)
);
