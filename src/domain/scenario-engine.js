import { calculateNationalPension, calculateKoseiNenkin } from './pension.js';
import { calculateKyokaiKenpo, calculateOptionalContinued, calculateNHI } from './health-insurance.js';

/**
 * 年齢から介護保険対象か判定 (40歳〜64歳)
 * @param {number} birthYear
 * @returns {boolean}
 */
function isNursingCareAge(birthYear) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  return age >= 40 && age < 65;
}

/**
 * 3つのシナリオをシミュレーション
 * @param {Object} params
 * @returns {Array<Object>} Scenario results
 */
export function runSimulation(params) {
  const {
    birthYear,
    dependents,
    previousSalary,
    taxableIncome,
    monthlyRemuneration,
    corporateFixedCost
  } = params;

  const includeNursing = isNursingCareAge(birthYear);

  // Scenario 1: 国民健康保険 + 国民年金
  const nhiHealth = calculateNHI(taxableIncome, (Number(dependents) || 0) + 1); // 本人+扶養人数
  const nationalPension = calculateNationalPension(12);

  const scenario1 = {
    name: '国保 + 国民年金',
    healthInsurance: nhiHealth,
    pension: nationalPension,
    corporateHealthInsurance: 0,
    corporatePension: 0,
    corporateFixedCost: 0,
    totalCost: nhiHealth + nationalPension
  };

  // Scenario 2: 任意継続 + 国民年金
  const optionalHealth = calculateOptionalContinued(previousSalary, includeNursing) * 12;
  const scenario2 = {
    name: '任意継続 + 国民年金',
    healthInsurance: optionalHealth,
    pension: nationalPension,
    corporateHealthInsurance: 0,
    corporatePension: 0,
    corporateFixedCost: 0,
    totalCost: optionalHealth + nationalPension
  };

  // Scenario 3: マイクロ法人 + 社会保険
  const microHealth = calculateKyokaiKenpo(monthlyRemuneration, includeNursing);
  const microPension = calculateKoseiNenkin(monthlyRemuneration);

  const individualHealth = microHealth.individual * 12;
  const individualPension = microPension.individual * 12;
  const corpHealth = microHealth.corporate * 12;
  const corpPension = microPension.corporate * 12;

  const scenario3 = {
    name: 'マイクロ法人 + 社保',
    healthInsurance: individualHealth,
    pension: individualPension,
    corporateHealthInsurance: corpHealth,
    corporatePension: corpPension,
    corporateFixedCost: corporateFixedCost,
    totalCost: individualHealth + individualPension + corpHealth + corpPension + corporateFixedCost
  };

  return [scenario1, scenario2, scenario3];
}

/**
 * 役員報酬レンジでの最適化シミュレーション
 * @param {Object} params
 * @param {number} minRemuneration
 * @param {number} maxRemuneration
 * @param {number} step
 * @returns {Array<Object>}
 */
export function getOptimizationData(params, minRemuneration = 45000, maxRemuneration = 200000, step = 5000) {
  const data = [];
  const includeNursing = isNursingCareAge(params.birthYear);

  for (let salary = minRemuneration; salary <= maxRemuneration; salary += step) {
    const microHealth = calculateKyokaiKenpo(salary, includeNursing);
    const microPension = calculateKoseiNenkin(salary);

    const health = microHealth.total * 12;
    const pension = microPension.total * 12;
    const total = health + pension + params.corporateFixedCost;
    data.push({
      salary,
      totalCost: total,
      breakdown: {
        health,
        pension,
        fixed: params.corporateFixedCost
      }
    });
  }
  return data;
}
