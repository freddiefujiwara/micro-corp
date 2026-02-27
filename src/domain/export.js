/**
 * Build a structured object for export containing inputs, results, and logic details.
 * @param {Object} params - Simulation input parameters
 * @param {Array<Object>} results - Simulation scenario results
 * @param {Object} rates - Insurance rates and constants
 * @param {Array<Object>} table - Remuneration table
 * @returns {Object} Structured export data
 */
export function buildConditionsAndAlgorithmJson(params, results, rates, table) {
  return {
    simulationInputs: {
      ...params,
      timestamp: new Date().toISOString(),
    },
    simulationResults: results.map(scenario => ({
      name: scenario.name,
      totalAnnualCost: scenario.totalCost,
      breakdown: {
        individualHealthInsurance: scenario.healthInsurance,
        individualPension: scenario.pension,
        corporateHealthInsurance: scenario.corporateHealthInsurance,
        corporatePension: scenario.corporatePension,
        corporateFixedCost: scenario.corporateFixedCost,
      }
    })),
    logicDetails: {
      rates,
      remunerationTable: table,
    }
  };
}
