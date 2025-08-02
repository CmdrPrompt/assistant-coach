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



  return (
    <Box w="100vw" h="100vh" p={0} m={0}>
      <Flex direction={{ base: "column", lg: "row" }} align="flex-start" h="100%" w="100%" p={0} m={0}>
        <Box flex="1.2" minW="312px" maxW="408px" p={2} m={0} alignSelf="flex-start">
          <VStack spacing={2} align="stretch">
            <TeamSelectionPanel
              TEAMS={TEAMS}
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam}
              openPlayerCreator={openPlayerCreator}
            />
            <TeamRoster 
              team={selectedTeam}
              // actualTeamName prop removed
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
            // actualTeamNames prop removed
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