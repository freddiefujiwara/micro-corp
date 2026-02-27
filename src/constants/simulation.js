export const DEFAULT_PARAMS = {
  birthYear: 1985,
  dependents: 0,
  previousSalary: 400000,
  taxableIncome: 2000000,
  monthlyRemuneration: 100000,
  corporateFixedCost: 70000,
};

export const FORM_FIELDS = [
  { key: 'birthYear', label: '生年 (西暦)', sensitive: false },
  { key: 'dependents', label: '扶養人数 (本人除く)', sensitive: false },
  { key: 'previousSalary', label: '退職前給与 (月額)', sensitive: true },
  { key: 'taxableIncome', label: '課税所得 (年額)', sensitive: true },
  { key: 'monthlyRemuneration', label: '役員報酬 (月額)', sensitive: true },
  { key: 'corporateFixedCost', label: '法人固定費 (年額)', sensitive: true },
];
