import React from 'react';
import { Box, Text, HStack, Select, Button } from '@chakra-ui/react';

const TeamSelectionPanel = ({
  TEAMS,
  selectedTeam,
  setSelectedTeam,
  openPlayerCreator
}) => (
  <Box mb={2}>
     <Text fontWeight="bold" fontSize="lg" mb={1}>Select Team</Text>
     <Text fontSize="md" color={selectedTeam === 'Red' ? 'red.600' : 'blue.600'} mb={1}>
       Team name: <b>{selectedTeam}</b>
     </Text>
    <HStack spacing={4}>
      {TEAMS.map(team => (
        <label key={team} style={{ marginRight: 8 }}>
          <input
            type="radio"
            name="selectedTeam"
            value={team}
            checked={selectedTeam === team}
            onChange={e => setSelectedTeam(e.target.value)}
          />
          {team}
        </label>
      ))}
    </HStack>
  </Box>
);

export default TeamSelectionPanel;
