// Loads and parses Team_Rosters.csv from public folder
// Returns all teams and their player rows
import { parseTSV, getTeamsFromTSV, getPlayersForTeam } from './csvUtils';

export async function loadTeamRosters() {
  const response = await fetch('/Team_Rosters.csv');
  const tsv = await response.text();
  return {
    teams: getTeamsFromTSV(tsv),
    tsv,
  };
}

export function getTeamPlayers(tsv, teamName) {
  return getPlayersForTeam(tsv, teamName);
}
