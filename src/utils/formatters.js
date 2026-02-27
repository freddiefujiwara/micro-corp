const yenFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
});

export const formatYen = (value) => yenFormatter.format(value);
