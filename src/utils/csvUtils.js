// Utility to parse TSV/CSV files for team rosters
// Only uses JavaScript, no external dependencies

export function parseTSV(tsvString) {
  const lines = tsvString.trim().split(/\r?\n/);
  const headers = lines[0].split('\t');
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split('\t');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i] ? values[i].trim() : '';
    });
    return obj;
  });
}

export function getTeamsFromTSV(tsvString) {
  const rows = parseTSV(tsvString);
  const teams = Array.from(new Set(rows.map(row => row['Team Roster']).filter(Boolean)));
  return teams;
}

export function getPlayersForTeam(tsvString, teamName) {
  const rows = parseTSV(tsvString);
  return rows.filter(row => row['Team Roster'] === teamName);
}
