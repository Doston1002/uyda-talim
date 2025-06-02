// import {
// 	Avatar,
// 	Box,
// 	Card,
// 	CardBody,
// 	Divider,
// 	Grid,
// 	Heading,
// 	HStack,
// 	Image,
// 	Stack,
// 	Text,
// 	useColorModeValue,
// } from '@chakra-ui/react';
// import Carousel from 'react-multi-carousel';
// import { testimonialsCarousel } from 'src/config/carousel';
// import { ArticlePageComponentProps } from './article-page-component.props';
// import { format } from 'date-fns';
// import { calculateEstimatedReadingTime } from 'src/helpers/time.helper';
// import { useTranslation } from 'react-i18next';
// import Link from 'next/link';

// const ArticlePageComponent = ({ artciles }: ArticlePageComponentProps) => {
// 	const cardBackgroundColor = useColorModeValue('white', 'gray.900');
// 	const { t } = useTranslation();

// 	return (
// 		<>
// 			mentor page
// 		</>
// 	);
// };

// export default ArticlePageComponent;




import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaSmile, FaChevronRight } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import axios from 'axios';

const ArticlePageComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Assalomu alaykum, Savollaringiz bormi?\nJavob berishdan xursand bo\'lamiz!',
      isBot: true,
    },
  ]);

  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const chatBgColor = useColorModeValue('white', 'gray.800');
  const botMessageBg = useColorModeValue('white', 'gray.700');
  const userMessageBg = useColorModeValue('blue.500', 'blue.400');
  const inputBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

 const handleSendMessage = async () => {
  if (message.trim()) {
    setMessages([...messages, { id: Date.now(), text: message, isBot: false }]);
    setMessage('');
    
    try {
     const response = await axios.post('/api/ai/chat', {
  message,
});

      
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: response.data.result, 
        isBot: true 
      }]);
    } catch (error) {
      console.error('Langdock API xatosi:', error);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: 'Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.', 
        isBot: true 
      }]);
    }
  }
};


  return (
    <Container maxW="container.md" p={0}>
      <Box
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="xl"
        bg={bgColor}
        h="80vh"
        display="flex"
        flexDirection="column"
      >
        {/* Chat messages area */}
        <Box
          flex="1"
          overflowY="auto"
          p={4}
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray',
              borderRadius: '24px',
            },
          }}
        >
          <VStack spacing={4} align="stretch">
            {messages.map((msg) => (
              <Flex
                key={msg.id}
                justify={msg.isBot ? 'flex-start' : 'flex-end'}
              >
                <Box
                  maxW="80%"
                  bg={msg.isBot ? botMessageBg : userMessageBg}
                  color={msg.isBot ? 'inherit' : 'white'}
                  p={4}
                  borderRadius="lg"
                  boxShadow="sm"
                  whiteSpace="pre-wrap"
                >
                  <Text>{msg.text}</Text>
                </Box>
              </Flex>
            ))}
          </VStack>
        </Box>

        {/* Input area */}
        <Box
          p={4}
          borderTop="1px"
          borderColor={borderColor}
          bg={chatBgColor}
        >
          <Flex align="center">
            <InputGroup size="lg">
              <Input
                placeholder="Murojaatingizni kiriting"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                bg={inputBgColor}
                borderRadius="full"
                pr="4.5rem"
              />
              <InputRightElement width="4.5rem">
                <HStack spacing={2}>
                  <Button
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    onClick={() => {}}
                  >
                    <HStack spacing={1}>
                      <Icon as={BsThreeDotsVertical} />
                      <Icon as={FaSmile} />
                    </HStack>
                  </Button>
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="blue"
                    borderRadius="full"
                    onClick={handleSendMessage}
                  >
                    <Icon as={FaChevronRight} />
                  </Button>
                </HStack>
              </InputRightElement>
            </InputGroup>
          </Flex>
        </Box>
      </Box>
    </Container>
  );
};

export default ArticlePageComponent;




