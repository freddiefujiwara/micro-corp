# Micro Corp

Micro Corp is a small Vue app that compares social insurance cost scenarios in Japan.
It is built as an MVP for FY2024 (Reiwa 6), focused on Tokyo assumptions.

## What this app compares

The app compares total costs for several options, such as:

- Employees' health insurance (Kyokai Kenpo)
- National Health Insurance (estimated model)
- Voluntary continuation after leaving a company
- Pension-related costs
- Company fixed costs

The goal is to help users understand household + company total cost differences.

## Main inputs

Users can enter values like:

- Birth year
- Number of dependents
- Previous salary
- Taxable income
- Monthly executive remuneration
- Company fixed costs

## Main output

For each scenario, the app shows:

- Personal health insurance cost
- Personal pension cost
- Company health insurance cost
- Company pension cost
- Company fixed costs
- Total combined cost

## Project structure

- `src/App.vue`: Main UI
- `src/router.js`: Route setup
- `src/main.js`: App entry point
- `tests/`: Unit tests (Vitest)

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
```

## Notes

- Calculation logic is intended to stay independent from UI as much as possible.
- National Health Insurance values are an estimate in this MVP.
- Rates and assumptions can change by year and municipality.
