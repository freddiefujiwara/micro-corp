/**
 * 令和6年度 (2024年度) 社会保険料率・テーブル (東京都)
 */
export const RATES = {
  // 国民年金 (月額)
  NATIONAL_PENSION_MONTHLY: 16980,

  // 厚生年金 保険料率 (全国一律, 労使合計)
  KOSEI_NENKIN_RATE: 0.183,

  // 協会けんぽ (東京都)
  KYOKAI_KENPO_TOKYO: {
    HEALTH: 0.0998, // 9.98%
    NURSING: 0.0160, // 1.60% (40歳から64歳)
  },

  // 任意継続の上限 (標準報酬月額)
  // 協会けんぽは、全被保険者の前年9月末の平均報酬月額 30万円が上限（令和6年度）
  OPTIONAL_CONTINUED_MAX_REMUNERATION: 300000,

  // 国民健康保険 (概算用モデル係数 - 東京都中央区などを参考に簡略化)
  NHI_ESTIMATE: {
    INCOME_RATIO: 0.0964, // 所得割 (医療+支援+介護)
    PER_CAPITA: 78900,     // 均等割 (1人あたり年額)
    MAX_ANNUAL: 1060000,   // 合計上限
  },
};

/**
 * 健康保険・厚生年金 標準報酬月額テーブル
 */
export const REMUNERATION_TABLE = [
  { level: 1,  min: 0,        max: 63000,    health: 58000,   pension: 88000 },
  { level: 2,  min: 63000,    max: 73000,    health: 68000,   pension: 88000 },
  { level: 3,  min: 73000,    max: 83000,    health: 78000,   pension: 88000 },
  { level: 4,  min: 83000,    max: 93000,    health: 88000,   pension: 88000 },
  { level: 5,  min: 93000,    max: 101000,   health: 98000,   pension: 98000 },
  { level: 6,  min: 101000,   max: 107000,   health: 104000,  pension: 104000 },
  { level: 7,  min: 107000,   max: 114000,   health: 110000,  pension: 110000 },
  { level: 8,  min: 114000,   max: 122000,   health: 118000,  pension: 118000 },
  { level: 9,  min: 122000,   max: 130000,   health: 126000,  pension: 126000 },
  { level: 10, min: 130000,   max: 138000,   health: 134000,  pension: 134000 },
  { level: 11, min: 138000,   max: 146000,   health: 142000,  pension: 142000 },
  { level: 12, min: 146000,   max: 155000,   health: 150000,  pension: 150000 },
  { level: 13, min: 155000,   max: 165000,   health: 160000,  pension: 160000 },
  { level: 14, min: 165000,   max: 175000,   health: 170000,  pension: 170000 },
  { level: 15, min: 175000,   max: 185000,   health: 180000,  pension: 180000 },
  { level: 16, min: 185000,   max: 195000,   health: 190000,  pension: 190000 },
  { level: 17, min: 195000,   max: 210000,   health: 200000,  pension: 200000 },
  { level: 18, min: 210000,   max: 230000,   health: 220000,  pension: 220000 },
  { level: 19, min: 230000,   max: 250000,   health: 240000,  pension: 240000 },
  { level: 20, min: 250000,   max: 270000,   health: 260000,  pension: 260000 },
  { level: 21, min: 270000,   max: 290000,   health: 280000,  pension: 280000 },
  { level: 22, min: 290000,   max: 310000,   health: 300000,  pension: 300000 },
  { level: 23, min: 310000,   max: 330000,   health: 320000,  pension: 320000 },
  { level: 24, min: 330000,   max: 350000,   health: 340000,  pension: 340000 },
  { level: 25, min: 350000,   max: 370000,   health: 360000,  pension: 360000 },
  { level: 26, min: 370000,   max: 395000,   health: 380000,  pension: 380000 },
  { level: 27, min: 395000,   max: 425000,   health: 410000,  pension: 410000 },
  { level: 28, min: 425000,   max: 455000,   health: 440000,  pension: 440000 },
  { level: 29, min: 455000,   max: 485000,   health: 470000,  pension: 470000 },
  { level: 30, min: 485000,   max: 515000,   health: 500000,  pension: 500000 },
  { level: 31, min: 515000,   max: 545000,   health: 530000,  pension: 530000 },
  { level: 32, min: 545000,   max: 575000,   health: 560000,  pension: 560000 },
  { level: 33, min: 575000,   max: 605000,   health: 590000,  pension: 590000 },
  { level: 34, min: 605000,   max: 635000,   health: 620000,  pension: 620000 },
  { level: 35, min: 635000,   max: 665000,   health: 650000,  pension: 650000 },
  { level: 36, min: 665000,   max: 695000,   health: 680000,  pension: 650000 },
  { level: 37, min: 695000,   max: 730000,   health: 710000,  pension: 650000 },
  { level: 38, min: 730000,   max: 770000,   health: 750000,  pension: 650000 },
  { level: 39, min: 770000,   max: 810000,   health: 790000,  pension: 650000 },
  { level: 40, min: 810000,   max: 855000,   health: 830000,  pension: 650000 },
  { level: 41, min: 855000,   max: 905000,   health: 880000,  pension: 650000 },
  { level: 42, min: 905000,   max: 955000,   health: 930000,  pension: 650000 },
  { level: 43, min: 955000,   max: 1005000,  health: 980000,  pension: 650000 },
  { level: 44, min: 1005000,  max: 1055000,  health: 1030000, pension: 650000 },
  { level: 45, min: 1055000,  max: 1115000,  health: 1090000, pension: 650000 },
  { level: 46, min: 1115000,  max: 1175000,  health: 1150000, pension: 650000 },
  { level: 47, min: 1175000,  max: 1235000,  health: 1210000, pension: 650000 },
  { level: 48, min: 1235000,  max: 1295000,  health: 1270000, pension: 650000 },
  { level: 49, min: 1295000,  max: 1355000,  health: 1330000, pension: 650000 },
  { level: 50, min: 1355000,  max: 9999999,  health: 1390000, pension: 650000 },
];

export const MAX_HEALTH_REMUNERATION = 1390000;
export const MAX_PENSION_REMUNERATION = 650000;
