import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import PlayerCreator from '../PlayerCreator';

const PlayerCreatorModal = ({ isOpen, onClose, team, onAddPlayer, nextId }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Add New Player</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        <PlayerCreator 
          team={team}
          onAddPlayer={player => {
            onAddPlayer(player);
            onClose();
          }}
          nextId={nextId}
          autoFocusName={true}
          onClose={onClose}
        />
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default PlayerCreatorModal;
