const currentYear = new Date().getFullYear();

const birthYearOptions = Array.from({ length: currentYear - 1949 }, (_, index) => {
  const year = currentYear - index;
  return { value: year, label: `${year}年` };
});

const dependentOptions = Array.from({ length: 11 }, (_, dependents) => ({
  value: dependents,
  label: `${dependents}人`,
}));

export const DEFAULT_PARAMS = {
  birthYear: 1985,
  dependents: 0,
  previousSalary: 400000,
  taxableIncome: 2000000,
  monthlyRemuneration: 100000,
  corporateFixedCost: 70000,
};

export const FORM_FIELDS = [
  {
    key: 'birthYear',
    label: '生年 (西暦)',
    sensitive: false,
    type: 'select',
    options: birthYearOptions,
  },
  {
    key: 'dependents',
    label: '扶養人数 (本人除く)',
    sensitive: false,
    type: 'select',
    options: dependentOptions,
  },
  { key: 'previousSalary', label: '退職前給与 (月額)', sensitive: true, type: 'number' },
  { key: 'taxableIncome', label: '課税所得 (年額)', sensitive: true, type: 'number' },
  { key: 'monthlyRemuneration', label: '役員報酬 (月額)', sensitive: true, type: 'number' },
  { key: 'corporateFixedCost', label: '法人固定費 (年額)', sensitive: true, type: 'number' },
];
