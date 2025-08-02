// Loads and parses Team_Rosters.csv from public folder
// Returns all teams and their player rows
import { parseCSV, getTeamsFromCSV, getPlayersForTeam } from './csvUtils';

export async function loadTeamRosters() {
  const response = await fetch('TeamRosters.csv');
  const csv = await response.text();
  console.log('Loaded CSV:', csv.slice(0, 500));
  const teams = getTeamsFromCSV(csv);
  console.log('Parsed teams:', teams);
  return {
    teams,
    csv,
  };
}

export function getTeamPlayers(csv, teamName) {
  return getPlayersForTeam(csv, teamName);
}
