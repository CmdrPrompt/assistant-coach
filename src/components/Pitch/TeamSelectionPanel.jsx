import React from 'react';
import { Box, Text, HStack, Select, Button } from '@chakra-ui/react';

const TeamSelectionPanel = ({
  TEAMS,
  selectedTeam,
  setSelectedTeam,
  generateTestPlayers,
  openPlayerCreator
}) => (
  <Box mb={2}>
    <Text fontWeight="bold" mb={1} fontSize="md">Team Selection & Test Teams</Text>
    <HStack spacing={2}>
      <Select 
        value={selectedTeam} 
        onChange={e => setSelectedTeam(e.target.value)} 
        maxW="160px"
        size="sm"
      >
        {TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
      </Select>
      <Button 
        colorScheme="teal" 
        size="sm" 
        px={4}
        onClick={generateTestPlayers}
      >
        Generate Test Teams
      </Button>
    </HStack>
    <Button colorScheme="purple" size="sm" mt={2} onClick={openPlayerCreator}>
      Add New Player
    </Button>
  </Box>
);

export default TeamSelectionPanel;
