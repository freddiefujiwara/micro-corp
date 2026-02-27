import { RATES, REMUNERATION_TABLE, MAX_HEALTH_REMUNERATION } from '../data/rates.js';

/**
 * 標準報酬月額の決定 (健康保険)
 * @param {number} monthlyRemuneration
 * @returns {number}
 */
export function getHealthStandardRemuneration(monthlyRemuneration) {
  if (monthlyRemuneration >= MAX_HEALTH_REMUNERATION) {
    return MAX_HEALTH_REMUNERATION;
  }

  const entry = REMUNERATION_TABLE.find(row =>
    monthlyRemuneration >= row.min && monthlyRemuneration < row.max
  );

  // テーブルより高い場合は、定義されている最後の報酬月額を返す
  return entry ? entry.health : REMUNERATION_TABLE[REMUNERATION_TABLE.length - 1].health;
}

/**
 * 協会けんぽ保険料の計算 (月額)
 * @param {number} monthlyRemuneration
 * @param {boolean} includeNursing 40歳以上65歳未満か
 * @returns {{ individual: number, corporate: number, total: number }}
 */
export function calculateKyokaiKenpo(monthlyRemuneration, includeNursing = false) {
  const standardRemuneration = getHealthStandardRemuneration(monthlyRemuneration);
  const rate = includeNursing
    ? RATES.KYOKAI_KENPO_TOKYO.HEALTH + RATES.KYOKAI_KENPO_TOKYO.NURSING
    : RATES.KYOKAI_KENPO_TOKYO.HEALTH;

  const total = Math.floor(standardRemuneration * rate);
  const individual = Math.floor(total / 2);
  const corporate = total - individual;

  return { individual, corporate, total };
}

/**
 * 任意継続保険料の計算 (月額)
 * @param {number} previousMonthlyRemuneration 退職時の標準報酬月額
 * @param {boolean} includeNursing
 * @returns {number}
 */
export function calculateOptionalContinued(previousMonthlyRemuneration, includeNursing = false) {
  // 上限 300,000円
  const targetRemuneration = Math.min(
    previousMonthlyRemuneration,
    RATES.OPTIONAL_CONTINUED_MAX_REMUNERATION
  );

  const rate = includeNursing
    ? RATES.KYOKAI_KENPO_TOKYO.HEALTH + RATES.KYOKAI_KENPO_TOKYO.NURSING
    : RATES.KYOKAI_KENPO_TOKYO.HEALTH;

  // 任意継続は労使合計分を全額自己負担
  return Math.floor(targetRemuneration * rate);
}

/**
 * 国民健康保険料の計算 (年額・概算)
 * @param {number} taxableIncome 課税所得
 * @param {number} dependents 扶養人数 (本人含む)
 * @returns {number}
 */
export function calculateNHI(taxableIncome, dependents = 1) {
  const incomeRatioPart = Math.floor(taxableIncome * RATES.NHI_ESTIMATE.INCOME_RATIO);
  const perCapitaPart = RATES.NHI_ESTIMATE.PER_CAPITA * dependents;

  const total = incomeRatioPart + perCapitaPart;
  return Math.min(total, RATES.NHI_ESTIMATE.MAX_ANNUAL);
}
