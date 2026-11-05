-- 샘플 데이터: 섹터 8개, 가상 종목 8개, 이틀치 시세 (docs/PLAN.md 3-6)

INSERT INTO sectors (name) VALUES
  ('전자'), ('바이오'), ('에너지'), ('게임'), ('운송'), ('식품'), ('유통'), ('금융');

-- 기준가 = 현재가, 한계가 = 기준가의 30% ~ 300%
INSERT INTO stocks (code, name, sector_id, base_price, volatility, min_price, max_price)
SELECT v.code, v.name, sec.id, v.base_price, v.volatility,
       ROUND(v.base_price * 0.3, -1), ROUND(v.base_price * 3, -1)
FROM (
  VALUES
    ROW('GAON',   '가온전자',     '전자',    74200, 0.0200),
    ROW('DASOM',  '다솜바이오',   '바이오', 119500, 0.0300),
    ROW('ONURI',  '온누리에너지', '에너지',  36800, 0.0250),
    ROW('BYUL',   '별빛게임즈',   '게임',    55900, 0.0300),
    ROW('HANUL',  '하늘항공',     '운송',    22150, 0.0200),
    ROW('SAEBOM', '새봄식품',     '식품',    18400, 0.0150),
    ROW('BADA',   '바다물산',     '유통',     9870, 0.0150),
    ROW('DEUN',   '든든금융',     '금융',    41300, 0.0150)
) AS v (code, name, sector, base_price, volatility)
JOIN sectors sec ON sec.name = v.sector;

-- 전일(prev)과 오늘(cur) 종가. 시가는 전일 종가, 고가·저가는 시가·종가 바깥으로 약간
INSERT INTO prices (stock_id, trade_date, open, high, low, close)
SELECT s.id, '2026-11-04', v.prev, v.prev + v.tick * 3, v.prev - v.tick * 3, v.prev
FROM (
  VALUES
    ROW('GAON',   72500,  74200, 100),
    ROW('DASOM', 123000, 119500, 500),
    ROW('ONURI',  35900,  36800,  50),
    ROW('BYUL',   55500,  55900, 100),
    ROW('HANUL',  22400,  22150,  50),
    ROW('SAEBOM', 18400,  18400,  50),
    ROW('BADA',    9740,   9870,  10),
    ROW('DEUN',   41900,  41300,  50)
) AS v (code, prev, cur, tick)
JOIN stocks s ON s.code = v.code
UNION ALL
SELECT s.id, '2026-11-05', v.prev,
       GREATEST(v.prev, v.cur) + v.tick * 2,
       LEAST(v.prev, v.cur) - v.tick * 2,
       v.cur
FROM (
  VALUES
    ROW('GAON',   72500,  74200, 100),
    ROW('DASOM', 123000, 119500, 500),
    ROW('ONURI',  35900,  36800,  50),
    ROW('BYUL',   55500,  55900, 100),
    ROW('HANUL',  22400,  22150,  50),
    ROW('SAEBOM', 18400,  18400,  50),
    ROW('BADA',    9740,   9870,  10),
    ROW('DEUN',   41900,  41300,  50)
) AS v (code, prev, cur, tick)
JOIN stocks s ON s.code = v.code;
