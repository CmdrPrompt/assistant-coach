import React from 'react';
import { Box, Text, Badge, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

const BlockInfoPanel = ({
  blockMode,
  blocker,
  target,
  blockOutcome,
  teamRosters,
  squares
}) => (
  <Box>
    {/* Unified info field for Blocker and Block Result */}
    <Alert
      status="warning"
      borderRadius="md"
      bg={
        blocker && target && blockOutcome && !blockOutcome.error
          ? '#FFF9DB'
          : blocker && !target
            ? '#FFF9DB'
            : (blocker || target)
              ? '#FFF9DB'
              : '#FFF7C2'
      }
      color={
        blocker && target && blockOutcome && !blockOutcome.error
          ? '#7C6F00'
          : blocker && !target
            ? '#7C6F00'
            : (blocker || target)
              ? '#7C6F00'
              : '#A68B00'
      }
      opacity={
        blocker || target || (blocker && target && blockOutcome && !blockOutcome.error)
          ? 1
          : 0.85
      }
      mb={4}
      style={{ minHeight: '170px', display: 'flex', alignItems: 'flex-start' }}
    >
      <AlertIcon color={blocker && !target ? '#FFD600' : '#E2D18A'} />
      <Box w="100%">
        <AlertTitle fontSize="md">
          {blocker && target && blockOutcome && !blockOutcome.error
            ? 'Block Result'
            : blocker && !target
              ? 'Blocker'
              : 'Info'}
        </AlertTitle>
        <AlertDescription>
          {/* Blocker info if only blocker is selected */}
          {blocker && !target ? (
            <Text>
              <Badge colorScheme={blocker.team === 'Red' ? 'red' : 'blue'}>
                {blocker.player.name} ({blocker.player.position}) (ST {blocker.player.strength})
              </Badge> - Now select an opponent to block
            </Text>
          ) : blocker && target && blockOutcome && !blockOutcome.error ? (
            <>
              <Text>
                <Badge colorScheme={blocker.team === 'Red' ? 'red' : 'blue'}>
                  {blocker.player.name} ({blocker.player.position})
                </Badge> 
                {' '}blocking{' '}
                <Badge colorScheme={target.team === 'Red' ? 'red' : 'blue'}>
                  {target.player.name} ({target.player.position})
                </Badge>
              </Text>
              <Text>
                Blocker Strength: {blockOutcome.blockerStrength} 
                {blockOutcome.blockerAssists > 0 && ` (${blocker.player.strength} + ${blockOutcome.blockerAssists} assists)`}
              </Text>
              {blockOutcome.blockerAssistingPlayers && Array.isArray(blockOutcome.blockerAssistingPlayers) && blockOutcome.blockerAssistingPlayers.length > 0 && (
                <Text fontSize="sm" ml={4} color="gray.600">
                  {blockOutcome.blockerAssistingPlayers.length === 1 ? 'Assist from:' : 'Assists from:'} {blockOutcome.blockerAssistingPlayers.map(ap => {
                    if (!ap || !ap.player) return null;
                    const showGuard = ap.reason === 'Guard skill';
                    return (
                      <span key={ap.player.id || Math.random()} style={{ marginRight: 8 }}>
                        <Badge colorScheme={blocker.team === 'Red' ? 'red' : 'blue'} mr={1}>
                          {ap.player.name} ({ap.player.position})
                        </Badge>
                        {showGuard && (
                          <span style={{ fontSize: '0.85em', color: '#888', marginLeft: 2 }}>
                            [Guard]
                          </span>
                        )}
                      </span>
                    );
                  })}
                </Text>
              )}
              <Text>
                Target Strength: {blockOutcome.targetStrength}
                {blockOutcome.targetAssists > 0 && ` (${target.player.strength} + ${blockOutcome.targetAssists} assists)`}
              </Text>
              {blockOutcome.targetAssistingPlayers && Array.isArray(blockOutcome.targetAssistingPlayers) && blockOutcome.targetAssistingPlayers.length > 0 && (
                <Text fontSize="sm" ml={4} color="gray.600">
                  {blockOutcome.targetAssistingPlayers.length === 1 ? 'Assist from:' : 'Assists from:'} {blockOutcome.targetAssistingPlayers.map(ap => {
                    if (!ap || !ap.player) return null;
                    const showGuard = ap.reason === 'Guard skill';
                    return (
                      <span key={ap.player.id || Math.random()} style={{ marginRight: 8 }}>
                        <Badge colorScheme={target.team === 'Red' ? 'red' : 'blue'} mr={1}>
                          {ap.player.name} ({ap.player.position})
                        </Badge>
                        {showGuard && (
                          <span style={{ fontSize: '0.85em', color: '#888', marginLeft: 2 }}>
                            [Guard]
                          </span>
                        )}
                      </span>
                    );
                  })}
                </Text>
              )}
              <Text fontWeight="bold" mt={2}>
                Roll {blockOutcome.diceCount} block dice, {blockOutcome.chooser === 'blocker' ? 'blocker' : 'defender'} chooses
              </Text>
            </>
          ) : (
            <Text fontStyle="italic" color="#B8A96A">
              {(!blocker && !target && (!blockOutcome || !blockOutcome.error)) ?
                (() => {
                  // Count players from each team on the pitch
                  const redOnPitch = squares && squares.some(sq => sq && sq.player && sq.player.team === 'Red');
                  const blueOnPitch = squares && squares.some(sq => sq && sq.player && sq.player.team === 'Blue');
                  if (redOnPitch && blueOnPitch) {
                    return 'Välj en Blocker genom att klicka på en spelare på planen.';
                  } else if (teamRosters && teamRosters.Red && teamRosters.Blue && teamRosters.Red.length > 0 && teamRosters.Blue.length > 0) {
                    return 'Välj ett lag (rött eller blått), klicka på "Select" för en spelare och placera spelaren på planen genom att klicka på en ruta.';
                  } else {
                    return 'Lägg till lag via lagbyggaren för att börja.';
                  }
                })()
                : 'Ingen block-info ännu'}
            </Text>
          )}
        </AlertDescription>
      </Box>
    </Alert>
    {/* ...existing code for blockMode UI... */}
    {blockMode && blocker && target && blockOutcome && blockOutcome.error && (
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
);

export default BlockInfoPanel;
