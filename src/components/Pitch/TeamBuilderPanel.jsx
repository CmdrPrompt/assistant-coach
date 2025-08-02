// File: src/components/Pitch/TeamBuilderPanel.jsx
import React, { useEffect, useState } from 'react';
import { Box, Select, Button, VStack, Text, Checkbox, HStack, Badge, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from '@chakra-ui/react';
import { loadTeamRosters, getTeamPlayers } from '../../utils/loadTeamRosters';


const MAX_PLAYERS = 16;

const TeamBuilderPanel = ({ isOpen, onClose, onTeamBuilt, defaultRoster }) => {
  // State hooks must be declared before any logic or useEffect that uses them
  const [teams, setTeams] = useState([]);
  const [tsv, setTsv] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [targetRoster, setTargetRoster] = useState(defaultRoster || 'Red');

  // Handler to build team and call onTeamBuilt
  const handleBuildTeam = React.useCallback(() => {
    if (selectedPlayers.length > 0 && onTeamBuilt) {
      onTeamBuilt(targetRoster, selectedPlayers);
    }
  }, [selectedPlayers, onTeamBuilt, targetRoster]);

  // Keyboard shortcut: add player by pressing 1-9/0 (0 = 10th row)
  useEffect(() => {
    if (!isOpen || !selectedTeam) return;
    const handleKeyDown = (e) => {
      // Only allow if modal is open and team is selected
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT' || document.activeElement.isContentEditable) return;
      // Enter/Return creates team if possible
      if ((e.key === 'Enter' || e.key === 'Return') && selectedPlayers.length > 0) {
        handleBuildTeam();
        onClose();
        return;
      }
      let idx = -1;
      if (e.key >= '1' && e.key <= '9') {
        idx = parseInt(e.key, 10) - 1;
      } else if (e.key === '0') {
        idx = 9;
      }
      if (idx >= 0) {
        const players = getTeamPlayers(tsv, selectedTeam);
        const sorted = [...players].sort((a, b) => {
          const aMax = parseInt(a["Max players"], 10) || 0;
          const bMax = parseInt(b["Max players"], 10) || 0;
          if (aMax !== bMax) return aMax - bMax;
          const aPos = (a.Position || '').toLowerCase();
          const bPos = (b.Position || '').toLowerCase();
          return aPos.localeCompare(bPos);
        });
        if (e.ctrlKey) {
          // Remove player of that type (ctrl+number)
          if (idx < sorted.length) {
            const player = sorted[idx];
            const pos = player.Position;
            const idxToRemove = selectedPlayers.findIndex(p => p.Position === pos);
            if (idxToRemove !== -1) {
              const newPlayers = [...selectedPlayers];
              newPlayers.splice(idxToRemove, 1);
              setSelectedPlayers(newPlayers);
            }
          }
        } else {
          // Add player of that type (number)
          if (idx < sorted.length) {
            const player = sorted[idx];
            const pos = player.Position;
            const max = parseInt(player["Max players"], 10) || MAX_PLAYERS;
            const selectedOfType = selectedPlayers.filter(p => p.Position === pos).length;
            if (selectedPlayers.length < MAX_PLAYERS && selectedOfType < max) {
              setSelectedPlayers([...selectedPlayers, { ...player }]);
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedTeam, tsv, selectedPlayers, handleBuildTeam, onClose]);

  // Helper to build table rows for player selection
  const getTableRows = () => {
    if (!selectedTeam) return null;
    const players = getTeamPlayers(tsv, selectedTeam);
    const sorted = [...players].sort((a, b) => {
      const aMax = parseInt(a["Max players"], 10) || 0;
      const bMax = parseInt(b["Max players"], 10) || 0;
      if (aMax !== bMax) return aMax - bMax;
      const aPos = (a.Position || '').toLowerCase();
      const bPos = (b.Position || '').toLowerCase();
      return aPos.localeCompare(bPos);
    });
    return sorted.map((player, idx) => {
      const pos = player.Position;
      const max = parseInt(player["Max players"], 10) || MAX_PLAYERS;
      const selectedOfType = selectedPlayers.filter(p => p.Position === pos).length;
      const playerTemplate = { ...player };
      const handleAdd = () => {
        if (selectedPlayers.length < MAX_PLAYERS && selectedOfType < max) {
          setSelectedPlayers([...selectedPlayers, playerTemplate]);
        }
      };
      const handleRemove = () => {
        if (selectedOfType > 0) {
          const idxToRemove = selectedPlayers.findIndex(p => p.Position === pos);
          if (idxToRemove !== -1) {
            const newPlayers = [...selectedPlayers];
            newPlayers.splice(idxToRemove, 1);
            setSelectedPlayers(newPlayers);
          }
        }
      };
      return (
        <tr key={idx}>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{max}</td>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', textAlign: 'left' }}>{pos}</td>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{player.MA ?? '-'}</td>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{player.ST ?? player.Strength ?? '-'}</td>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{player.AG ?? '-'}</td>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{player.PA ?? '-'}</td>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{player.AV ?? '-'}</td>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', fontSize: 'smaller', color: '#4a5568' }}>{player.skills ? player.skills.join(', ') : (player.Skills || 'None')}</td>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            {player.Cost ? `${Math.round(parseInt(player.Cost, 10) / 1000)}k` : '-'}
          </td>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{selectedOfType}</td>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Button
              size="xs"
              colorScheme="green"
              isDisabled={selectedPlayers.length >= MAX_PLAYERS || selectedOfType >= max}
              onClick={handleAdd}
            >+
            </Button>
          </td>
          <td style={{ padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Button
              size="xs"
              colorScheme="red"
              isDisabled={selectedOfType === 0}
              onClick={handleRemove}
            >-
            </Button>
          </td>
        </tr>
      );
    });
  };

  // ...existing code...


  // Update targetRoster when modal opens or defaultRoster changes
  useEffect(() => {
    if (isOpen) {
      setTargetRoster(defaultRoster || 'Red');
      // Only reset team selection when modal opens and selectedPlayers is empty
      if (!selectedPlayers || selectedPlayers.length === 0) {
        setSelectedTeam(''); // 'Välj lag' (empty value)
      } else if (selectedPlayers.length > 0) {
        // If there are selected players, set team to the team of the first player
        const firstPlayerTeam = selectedPlayers[0]?.Team;
        if (firstPlayerTeam) {
          setSelectedTeam(firstPlayerTeam);
        }
      }
    }
    // Only run this effect when modal opens or defaultRoster changes
    // Do NOT run on every selectedPlayers change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultRoster]);

  useEffect(() => {
    loadTeamRosters().then(({ teams, csv }) => {
      setTeams(teams);
      setTsv(csv);
    });
  }, []);

  useEffect(() => {
    setSelectedPlayers([]);
  }, [selectedTeam]);

  // Prepare table rows outside JSX for cleaner syntax

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent width="1000px" maxW="100vw">
        <ModalHeader>Build Team</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <HStack mb={3}>
              <Text>Select roster:</Text>
              <Select
                value={targetRoster}
                onChange={e => setTargetRoster(e.target.value)}
                width="100px"
              >
                <option value="Red">Röd</option>
                <option value="Blue">Blå</option>
              </Select>
            </HStack>
            <Select
              placeholder="Select team"
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              mb={3}
            >
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </Select>
            {selectedTeam && (
              <VStack align="start" spacing={2} mb={2}>
                {/* Laginfo från första raden för laget */}
                {(() => {
                  const teamRows = getTeamPlayers(tsv, selectedTeam);
                  if (teamRows.length > 0) {
                    const info = teamRows[0];
                    return (
                      <Box mb={2} p={2} bg="gray.50" borderRadius="md" borderWidth={1} w="100%" maxW="100%">
                        <Text fontWeight="bold" fontSize="md">Team Info</Text>
                        <Text><b>Tier:</b> {info.Tier || '-'}</Text>
                        <Text><b>Reroll:</b> {info.Reroll || '-'}</Text>
                        <Text><b>Apothecary:</b> {info.Apothecary || '-'}</Text>
                        <Text><b>Special Rules:</b> {info["Special Rules"] || '-'}</Text>
                      </Box>
                    );
                  }
                  return null;
                })()}
                <Text fontWeight="semibold">
                  Select players (max {MAX_PLAYERS} total)
                  <span style={{ marginLeft: 8, color: '#3182ce', fontWeight: 'normal', fontSize: '0.95em' }}>
                    ({selectedPlayers.length} selected)
                    {selectedPlayers.length > 0 && (() => {
                      const totalCost = selectedPlayers.reduce((sum, p) => sum + (parseInt(p.Cost, 10) || 0), 0);
                      const teamValue = Math.round(totalCost / 1000);
                      return (
                        <span style={{ marginLeft: 12, color: '#2f855a', fontWeight: 'normal', fontSize: '0.95em' }}>
                          Team Value: {teamValue}k
                        </span>
                      );
                    })()}
                  </span>
                </Text>
                <Box w="100%" maxW="100%" overflowX="auto">
                  <table style={{ minWidth: '900px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f7fafc' }}>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>Max</th>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>Position</th>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>MA</th>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>ST</th>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>AG</th>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>PA</th>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>AV</th>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>Skills</th>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>Team Value</th>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>Selected</th>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>Add</th>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getTableRows()}
                    </tbody>
                  </table>
                </Box>
              </VStack>
            )}
            {selectedPlayers.length > 0 && (
              <Box mt={3}>
                <Text fontWeight="semibold">Current lineup:</Text>
                <Box w="100%" overflowX="auto">
                  <VStack align="start" spacing={3}>
                    {selectedPlayers.map((p, i) => (
                      <Box key={i} p={2} borderWidth={1} borderRadius="md" bg="gray.50" w="100%">
                        <Box display="flex" justifyContent="space-between" alignItems="center" w="100%">
                          <Text fontWeight="bold" fontSize="md">{p.Position}</Text>
                          <Text fontSize="sm" color="gray.700" textAlign="right">
                            {p.Cost ? `${p.Cost}k` : '-'}
                          </Text>
                        </Box>
                        <Box fontSize="sm" color="gray.700" display="flex" flexWrap="wrap" gap="12px">
                          <span><b>MA:</b> {p.MA || '-'}</span>
                          <span><b>ST:</b> {p.ST || '-'}</span>
                          <span><b>AG:</b> {p.AG || '-'}</span>
                          <span><b>PA:</b> {p.PA || '-'}</span>
                          <span><b>AV:</b> {p.AV || '-'}</span>
                        </Box>
                        <Text fontSize="sm" color="gray.700">
                          Skills: {p.skills ? p.skills.join(', ') : (p.Skills || 'None')}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </Box>
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            size="sm"
            isDisabled={selectedPlayers.length === 0}
            onClick={() => {
              handleBuildTeam();
              onClose();
            }}
          >
            Build Team
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TeamBuilderPanel;