// import {
//   Avatar,
//   Box,
//   Button,
//   Container,
//   Flex,
//   HStack,
//   Icon,
//   Input,
//   InputGroup,
//   InputRightElement,
//   Text,
//   useColorModeValue,
//   VStack,
// } from '@chakra-ui/react';
// import { useState } from 'react';
// import { FaSmile, FaChevronRight } from 'react-icons/fa';
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import { ArticlePageComponentProps } from './article-page-component.props';
// import { useTranslation } from 'react-i18next';

// const ArticlePageComponent = ({ articles }: ArticlePageComponentProps) => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: 'Assalomu alaykum, Savollaringiz bormi?\nJavob berishdan xursand bo\'lamiz!',
//       isBot: true,
//     },
//   ]);

//   const { t } = useTranslation();
//   const bgColor = useColorModeValue('gray.100', 'gray.700');
//   const chatBgColor = useColorModeValue('white', 'gray.800');
//   const botMessageBg = useColorModeValue('white', 'gray.700');
//   const userMessageBg = useColorModeValue('blue.500', 'blue.400');
//   const inputBgColor = useColorModeValue('white', 'gray.700');
//   const borderColor = useColorModeValue('gray.200', 'gray.600');

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       setMessages([...messages, { id: Date.now(), text: message, isBot: false }]);
//       setMessage('');
      
//       // Simulate bot response (in real app, this would be from your Langdock service)
//       setTimeout(() => {
//         setMessages(prev => [...prev, { 
//           id: Date.now(), 
//           text: 'Bu sizning so\'rovingizga javob!', 
//           isBot: true 
//         }]);
//       }, 1000);
//     }
//   };

//   return (
//     <Container maxW="container.md" p={0}>
//       <Box
//         borderRadius="2xl"
//         overflow="hidden"
//         boxShadow="xl"
//         bg={bgColor}
//         h="80vh"
//         display="flex"
//         flexDirection="column"
//       >
//         {/* Chat messages area */}
//         <Box
//           flex="1"
//           overflowY="auto"
//           p={4}
//           css={{
//             '&::-webkit-scrollbar': {
//               width: '4px',
//             },
//             '&::-webkit-scrollbar-track': {
//               width: '6px',
//             },
//             '&::-webkit-scrollbar-thumb': {
//               background: 'gray',
//               borderRadius: '24px',
//             },
//           }}
//         >
//           <VStack spacing={4} align="stretch">
//             {messages.map((msg) => (
//               <Flex
//                 key={msg.id}
//                 justify={msg.isBot ? 'flex-start' : 'flex-end'}
//               >
//                 <Box
//                   maxW="80%"
//                   bg={msg.isBot ? botMessageBg : userMessageBg}
//                   color={msg.isBot ? 'inherit' : 'white'}
//                   p={4}
//                   borderRadius="lg"
//                   boxShadow="sm"
//                   whiteSpace="pre-wrap"
//                 >
//                   <Text>{msg.text}</Text>
//                 </Box>
//               </Flex>
//             ))}
//           </VStack>
//         </Box>

//         {/* Input area */}
//         <Box
//           p={4}
//           borderTop="1px"
//           borderColor={borderColor}
//           bg={chatBgColor}
//         >
//           <Flex align="center">
//             <InputGroup size="lg">
//               <Input
//                 placeholder="Murojaatingizni kiriting"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                 bg={inputBgColor}
//                 borderRadius="full"
//                 pr="4.5rem"
//               />
//               <InputRightElement width="4.5rem">
//                 <HStack spacing={2}>
//                   <Button
//                     h="1.75rem"
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => {}}
//                   >
//                     <HStack spacing={1}>
//                       <Icon as={BsThreeDotsVertical} />
//                       <Icon as={FaSmile} />
//                     </HStack>
//                   </Button>
//                   <Button
//                     h="1.75rem"
//                     size="sm"
//                     colorScheme="blue"
//                     borderRadius="full"
//                     onClick={handleSendMessage}
//                   >
//                     <Icon as={FaChevronRight} />
//                   </Button>
//                 </HStack>
//               </InputRightElement>
//             </InputGroup>
//           </Flex>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default ArticlePageComponent;
