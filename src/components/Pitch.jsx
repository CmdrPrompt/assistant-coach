import React, { useState, useEffect } from 'react';
import { 
  useBreakpointValue, 
  Box, 
  Flex, 
  VStack, 
  useDisclosure
} from '@chakra-ui/react';
import PlayerDetailsModal from './Pitch/PlayerDetailsModal';
import PlayerCreatorModal from './Pitch/PlayerCreatorModal';
import TeamSelectionPanel from './Pitch/TeamSelectionPanel';
import BlockInfoPanel from './Pitch/BlockInfoPanel';
import PitchGrid from './Pitch/PitchGrid';
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

  // Drag and drop state
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  
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
  const { isOpen, onClose } = useDisclosure();
  const [selectedSquarePlayer] = useState(null);

  // Modal for PlayerCreator
  const {
    isOpen: isPlayerCreatorOpen,
    onOpen: openPlayerCreator,
    onClose: closePlayerCreator
  } = useDisclosure();
  
  // Block action state
  const blockMode = true;
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
    // If a player is selected, always allow placement
    if (selectedPlayer) {
      // Place the selected player on the square if it's empty
      if (squares[index]) return;
      const newSquares = [...squares];
      newSquares[index] = { 
        team: selectedPlayer.team, 
        number: teamRosters[selectedPlayer.team].findIndex(p => p.id === selectedPlayer.id) + 1,
        player: selectedPlayer 
      };
      setSquares(newSquares);
      setPlacedPlayerIds(prev => new Set([...prev, selectedPlayer.id]));
      setSelectedPlayer(null);
      return;
    }

    // If no player is selected, run block mode logic
    if (squares[index]) {
      const clickedSquare = { ...squares[index], index };
      if (!blocker) {
        setBlocker(clickedSquare);
      } else if (!target) {
        if (clickedSquare.team === blocker.team) {
          return;
        }
        setTarget(clickedSquare);
        calculateBlock();
        console.log('Block outcome calculated:', {
          blocker: blocker.player.name,
          target: clickedSquare.player.name,
          outcome: blockOutcome
        });
      } else {
        setBlocker(clickedSquare);
        setTarget(null);
        setBlockOutcome(null);
      }
    } else {
      // If clicking an empty square with no player selected, do nothing
      return;
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


  return (
    <Box w="100vw" h="100vh" p={0} m={0}>
      <Flex direction={{ base: "column", lg: "row" }} align="flex-start" h="100%" w="100%" p={0} m={0}>
        <Box flex="1.2" minW="312px" maxW="408px" p={2} m={0} alignSelf="flex-start">
          <VStack spacing={2} align="stretch">
            <TeamSelectionPanel
              TEAMS={TEAMS}
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam}
              generateTestPlayers={generateTestPlayers}
              openPlayerCreator={openPlayerCreator}
            />
            <TeamRoster 
              team={selectedTeam}
              actualTeamName={actualTeamNames[selectedTeam]}
              players={teamRosters[selectedTeam]}
              onSelectPlayer={handleSelectPlayer}
              placedPlayerIds={placedPlayerIds}
            />
          </VStack>
        </Box>
        <Box flex="2" h="100%" p={0} m={0} alignSelf="flex-start">
          <VStack spacing={2} align="stretch" mb={2} h="auto">
            <BlockInfoPanel
              blockMode={blockMode}
              blocker={blocker}
              target={target}
              blockOutcome={blockOutcome}
            />
          </VStack>
          <PitchGrid
            squares={squares}
            setSquares={setSquares}
            PITCH_COLS={PITCH_COLS}
            PITCH_ROWS={PITCH_ROWS}
            blockMode={blockMode}
            blockOutcome={blockOutcome}
            actualTeamNames={actualTeamNames}
            selectedPlayer={selectedPlayer}
            handleSquareClick={handleSquareClick}
            draggedPlayer={draggedPlayer}
            setDraggedPlayer={setDraggedPlayer}
            draggedFrom={draggedFrom}
            setDraggedFrom={setDraggedFrom}
          />
        </Box>
      </Flex>
      {/* Player Details Modal */}
      <PlayerDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        player={selectedSquarePlayer}
      />
      {/* Player Creator Modal */}
      <PlayerCreatorModal
        isOpen={isPlayerCreatorOpen}
        onClose={closePlayerCreator}
        team={selectedTeam}
        onAddPlayer={handleAddPlayer}
        nextId={nextPlayerId}
      />
    </Box>
  );
};

export default Pitch;