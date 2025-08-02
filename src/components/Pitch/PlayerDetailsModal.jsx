import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Box,
  Text
} from '@chakra-ui/react';

const PlayerDetailsModal = ({ isOpen, onClose, player }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Player Details</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        {player && (
          <VStack align="start" spacing={3}>
            <Box>
              <Text fontWeight="bold">Name:</Text>
              <Text>{player.name}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Team:</Text>
              <Text>{player.team}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Position:</Text>
              <Text>{player.position || 'Unknown'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Strength:</Text>
              <Text>{player.strength}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Skills:</Text>
              <Text>{player.skills && player.skills.length > 0 ? player.skills.join(', ') : 'None'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Status:</Text>
              <Text>{player.status}</Text>
            </Box>
          </VStack>
        )}
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default PlayerDetailsModal;
