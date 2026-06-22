import {
	Box,
	Button,
	Divider,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { SimAuthProvider, SimLogin } from 'src/student-information-management';
import { LoginProps } from './login.props';

const Login = (_props: LoginProps) => {
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const dividerBg = useColorModeValue('white', 'gray.800');

	const handleOneIdLogin = () => {
		const authUrl = new URL(process.env.NEXT_PUBLIC_ONEID_BASE_URL!);

		authUrl.searchParams.set('response_type', 'one_code');
		authUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_ONEID_CLIENT_ID!);
		authUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_ONEID_REDIRECT_URI!);
		authUrl.searchParams.set('scope', process.env.NEXT_PUBLIC_ONEID_SCOPE!);
		authUrl.searchParams.set('state', 'random_state');

		window.location.href = authUrl.toString();
	};

	return (
		<Box
			w="full"
			maxW="md"
			mx="auto"
			bg={cardBg}
			rounded="2xl"
			shadow="xl"
			borderWidth="1px"
			borderColor={borderColor}
			p={{ base: 6, sm: 8 }}
		>
			<Stack spacing={6}>
				<Box textAlign="center">
					<Text
						fontSize={{ base: 'xl', sm: '2xl' }}
						fontWeight="bold"
						lineHeight="short"
						color={useColorModeValue('gray.800', 'gray.100')}
					>
						Tizimga kirish
					</Text>
					<Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} mt={1}>
						OneID yoki Inklyuziv Ta&apos;lim hisobi orqali
					</Text>
				</Box>

				<Button
					w="full"
					h={12}
					colorScheme="teal"
					variant="outline"
					fontWeight="semibold"
					fontSize="md"
					borderRadius="lg"
					onClick={handleOneIdLogin}
				>
					OneID orqali kirish
				</Button>

				<Box position="relative" py={1}>
					<Divider borderColor={borderColor} />
					<Text
						position="absolute"
						top="50%"
						left="50%"
						transform="translate(-50%, -50%)"
						bg={dividerBg}
						px={4}
						color={useColorModeValue('gray.400', 'gray.500')}
						fontSize="xs"
						fontWeight="medium"
						textTransform="uppercase"
						letterSpacing="wider"
					>
						yoki
					</Text>
				</Box>

				<SimAuthProvider>
					<SimLogin variant="auth" />
				</SimAuthProvider>
			</Stack>
		</Box>
	);
};

export default Login;
