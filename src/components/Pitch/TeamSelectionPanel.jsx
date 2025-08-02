import React from 'react';
import { Box, Text, HStack, Select, Button } from '@chakra-ui/react';

const TeamSelectionPanel = ({
  TEAMS,
  selectedTeam,
  setSelectedTeam,
  openPlayerCreator
}) => (
  <Box mb={2}>
    <Text fontWeight="bold" mb={1} fontSize="md">Team Selection</Text>
    <HStack spacing={2}>
      <Select 
        value={selectedTeam} 
        onChange={e => setSelectedTeam(e.target.value)} 
        maxW="160px"
        size="sm"
      >
        {TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
      </Select>
    </HStack>
    <Button colorScheme="purple" size="sm" mt={2} onClick={openPlayerCreator}>
      Add New Player
    </Button>
  </Box>
);

export default TeamSelectionPanel;
