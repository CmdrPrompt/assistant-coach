import React from 'react';
import { Box, Text, Badge, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

const BlockInfoPanel = ({
  blockMode,
  blocker,
  target,
  blockOutcome
}) => (
  <Box>
    {blockMode ? (
      <>
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
          <Alert status="warning" borderRadius="md" bg="#FFF9DB" color="#7C6F00">
            <AlertIcon color="#FFD600" />
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
                    {blockOutcome.blockerAssistingPlayers.length === 1 ? 'Assist from:' : 'Assists from:'} {blockOutcome.blockerAssistingPlayers.map(ap => {
                      if (!ap || !ap.player) return null;
                      const showGuard = ap.reason === 'Guard skill';
                      return (
                        <span key={ap.player.id || Math.random()} style={{ marginRight: 8 }}>
                          <Badge colorScheme={blocker.team === 'Red' ? 'red' : 'blue'} mr={1}>
                            {ap.player.name}
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
                            {ap.player.name}
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
      </>
    ) : (
      <Box>
        <Text>Select a player from the roster to place on the pitch, or click on a placed player to view details</Text>
      </Box>
    )}
  </Box>
);

export default BlockInfoPanel;
