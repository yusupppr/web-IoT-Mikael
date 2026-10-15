export function formatTemperature(value) {
  if (value === undefined || value === null || isNaN(value)) return '—';
  return Number(value).toFixed(1);
}

export function formatHumidity(value) {
  if (value === undefined || value === null || isNaN(value)) return '—';
  return Math.round(Number(value)).toString();
}

export function formatTimestamp(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
}
