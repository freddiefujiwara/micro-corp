import { RATES, REMUNERATION_TABLE, MAX_PENSION_REMUNERATION } from '../data/rates.js';

/**
 * 国民年金保険料の計算 (年額)
 * @param {number} months 納付月数 (通常12)
 * @returns {number}
 */
export function calculateNationalPension(months = 12) {
  return RATES.NATIONAL_PENSION_MONTHLY * months;
}

/**
 * 標準報酬月額の決定 (厚生年金)
 * @param {number} monthlyRemuneration 実際の役員報酬
 * @returns {number} 標準報酬月額
 */
export function getPensionStandardRemuneration(monthlyRemuneration) {
  if (monthlyRemuneration >= MAX_PENSION_REMUNERATION) {
    return MAX_PENSION_REMUNERATION;
  }

  const entry = REMUNERATION_TABLE.find(row =>
    monthlyRemuneration >= row.min && monthlyRemuneration < row.max
  );

  // 見つからない場合は最後の要素のpensionを返す (MAX以下の場合)
  return entry ? entry.pension : REMUNERATION_TABLE[REMUNERATION_TABLE.length - 1].pension;
}

/**
 * 厚生年金保険料の計算 (月額)
 * @param {number} monthlyRemuneration 役員報酬
 * @returns {{ individual: number, corporate: number, total: number }}
 */
export function calculateKoseiNenkin(monthlyRemuneration) {
  const standardRemuneration = getPensionStandardRemuneration(monthlyRemuneration);
  const total = Math.floor(standardRemuneration * RATES.KOSEI_NENKIN_RATE);
  const individual = Math.floor(total / 2);
  const corporate = total - individual; // 端数調整

  return { individual, corporate, total };
}
