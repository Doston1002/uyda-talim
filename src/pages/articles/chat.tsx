import { useState } from 'react';
import { NextPage } from 'next';
import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Flex,
  useToast,
} from '@chakra-ui/react';

const ArticlePage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // User message
    setMessages(prev => [...prev, { text: input, isUser: true }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Bot message
      setMessages(prev => [...prev, { text: data.answer, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Xatolik yuz berdi",
        description: "Iltimos, qayta urinib ko'ring.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setInput('');
  };

  return (
    <Box maxWidth="800px" margin="auto" p={5}>
      <Heading as="h1" textAlign="center" mb={6}>
        Online Mentor
      </Heading>
      <VStack spacing={4} align="stretch" mb={6} height="400px" overflowY="auto" borderWidth={1} borderRadius="md" p={4}>
        {messages.map((message, index) => (
          <Flex key={index} justifyContent={message.isUser ? "flex-end" : "flex-start"}>
            <Box
              maxWidth="70%"
              p={3}
              borderRadius="md"
              bg={message.isUser ? "blue.100" : "gray.100"}
            >
              <Text>{message.text}</Text>
            </Box>
          </Flex>
        ))}
      </VStack>
      <form onSubmit={handleSubmit}>
        <Flex>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Savolingizni kiriting..."
            mr={2}
          />
          <Button type="submit" colorScheme="blue">
            Yuborish
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default ArticlePage;
