import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  VStack,
  Heading,
  useToast,
  Select
} from '@chakra-ui/react';
import { Player } from '@/models/Player';

// List of available skills based on Skills_affecting_block_actions.txt
const AVAILABLE_SKILLS = [
  { id: 'block', name: 'Block' },
  { id: 'dodge', name: 'Dodge' },
  { id: 'tackle', name: 'Tackle' },
  { id: 'wrestle', name: 'Wrestle' },
  { id: 'juggernaut', name: 'Juggernaut' },
  { id: 'standfirm', name: 'Stand Firm' },
  { id: 'fend', name: 'Fend' },
  { id: 'pro', name: 'Pro' },
  { id: 'dauntless', name: 'Dauntless' },
  { id: 'brawler', name: 'Brawler' },
  { id: 'guard', name: 'Guard' },
  { id: 'grab', name: 'Grab' },
  { id: 'multipleblock', name: 'Multiple Block' },
  { id: 'horns', name: 'Horns' },
  { id: 'frenzy', name: 'Frenzy' }
];

/**
 * Component for creating new players with specific attributes.
 * 
 * @param {object} props - Component props
 * @param {string} props.team - The team identifier (e.g., 'Red' or 'Blue')
 * @param {function} props.onAddPlayer - Callback function when a player is added
 * @param {number} props.nextId - The next available player ID
 */
const PlayerCreator = ({ team, onAddPlayer, nextId }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('Lineman');
  const [strength, setStrength] = useState(3);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const toast = useToast();

  const handleAddPlayer = () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for the player',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!position.trim()) {
      toast({
        title: 'Position required',
        description: 'Please enter a position for the player',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newPlayer = new Player({
      id: nextId,
      name,
      team,
      position,
      strength,
      skills: selectedSkills,
    });

    onAddPlayer(newPlayer);

    // Reset form
    setName('');
    setPosition('Lineman');
    setStrength(3);
    setSelectedSkills([]);

    toast({
      title: 'Player added',
      description: `${name} has been added to the ${team} team`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white" shadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Add New {team} Player</Heading>
        
        <FormControl isRequired>
          <FormLabel>Player Name</FormLabel>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter player name"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Position</FormLabel>
          <Select
            placeholder="Select position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="Lineman">Lineman</option>
            <option value="Blitzer">Blitzer</option>
            <option value="Thrower">Thrower</option>
            <option value="Catcher">Catcher</option>
            <option value="Blocker">Blocker</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Strength</FormLabel>
          <NumberInput 
            min={1} 
            max={9}
            value={strength}
            onChange={(valueString) => setStrength(parseInt(valueString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Skills</FormLabel>
          <CheckboxGroup 
            colorScheme={team === 'Red' ? 'red' : 'blue'}
            value={selectedSkills}
            onChange={setSelectedSkills}
          >
            <Stack direction={['column', 'row']} wrap="wrap" spacing={[2, 5]}>
              {AVAILABLE_SKILLS.map((skill) => (
                <Checkbox key={skill.id} value={skill.id}>
                  {skill.name}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>

        <Button 
          colorScheme={team === 'Red' ? 'red' : 'blue'}
          onClick={handleAddPlayer}
        >
          Add Player
        </Button>
      </VStack>
    </Box>
  );
};

export default PlayerCreator;