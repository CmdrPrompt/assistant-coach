// Utility to parse TSV/CSV files for team rosters
// Only uses JavaScript, no external dependencies

export function parseCSV(csvString) {
  const lines = typeof csvString === 'string' ? csvString.trim().split(/\r?\n/) : [];
  const headers = Array.isArray(lines) && typeof lines[0] === 'string'
    ? lines[0].split(';').map(h => typeof h === 'string' ? h.trim() : '')
    : [];
  console.log('CSV headers:', headers);
  if (lines[1]) console.log('First data row:', lines[1].split(';'));
  return lines.slice(1)
    .filter(line => line.trim() && line.split(';')[0].trim())
    .map((line, idx) => {
      let values = line.split(';');
      if (values.length !== headers.length) {
        console.warn('CSV row has wrong number of columns:', { idx, values });
        if (values.length < headers.length) {
          values = values.concat(Array(headers.length - values.length).fill(''));
        }
      }
      const obj = {};
      headers.forEach((header, i) => {
        const val = values[i];
        obj[header.trim()] = typeof val === 'string' ? val.trim() : '';
      });
      return obj;
    });
}

export function getTeamsFromCSV(csvString) {
  const rows = parseCSV(csvString);
  const teams = Array.from(new Set(rows.map(row => row['Team']).filter(Boolean)));
  return teams;
}

export function getPlayersForTeam(csvString, teamName) {
  const rows = parseCSV(csvString);
  return rows.filter(row => row['Team'] === teamName);
}

