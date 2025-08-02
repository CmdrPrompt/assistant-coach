import Papa from 'papaparse';

export async function loadTeamRostersFromCSV(csvPath) {
  return new Promise((resolve, reject) => {
    fetch(csvPath)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Group by team
            const teams = {};
            results.data.forEach(row => {
              const teamName = row.Team;
              if (!teams[teamName]) teams[teamName] = [];
                            teams[teamName].push({
                                name: row.Name,
                                position: row.Position,
                                skills: typeof row.Skills === 'string' && row.Skills.trim() !== ''
                                    ? row.Skills.split(',').map(s => s.trim())
                                    : [],
                                max: parseInt(row.Max, 10) || 16,
                                cost: parseInt(row.Cost, 10) || 0,
                                strength: parseInt(row.Strength, 10) || 3,
                                movement: parseInt(row.Movement, 10) || 6,
                                agility: parseInt(row.Agility, 10) || 3,
                                armor: parseInt(row.Armor, 10) || 8,
                            });
            });
            resolve(teams);
          },
          error: (err) => reject(err)
        });
      })
      .catch(reject);
  });
}
