import React from 'react';
import { Grid, GridItem, Tooltip, VStack, Text, Badge } from '@chakra-ui/react';

const PitchGrid = ({
  squares,
  PITCH_COLS,
  PITCH_ROWS,
  blockMode,
  blockOutcome,
  actualTeamNames,
  selectedPlayer,
  teamRosters,
  placedPlayerIds,
  handleSquareClick,
  draggedPlayer,
  setDraggedPlayer,
  draggedFrom,
  setDraggedFrom
}) => {
  // Format skills as a comma-separated string
  const formatSkills = (skills) => {
    if (!skills || skills.length === 0) return 'None';
    return skills.map(skill => 
      skill.charAt(0).toUpperCase() + skill.slice(1)
    ).join(', ');
  };

  return (
    <Grid
      w="100%"
      h={{ base: "60vw", md: "80vh" }}
      maxH="80vh"
      aspectRatio={`${PITCH_COLS}/${PITCH_ROWS}`}
      templateColumns={`repeat(${PITCH_COLS}, 1fr)`}
      templateRows={`repeat(${PITCH_ROWS}, 1fr)`}
      gap="1px"
      bg="gray.400"
      border="2px solid"
      borderColor="gray.400"
      m={0}
      alignSelf="flex-start"
    >
      {squares.map((square, index) => {
        const row = Math.floor(index / PITCH_COLS);
        const col = index % PITCH_COLS;
        const isLight = (row + col) % 2 === 0;
        const lightGreen = "#a7e9af";
        const darkGreen = "#6ec177";
        let bg = isLight ? lightGreen : darkGreen;
        const isEndZone = col === 0 || col === PITCH_COLS - 1;
        if (isEndZone) bg = "#d6bcfa";
        let borderTop, borderBottom, borderLeft, borderRight;
        const borderColor = "#e2e8f0";
        const isLeftEdge = col === 0;
        const isRightEdge = col === PITCH_COLS - 1;
        const isTopEdge = row === 0;
        const isBottomEdge = row === PITCH_ROWS - 1;
        if (isTopEdge) borderTop = `4px solid ${borderColor}`;
        if (isBottomEdge) borderBottom = `4px solid ${borderColor}`;
        if (isLeftEdge) borderLeft = `4px solid ${borderColor}`;
        if (isRightEdge) borderRight = `4px solid ${borderColor}`;
        if (col === 12) borderRight = `4px solid ${borderColor}`;
        if (col === 0) borderRight = `4px solid ${borderColor}`;
        if (col === PITCH_COLS - 2) borderRight = `4px solid ${borderColor}`;
        if (row === 3) borderBottom = `4px solid ${borderColor}`;
        if (row === 10) borderBottom = `4px solid ${borderColor}`;
        let isBlockerAssist = false;
        let isTargetAssist = false;
        if (blockMode && blockOutcome && square) {
          if (blockOutcome.blockerAssistingPlayers && Array.isArray(blockOutcome.blockerAssistingPlayers)) {
            isBlockerAssist = blockOutcome.blockerAssistingPlayers.some(ap => 
              ap && ap.player && ap.player.id === square.player.id
            );
          }
          if (blockOutcome.targetAssistingPlayers && Array.isArray(blockOutcome.targetAssistingPlayers)) {
            isTargetAssist = blockOutcome.targetAssistingPlayers.some(ap => 
              ap && ap.player && ap.player.id === square.player.id
            );
          }
        }
        let squareBg = bg;
        if (square) {
          if (square.team === 'Red') {
            squareBg = isBlockerAssist || isTargetAssist ? 'red.300' : 'red.400';
          } else {
            squareBg = isBlockerAssist || isTargetAssist ? 'blue.300' : 'blue.400';
          }
        }
        let tooltipLabel = null;
        if (square && square.player) {
          const player = square.player;
          tooltipLabel = (
            <VStack align="start" spacing={1} p={1}>
              <Text fontWeight="bold">{player.name}</Text>
              <Text>Team: {actualTeamNames[player.team] || player.team}</Text>
              <Text>Position: {player.position || 'Unknown'}</Text>
              <Text>Strength: {player.strength}</Text>
              <Text>Skills: {formatSkills(player.skills)}</Text>
              <Text>Status: {player.status}</Text>
              {isBlockerAssist && <Text color="green.500">Assisting Blocker</Text>}
              {isTargetAssist && <Text color="green.500">Assisting Target</Text>}
            </VStack>
          );
        }
        const handleDragStart = () => {
          if (square) {
            setDraggedPlayer(square);
            setDraggedFrom({ row, col });
          }
        };
        const handleDragOver = (e) => {
          e.preventDefault();
        };
        const handleDrop = () => {
          if (
            draggedPlayer &&
            (row !== draggedFrom?.row || col !== draggedFrom?.col) &&
            !squares[row * PITCH_COLS + col]
          ) {
            const newSquares = [...squares];
            newSquares[draggedFrom.row * PITCH_COLS + draggedFrom.col] = null;
            newSquares[row * PITCH_COLS + col] = draggedPlayer;
            setSquares(newSquares);
            setDraggedPlayer(null);
            setDraggedFrom(null);
          }
        };
        const handleDragEnd = () => {
          setDraggedPlayer(null);
          setDraggedFrom(null);
        };
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
            draggable={!!square}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
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
  );
};

export default PitchGrid;
