import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  GridItem, 
  useBreakpointValue, 
  Select, 
  Box, 
  Flex, 
  VStack, 
  HStack, 
  Tooltip,
  Text,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import PlayerCreator from './PlayerCreator';
import TeamRoster from './TeamRoster';
import { Player } from '@/models/Player';
import { calculateBlockOutcome } from '@/utils/calculateBlockOutcome';

const FORMATS = {
  standard: { cols: 26, rows: 15, maxPlayers: 11 },
  sevens: { cols: 20, rows: 11, maxPlayers: 7 },
};

const createEmptyGrid = (cols, rows) => Array.from({ length: cols * rows }, () => null);

const TEAMS = ['Red', 'Blue'];

const Pitch = () => {
  const [format] = useState('standard');
  const isPortrait = useBreakpointValue({ base: true, md: true, lg: false });
  const { cols, rows } = FORMATS[format];
  const PITCH_COLS = isPortrait ? Math.min(cols, rows) : cols;
  const PITCH_ROWS = isPortrait ? Math.max(cols, rows) : rows;

  // State for grid squares
  const [squares, setSquares] = useState(createEmptyGrid(PITCH_COLS, PITCH_ROWS));
  
  // State for team selection and rosters
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0]);
  const [teamRosters, setTeamRosters] = useState({
    Red: [],
    Blue: []
  });
  
  // Track actual team names (Imperial Guards, Wood Elves, etc.)
  const [actualTeamNames, setActualTeamNames] = useState({
    Red: '',
    Blue: ''
  });
  
  // State for player selection
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // Track placed players
  const [placedPlayerIds, setPlacedPlayerIds] = useState(new Set());
  
  // Next available player ID
  const [nextPlayerId, setNextPlayerId] = useState(1);
  
  // Modal for player details
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSquarePlayer, setSelectedSquarePlayer] = useState(null);
  
  // Block action state
  const [blockMode, setBlockMode] = useState(false);
  const [blocker, setBlocker] = useState(null);
  const [target, setTarget] = useState(null);
  const [blockOutcome, setBlockOutcome] = useState(null);
  
  // Recalculate block outcome whenever blocker or target changes
  useEffect(() => {
    if (blocker && target) {
      // Define the calculation function inside the effect to avoid dependency issues
      const calculateBlockEffect = () => {
        if (!blocker || !target) return;
    
        // Convert to the format expected by calculateBlockOutcome
        const grid = [];
        squares.forEach((square, index) => {
          const row = Math.floor(index / PITCH_COLS);
          const col = index % PITCH_COLS;
          
          if (!grid[row]) grid[row] = [];
          grid[row][col] = square ? { player: square.player } : null;
        });
    
        const blockerPos = { 
          row: Math.floor(blocker.index / PITCH_COLS), 
          col: blocker.index % PITCH_COLS 
        };
        const targetPos = { 
          row: Math.floor(target.index / PITCH_COLS), 
          col: target.index % PITCH_COLS 
        };
    
        const outcome = calculateBlockOutcome(grid, blockerPos, targetPos);
        setBlockOutcome(outcome);
      };
      
      calculateBlockEffect();
    }
  }, [blocker, target, squares, PITCH_COLS]);

  // Handle adding a new player to the roster
  const handleAddPlayer = (player) => {
    setTeamRosters(prev => ({
      ...prev,
      [player.team]: [...prev[player.team], player]
    }));
    setNextPlayerId(prev => prev + 1);
  };

  // Handle selecting a player from the roster
  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
  };

  // Toggle block mode
  const toggleBlockMode = () => {
    setBlockMode(!blockMode);
    setBlocker(null);
    setTarget(null);
    setBlockOutcome(null);
  };

  // Calculate block outcome
  const calculateBlock = () => {
    if (!blocker || !target) return;

    // Convert to the format expected by calculateBlockOutcome
    const grid = [];
    squares.forEach((square, index) => {
      const row = Math.floor(index / PITCH_COLS);
      const col = index % PITCH_COLS;
      
      if (!grid[row]) grid[row] = [];
      grid[row][col] = square ? { player: square.player } : null;
    });

    const blockerPos = { 
      row: Math.floor(blocker.index / PITCH_COLS), 
      col: blocker.index % PITCH_COLS 
    };
    const targetPos = { 
      row: Math.floor(target.index / PITCH_COLS), 
      col: target.index % PITCH_COLS 
    };

    const outcome = calculateBlockOutcome(grid, blockerPos, targetPos);
    setBlockOutcome(outcome);
    
    // Log for debugging
    console.log('Block outcome calculated inside function:', {
      blocker: blocker.player.name,
      target: target.player.name,
      outcome: outcome
    });
  };

  // Handle clicking on a square
  const handleSquareClick = (index) => {
    if (blockMode) {
      // In block mode, handle selecting blocker and target
      if (!squares[index]) return; // Can only select occupied squares in block mode
      
      const clickedSquare = { ...squares[index], index };
      
      if (!blocker) {
        // First click in block mode selects the blocker
        setBlocker(clickedSquare);
      } else if (!target) {
        // Second click selects the target if it's on the opposing team
        if (clickedSquare.team === blocker.team) {
          // Can't block your own team
          return;
        }
        setTarget(clickedSquare);
        
      // Calculate block outcome after selecting target
      calculateBlock();
      
      // Log for debugging
      console.log('Block outcome calculated:', {
        blocker: blocker.player.name,
        target: clickedSquare.player.name,
        outcome: blockOutcome
      });
      } else {
        // Reset selections if both are already selected
        setBlocker(clickedSquare);
        setTarget(null);
        setBlockOutcome(null);
      }
    } else {
      // Normal mode - place players or view details
      if (squares[index]) {
        setSelectedSquarePlayer(squares[index].player);
        onOpen();
        return;
      }
      
      // If no player is selected, do nothing
      if (!selectedPlayer) return;
      
      // Place the selected player on the square
      const newSquares = [...squares];
      newSquares[index] = { 
        team: selectedPlayer.team, 
        number: teamRosters[selectedPlayer.team].findIndex(p => p.id === selectedPlayer.id) + 1,
        player: selectedPlayer 
      };
      setSquares(newSquares);
      
      // Mark the player as placed
      setPlacedPlayerIds(prev => new Set([...prev, selectedPlayer.id]));
      
      // Clear the selected player
      setSelectedPlayer(null);
    }
  };

  // Generate test players for both teams based on Blood Bowl teams
  const generateTestPlayers = () => {
    // Clear existing rosters and placed players
    setTeamRosters({ Red: [], Blue: [] });
    setPlacedPlayerIds(new Set());
    setSquares(createEmptyGrid(PITCH_COLS, PITCH_ROWS));
    
    // Team data based on Team_Rosters.csv with position-specific skills
    const teamData = {
      'Imperial Guards': {
        positions: [
          { 
            name: 'Retainer Lineman', 
            count: 6, 
            strength: 3,
            skills: ['fend']
          },
          { 
            name: 'Thrower', 
            count: 1, 
            strength: 3,
            skills: ['pass', 'running pass']
          },
          { 
            name: 'Blitzer', 
            count: 2, 
            strength: 3,
            skills: ['block', 'catch']
          },
          { 
            name: 'Bodyguard', 
            count: 2, 
            strength: 3,
            skills: ['stand firm', 'wrestle', 'guard'] // Added Guard skill
          }
        ]
      },
      'Wood Elves': {
        positions: [
          { 
            name: 'Lineman', 
            count: 6, 
            strength: 3,
            skills: []
          },
          { 
            name: 'Thrower', 
            count: 1, 
            strength: 3,
            skills: ['pass']
          },
          { 
            name: 'Catcher', 
            count: 2, 
            strength: 2,
            skills: ['catch', 'dodge']
          },
          { 
            name: 'Wardancer', 
            count: 2, 
            strength: 3,
            skills: ['block', 'dodge', 'leap', 'guard'] // Added Guard skill
          }
        ]
      },
      'Orcs': {
        positions: [
          { 
            name: 'Lineman', 
            count: 6, 
            strength: 3,
            skills: ['animosity']
          },
          { 
            name: 'Thrower', 
            count: 1, 
            strength: 3,
            skills: ['animosity', 'pass', 'sure hands']
          },
          { 
            name: 'Blitzer', 
            count: 2, 
            strength: 3,
            skills: ['animosity', 'block', 'guard'] // Added Guard skill
          },
          { 
            name: 'Big-Un Blocker', 
            count: 2, 
            strength: 4,
            skills: ['animosity', 'guard'] // Added Guard skill
          }
        ]
      },
      'Norse': {
        positions: [
          { 
            name: 'Raider Lineman', 
            count: 6, 
            strength: 3,
            skills: ['block', 'drunkard', 'thick skull']
          },
          { 
            name: 'Valkyrie', 
            count: 1, 
            strength: 3,
            skills: ['catch', 'dauntless', 'pass', 'strip ball']
          },
          { 
            name: 'Berserker', 
            count: 2, 
            strength: 3,
            skills: ['block', 'frenzy', 'jump up', 'guard'] // Added Guard skill
          },
          { 
            name: 'Ulfwerener', 
            count: 2, 
            strength: 4,
            skills: ['frenzy']
          }
        ]
      }
    };
    
    // Randomly select two different teams
    const teamNames = Object.keys(teamData);
    const redTeamIndex = Math.floor(Math.random() * teamNames.length);
    let blueTeamIndex;
    do {
      blueTeamIndex = Math.floor(Math.random() * teamNames.length);
    } while (blueTeamIndex === redTeamIndex);
    
    const redTeamName = teamNames[redTeamIndex];
    const blueTeamName = teamNames[blueTeamIndex];
    
    // Common Anglo-Saxon names, alphabetically sorted
    const redTeamNames = [
      'Adam', 'Alfred', 'Arthur', 'Ashton', 'Austin',
      'Baldwin', 'Bernard', 'Blake', 'Bradley', 'Brandon', 'Bruce'
    ];
    
    const blueTeamNames = [
      'Caleb', 'Carter', 'Charles', 'Chester', 'Christopher',
      'Daniel', 'David', 'Derek', 'Duncan', 'Dustin', 'Dylan'
    ];
    
    // Generate players for both teams
    let newId = 1;
    const newRosters = { Red: [], Blue: [] };
    
    // Create Red team
    let nameIndex = 0;
    teamData[redTeamName].positions.forEach(pos => {
      for (let i = 0; i < pos.count; i++) {
        if (nameIndex >= redTeamNames.length) break;
        
        // Get name from the appropriate set
        const name = redTeamNames[nameIndex++];
        
        // Adjust strength slightly for variety (±1)
        const strengthAdjustment = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const strength = Math.max(2, Math.min(5, pos.strength + strengthAdjustment));
        
        // Use position-specific skills from team data
        const skills = [...pos.skills];
        
        // Create player
        const player = new Player({
          id: newId++,
          name,
          team: 'Red',
          position: pos.name,
          strength,
          skills
        });
        
        newRosters.Red.push(player);
      }
    });
    
    // Create Blue team
    nameIndex = 0;
    teamData[blueTeamName].positions.forEach(pos => {
      for (let i = 0; i < pos.count; i++) {
        if (nameIndex >= blueTeamNames.length) break;
        
        // Get name from the appropriate set
        const name = blueTeamNames[nameIndex++];
        
        // Adjust strength slightly for variety (±1)
        const strengthAdjustment = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const strength = Math.max(2, Math.min(5, pos.strength + strengthAdjustment));
        
        // Use position-specific skills from team data
        const skills = [...pos.skills];
        
        // Create player
        const player = new Player({
          id: newId++,
          name,
          team: 'Blue',
          position: pos.name,
          strength,
          skills
        });
        
        newRosters.Blue.push(player);
      }
    });
    
    console.log(`Generated Red team: ${redTeamName}, Blue team: ${blueTeamName}`);
    setTeamRosters(newRosters);
    setNextPlayerId(newId);
    
    // Set the actual team names
    setActualTeamNames({
      Red: redTeamName,
      Blue: blueTeamName
    });
  };

  // Format skills as a comma-separated string
  const formatSkills = (skills) => {
    if (!skills || skills.length === 0) return 'None';
    return skills.map(skill => 
      skill.charAt(0).toUpperCase() + skill.slice(1)
    ).join(', ');
  };

  return (
    <Box>
      <Flex direction={{ base: "column", lg: "row" }} spacing={4} mb={4}>
        <Box flex="1" mr={{ base: 0, lg: 4 }} mb={{ base: 4, lg: 0 }}>
          <VStack spacing={4} align="stretch">
            <Select 
              value={selectedTeam} 
              onChange={e => setSelectedTeam(e.target.value)} 
              maxW="200px" 
              mb={2}
            >
              {TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
            </Select>
            
            <TeamRoster 
              team={selectedTeam}
              actualTeamName={actualTeamNames[selectedTeam]}
              players={teamRosters[selectedTeam]}
              onSelectPlayer={handleSelectPlayer}
              placedPlayerIds={placedPlayerIds}
            />
            
            <PlayerCreator 
              team={selectedTeam}
              onAddPlayer={handleAddPlayer}
              nextId={nextPlayerId}
            />
          </VStack>
        </Box>
        
        <Box flex="2">
          <VStack spacing={3} align="stretch" mb={4}>
            <Flex justify="space-between" align="center">
              {/* Block mode toggle */}
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="block-mode" mb="0">
                  Block Mode
                </FormLabel>
                <Switch 
                  id="block-mode" 
                  isChecked={blockMode} 
                  onChange={toggleBlockMode} 
                  colorScheme="purple"
                />
              </FormControl>
              
              {/* Test mode button */}
              <Button 
                colorScheme="teal" 
                size="sm" 
                onClick={generateTestPlayers}
                ml={2}
              >
                Generate Test Teams
              </Button>
            </Flex>
            
            {/* Instructions based on current mode */}
            {blockMode ? (
              <Box>
                {!blocker && !target && (
                  <Text>Select a player to be the blocker</Text>
                )}
                {blocker && !target && (
                  <Text>
                    Blocker: <Badge colorScheme={blocker.team === 'Red' ? 'red' : 'blue'}>
                      {blocker.player.name} (ST {blocker.player.strength})
                    </Badge> - Now select an opponent to block
                  </Text>
                )}
                {blocker && target && blockOutcome && !blockOutcome.error && (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Block Result</AlertTitle>
                      <AlertDescription>
                        <Text>
                          <Badge colorScheme={blocker.team === 'Red' ? 'red' : 'blue'}>
                            {blocker.player.name}
                          </Badge> 
                          {' '}blocking{' '}
                          <Badge colorScheme={target.team === 'Red' ? 'red' : 'blue'}>
                            {target.player.name}
                          </Badge>
                        </Text>
                        <Text>
                          Blocker Strength: {blockOutcome.blockerStrength} 
                          {blockOutcome.blockerAssists > 0 && ` (${blocker.player.strength} + ${blockOutcome.blockerAssists} assists)`}
                        </Text>
                        {blockOutcome.blockerAssistingPlayers && Array.isArray(blockOutcome.blockerAssistingPlayers) && blockOutcome.blockerAssistingPlayers.length > 0 && (
                          <Text fontSize="sm" ml={4} color="gray.600">
                            Assists from: {blockOutcome.blockerAssistingPlayers.map(ap => 
                              ap && ap.player && (
                                <Badge key={ap.player.id || Math.random()} colorScheme={blocker.team === 'Red' ? 'red' : 'blue'} mr={1}>
                                  {ap.player.name}
                                </Badge>
                              )
                            )}
                          </Text>
                        )}
                        <Text>
                          Target Strength: {blockOutcome.targetStrength}
                          {blockOutcome.targetAssists > 0 && ` (${target.player.strength} + ${blockOutcome.targetAssists} assists)`}
                        </Text>
                        {blockOutcome.targetAssistingPlayers && Array.isArray(blockOutcome.targetAssistingPlayers) && blockOutcome.targetAssistingPlayers.length > 0 && (
                          <Text fontSize="sm" ml={4} color="gray.600">
                            Assists from: {blockOutcome.targetAssistingPlayers.map(ap => 
                              ap && ap.player && (
                                <Badge key={ap.player.id || Math.random()} colorScheme={target.team === 'Red' ? 'red' : 'blue'} mr={1}>
                                  {ap.player.name}
                                </Badge>
                              )
                            )}
                          </Text>
                        )}
                        <Text fontWeight="bold" mt={2}>
                          Roll {blockOutcome.diceCount} block dice, {blockOutcome.chooser === 'blocker' ? 'blocker' : 'defender'} chooses
                        </Text>
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
                {blocker && target && blockOutcome && blockOutcome.error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Invalid Block</AlertTitle>
                      <AlertDescription>
                        {blockOutcome.error}
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
              </Box>
            ) : (
              <Box>
                {selectedPlayer ? (
                  <Text fontWeight="bold" color={selectedPlayer.team === 'Red' ? 'red.500' : 'blue.500'}>
                    Click on the pitch to place {selectedPlayer.name} (ST {selectedPlayer.strength})
                  </Text>
                ) : (
                  <Text>Select a player from the roster to place on the pitch, or click on a placed player to view details</Text>
                )}
              </Box>
            )}
          </VStack>
          
          <Grid
            w="100%"
            aspectRatio={`${PITCH_COLS}/${PITCH_ROWS}`}
            templateColumns={`repeat(${PITCH_COLS}, 1fr)`}
            templateRows={`repeat(${PITCH_ROWS}, 1fr)`}
            gap="2px"
            bg="gray.400"
            border="4px solid"
            borderColor="gray.400"
          >
            {squares.map((square, index) => {
                const row = Math.floor(index / PITCH_COLS);
                const col = index % PITCH_COLS;

                // Schackrutig bas
                const isLight = (row + col) % 2 === 0;
                const lightGreen = "#a7e9af";
                const darkGreen = "#6ec177";
                let bg = isLight ? lightGreen : darkGreen;

                // End zones: hela första och sista kolumnen
                const isEndZone = col === 0 || col === PITCH_COLS - 1;
                if (isEndZone) bg = "#d6bcfa";

                // Border styling
                let borderTop, borderBottom, borderLeft, borderRight;
                const borderColor = "#e2e8f0"; // ljusgrå

                const isLeftEdge = col === 0;
                const isRightEdge = col === PITCH_COLS - 1;
                const isTopEdge = row === 0;
                const isBottomEdge = row === PITCH_ROWS - 1;

                if (isTopEdge) borderTop = `4px solid ${borderColor}`;
                if (isBottomEdge) borderBottom = `4px solid ${borderColor}`;
                if (isLeftEdge) borderLeft = `4px solid ${borderColor}`;
                if (isRightEdge) borderRight = `4px solid ${borderColor}`;

                // Mittlinje mellan kolumn 12 och 13
                if (col === 12) borderRight = `4px solid ${borderColor}`;
                
                // End zone borders - add gray lines to delimit the end zones
                if (col === 0) borderRight = `4px solid ${borderColor}`;
                if (col === PITCH_COLS - 2) borderRight = `4px solid ${borderColor}`;
                
                // Wide zone borders - add gray lines to delimit the wide zones
                if (row === 3) borderBottom = `4px solid ${borderColor}`;
                if (row === 10) borderBottom = `4px solid ${borderColor}`;

                // Check if this square contains an assisting player
                let isBlockerAssist = false;
                let isTargetAssist = false;
                
                if (blockMode && blockOutcome && square) {
                  // Check if this player is assisting the blocker
                  if (blockOutcome.blockerAssistingPlayers && Array.isArray(blockOutcome.blockerAssistingPlayers)) {
                    isBlockerAssist = blockOutcome.blockerAssistingPlayers.some(ap => 
                      ap && ap.player && ap.player.id === square.player.id
                    );
                  }
                  
                  // Check if this player is assisting the target
                  if (blockOutcome.targetAssistingPlayers && Array.isArray(blockOutcome.targetAssistingPlayers)) {
                    isTargetAssist = blockOutcome.targetAssistingPlayers.some(ap => 
                      ap && ap.player && ap.player.id === square.player.id
                    );
                  }
                }
                
                // Determine background color based on team and assist status
                let squareBg = bg; // Default to pitch color
                if (square) {
                  if (square.team === 'Red') {
                    squareBg = isBlockerAssist || isTargetAssist ? 'red.300' : 'red.400'; // Brighter red for assists
                  } else {
                    squareBg = isBlockerAssist || isTargetAssist ? 'blue.300' : 'blue.400'; // Brighter blue for assists
                  }
                }
                
                // Create tooltip content for player info
                let tooltipLabel = null;
                if (square && square.player) {
                  const player = square.player;
                  tooltipLabel = (
                    <VStack align="start" spacing={1} p={1}>
                      <Text fontWeight="bold">{player.name}</Text>
                      <Text>Position: {player.position || 'Unknown'}</Text>
                      <Text>Strength: {player.strength}</Text>
                      <Text>Skills: {formatSkills(player.skills)}</Text>
                      <Text>Status: {player.status}</Text>
                      {isBlockerAssist && <Text color="green.500">Assisting Blocker</Text>}
                      {isTargetAssist && <Text color="green.500">Assisting Target</Text>}
                    </VStack>
                  );
                }

                const gridItem = (
                  <GridItem
                    key={index}
                    bg={squareBg}
                    borderTop={borderTop}
                    borderBottom={borderBottom}
                    borderLeft={borderLeft}
                    borderRight={borderRight}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor={selectedPlayer || square ? 'pointer' : 'default'}
                    onClick={() => handleSquareClick(index)}
                    fontWeight="bold"
                    transition="background 0.2s"
                    position="relative"
                  >
                    {square ? square.number : ''}
                  </GridItem>
                );

                return square && square.player ? (
                  <Tooltip key={index} label={tooltipLabel} placement="top" hasArrow>
                    {gridItem}
                  </Tooltip>
                ) : gridItem;
            })}
          </Grid>
        </Box>
      </Flex>

      {/* Modal for player details */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Player Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedSquarePlayer && (
              <VStack align="start" spacing={3}>
                <Box>
                  <Text fontWeight="bold">Name:</Text>
                  <Text>{selectedSquarePlayer.name}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Team:</Text>
                  <Text>{selectedSquarePlayer.team}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Position:</Text>
                  <Text>{selectedSquarePlayer.position || 'Unknown'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Strength:</Text>
                  <Text>{selectedSquarePlayer.strength}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Skills:</Text>
                  <Text>{formatSkills(selectedSquarePlayer.skills)}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Status:</Text>
                  <Text>{selectedSquarePlayer.status}</Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Pitch;