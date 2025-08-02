import React from 'react';
import { Box, Heading, VStack } from '@chakra-ui/react';
import Pitch from '@/components/Pitch';

function App() {
  return (
    <Box bg="white" minH="100vh" color="gray.800" p={{ base: 2, md: 4 }}>
      <VStack spacing={{ base: 4, md: 6 }} justify="center" minH="100vh">
        <Heading
          as="h1"
          size={{ base: 'xl', md: '2xl' }}
          color="gray.700"
          textAlign="center"
        >
          Assistant Coach
        </Heading>
        <Pitch />
      </VStack>
    </Box>
  );
}

export default App;