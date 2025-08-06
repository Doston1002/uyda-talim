import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { FaFilePdf } from 'react-icons/fa';

const BooksList = ({ books }) => (
  <Box>
    {books.map(book => (
      <Box
        key={book._id}
        display="flex"
        alignItems="center"
        borderWidth={1}
        borderRadius={8}
        p={3}
        mb={2}
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <Icon as={FaFilePdf} fontSize={32} color="red.500" mr={3} />
          <Box>
            <Text fontWeight="bold">{book.title}</Text>
            <Text fontSize="sm" color="gray.500">
              {book.category}
            </Text>
            <Text fontSize="sm" color="gray.400">
              {book.pdf?.split('/').pop()}
            </Text>
          </Box>
        </Box>
        <Button
          as="a"
          href={book.pdf}
          target="_blank"
          rel="noopener noreferrer"
          colorScheme="red"
          leftIcon={<FaFilePdf />}
        >
          Ochish / Yuklab olish
        </Button>
      </Box>
    ))}
  </Box>
);

export default BooksList;