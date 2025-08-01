import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  Tag,
  TagLabel,
  Text,
  VStack,
  Badge,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';

/**
 * Component for displaying a team's roster and allowing player selection.
 * 
 * @param {object} props - Component props
 * @param {string} props.team - The team identifier (e.g., 'Red' or 'Blue')
 * @param {string} props.actualTeamName - The actual team name (e.g., 'Imperial Guards', 'Wood Elves')
 * @param {Array} props.players - Array of Player objects in the roster
 * @param {function} props.onSelectPlayer - Callback when a player is selected for placement
 * @param {Set} props.placedPlayerIds - Set of IDs of players already placed on the pitch
 */
const TeamRoster = ({ team, actualTeamName, players, onSelectPlayer, placedPlayerIds }) => {
  const bgColor = useColorModeValue(
    team === 'Red' ? 'red.50' : 'blue.50',
    team === 'Red' ? 'red.900' : 'blue.900'
  );
  
  const headerColor = useColorModeValue(
    team === 'Red' ? 'red.600' : 'blue.600',
    team === 'Red' ? 'red.200' : 'blue.200'
  );

  // Function to format skills as a comma-separated string
  const formatSkills = (skills) => {
    if (!skills || skills.length === 0) return 'None';
    return skills.map(skill => 
      skill.charAt(0).toUpperCase() + skill.slice(1)
    ).join(', ');
  };

  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={bgColor} 
      shadow="md"
      borderColor={team === 'Red' ? 'red.300' : 'blue.300'}
      maxH="500px"
      overflowY="auto"
    >
      <VStack spacing={4} align="stretch">
        <Heading size="md" color={headerColor}>
          {team} Team Roster {actualTeamName ? `(${actualTeamName})` : ''} ({players.length} players)
        </Heading>
        
        {players.length === 0 ? (
          <Text>No players in roster. Add players using the form below.</Text>
        ) : (
          <List spacing={2}>
            {players.map((player) => {
              const isPlaced = placedPlayerIds.has(player.id);
              
              return (
                <ListItem 
                  key={player.id}
                  p={2}
                  borderWidth="1px"
                  borderRadius="md"
                  bg={isPlaced ? 'gray.100' : 'white'}
                  opacity={isPlaced ? 0.7 : 1}
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Flex align="center" mb={1}>
                        <Text fontWeight="bold" mr={2}>{player.name}</Text>
                        <Badge mr={2} colorScheme="green">
                          {player.position}
                        </Badge>
                        <Badge colorScheme={team === 'Red' ? 'red' : 'blue'}>
                          ST {player.strength}
                        </Badge>
                        {isPlaced && (
                          <Badge ml={2} colorScheme="gray">On Pitch</Badge>
                        )}
                      </Flex>
                      <Tooltip label={formatSkills(player.skills)} placement="bottom">
                        <Text fontSize="sm" noOfLines={1}>
                          Skills: {formatSkills(player.skills)}
                        </Text>
                      </Tooltip>
                    </Box>
                    <Button
                      size="sm"
                      colorScheme={team === 'Red' ? 'red' : 'blue'}
                      isDisabled={isPlaced}
                      onClick={() => onSelectPlayer(player)}
                    >
                      {isPlaced ? 'Placed' : 'Select'}
                    </Button>
                  </Flex>
                </ListItem>
              );
            })}
          </List>
        )}
      </VStack>
    </Box>
  );
};

export default TeamRoster;